import React, { useState } from 'react';
import { 
  Heart, 
  Flower2, 
  Feather, 
  Sparkles, 
  CircleDot, 
  Compass, 
  Copy, 
  Check, 
  Stamp, 
  Lock, 
  Unlock, 
  Mail, 
  FileText,
  Calendar,
  PenTool,
  Bookmark
} from 'lucide-react';
import { LoveLetter, StationeryTheme, WaxSealColor } from '../types';
import { STATIONERY_THEMES, WAX_SEAL_COLORS } from '../data/themes';

interface LetterCanvasProps {
  letter: LoveLetter;
  onUpdateLetter: (updated: Partial<LoveLetter>) => void;
  onOpenSealModal: () => void;
  onOpenPolishModal: () => void;
  onOpenAiMuse: () => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}

export const LetterCanvas: React.FC<LetterCanvasProps> = ({
  letter,
  onUpdateLetter,
  onOpenSealModal,
  onOpenPolishModal,
  onOpenAiMuse,
  isEditing,
  setIsEditing,
}) => {
  const [copied, setCopied] = useState(false);
  const [showEnvelopeView, setShowEnvelopeView] = useState(false);

  // Active theme
  const theme: StationeryTheme = 
    STATIONERY_THEMES.find((t) => t.id === letter.themeId) || STATIONERY_THEMES[0];

  // Active wax seal color
  const sealColor: WaxSealColor = 
    WAX_SEAL_COLORS.find((c) => c.id === letter.sealColor) || WAX_SEAL_COLORS[0];

  // Helper icon for seal
  const renderSealIcon = (iconName: string) => {
    switch (iconName) {
      case 'rose':
        return <Flower2 className="w-5 h-5 text-amber-200 drop-shadow" />;
      case 'feather':
        return <Feather className="w-5 h-5 text-amber-200 drop-shadow" />;
      case 'sparkle':
        return <Sparkles className="w-5 h-5 text-amber-200 drop-shadow" />;
      case 'rings':
        return <CircleDot className="w-5 h-5 text-amber-200 drop-shadow" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-amber-200 drop-shadow" />;
      case 'heart':
      default:
        return <Heart className="w-5 h-5 text-amber-200 drop-shadow fill-amber-200/30" />;
    }
  };

  // Font family class
  const getFontClass = () => {
    switch (letter.fontStyle) {
      case 'cormorant':
        return 'font-cormorant';
      case 'newsreader':
        return 'font-newsreader';
      case 'alex':
        return 'font-alex tracking-wide';
      case 'caveat':
        return 'font-caveat tracking-wide';
      case 'sans':
      default:
        return 'font-sans-ui';
    }
  };

  // Font size class
  const getFontSizeClass = () => {
    switch (letter.fontSize) {
      case 'sm':
        return 'text-base md:text-lg leading-relaxed';
      case 'lg':
        return 'text-xl md:text-2xl leading-relaxed';
      case 'xl':
        return 'text-2xl md:text-3xl leading-loose';
      case 'md':
      default:
        return 'text-lg md:text-xl leading-relaxed';
    }
  };

  const wordCount = letter.body ? letter.body.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 160));

  const handleCopyText = async () => {
    const fullText = `${letter.dateline ? letter.dateline + '\n\n' : ''}${letter.salutation}\n\n${letter.body}\n\n${letter.signoff}\n${letter.sender}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Could not copy to clipboard', e);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top canvas actions bar */}
      <div className="no-print w-full max-w-3xl flex items-center justify-between py-2 px-3 mb-3 bg-[#1d1612] rounded-xl border border-[#33261e] text-xs text-[#a49182]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#d4a373]">
            <PenTool className="w-3.5 h-3.5" />
            <span>{wordCount} words</span>
          </span>
          <span className="text-[#594435]">•</span>
          <span>~{readTime} min read</span>
          {letter.isSealed && (
            <>
              <span className="text-[#594435]">•</span>
              <span className="flex items-center gap-1 text-[#e07a5f]">
                <Lock className="w-3 h-3" />
                <span>Wax Sealed</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Envelope View */}
          <button
            id="toggle-envelope-btn"
            onClick={() => setShowEnvelopeView(!showEnvelopeView)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              showEnvelopeView
                ? 'bg-[#402619] text-[#fbe1ce] border border-[#7a4932]'
                : 'hover:bg-[#2b1f18] text-[#9b887a] hover:text-[#edd9c9]'
            }`}
            title="View Folded & Sealed Envelope"
          >
            {showEnvelopeView ? <FileText className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
            <span>{showEnvelopeView ? 'Unfolded Letter' : 'Envelope View'}</span>
          </button>

          {/* Edit / Read Mode */}
          <button
            id="toggle-edit-mode-btn"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2.5 py-1 rounded-md border transition-all ${
              isEditing
                ? 'bg-[#3b271d] border-[#6b4733] text-[#fbeee0]'
                : 'border-[#382a20] hover:bg-[#2b1f18] text-[#9b887a]'
            }`}
          >
            {isEditing ? 'Editing' : 'Reading'}
          </button>

          {/* Copy Full Letter */}
          <button
            id="copy-letter-btn"
            onClick={handleCopyText}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-[#2b1f18] text-[#9b887a] hover:text-[#edd9c9] transition-all"
            title="Copy letter text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* ENVELOPE VIEW */}
      {showEnvelopeView ? (
        <div className="w-full max-w-2xl my-6 flex flex-col items-center animate-fade-in">
          <div 
            className="w-full aspect-[1.5/1] rounded-2xl p-6 md:p-10 shadow-2xl relative flex flex-col justify-between overflow-hidden border"
            style={{
              backgroundColor: theme.envelopeColor,
              borderColor: theme.borderColor,
            }}
          >
            {/* Envelope flap lines decoration */}
            <div 
              className="absolute inset-x-0 top-0 h-1/2 opacity-30 border-b border-dashed pointer-events-none"
              style={{ borderColor: theme.textColor }}
            />

            {/* Top row: Vintage Postage Stamp */}
            <div className="flex justify-between items-start">
              {/* Return Address */}
              <div className="text-xs opacity-75 font-serif max-w-[200px]" style={{ color: theme.textColor }}>
                <p className="font-semibold">{letter.sender || 'Sender'}</p>
                <p className="italic text-[11px]">{letter.dateline || 'From a devoted heart'}</p>
              </div>

              {/* Vintage Postage Stamp representation */}
              <div 
                className="w-16 h-20 md:w-20 md:h-24 rounded border-2 border-dashed p-1.5 flex flex-col items-center justify-between shadow-sm bg-[#faf4ec]"
                style={{ borderColor: '#8b6f5a' }}
              >
                <div className="text-[8px] uppercase tracking-widest font-bold text-[#8b6f5a]">
                  POSTE D'AMOUR
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f0e6da] border border-[#cfbaaa] flex items-center justify-center">
                  <Flower2 className="w-5 h-5 text-[#9b3a2a]" />
                </div>
                <div className="text-[9px] font-mono text-[#8b6f5a]">
                  2026 • 50¢
                </div>
              </div>
            </div>

            {/* Recipient Address Calligraphy in Center */}
            <div className="my-auto self-center text-center max-w-md px-4">
              <p 
                className="font-alex text-3xl md:text-4xl mb-1 tracking-wide"
                style={{ color: theme.textColor }}
              >
                {letter.recipient || 'My Beloved'}
              </p>
              {letter.envelopeAddress ? (
                <p 
                  className="font-serif italic text-xs md:text-sm whitespace-pre-line opacity-80"
                  style={{ color: theme.textColor }}
                >
                  {letter.envelopeAddress}
                </p>
              ) : (
                <p 
                  className="font-serif italic text-xs md:text-sm opacity-70"
                  style={{ color: theme.textColor }}
                >
                  To the one who holds my heart
                </p>
              )}
            </div>

            {/* Bottom: Wax Seal on Envelope */}
            <div className="flex items-center justify-between pt-4 border-t border-dashed opacity-90" style={{ borderColor: theme.borderColor }}>
              <span className="text-[11px] italic font-serif" style={{ color: theme.textColor }}>
                Strictly Private & Confidential
              </span>

              {letter.isSealed ? (
                <button
                  onClick={() => setShowEnvelopeView(false)}
                  className="flex items-center gap-2 group cursor-pointer"
                  title="Click to Break Wax Seal & Read Letter"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center wax-seal-shadow transition-transform group-hover:scale-105 active:scale-95"
                    style={{
                      background: sealColor.bgGradient,
                      border: `2px solid ${sealColor.borderHex}`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-full border border-amber-300/40 flex items-center justify-center">
                      {renderSealIcon(letter.sealStamp)}
                    </div>
                  </div>
                  <span className="text-xs font-serif italic text-[#d4a373] group-hover:underline">
                    Break Seal & Read
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenSealModal}
                  className="px-3 py-1.5 rounded-lg bg-[#8a3324] hover:bg-[#a33e2c] text-amber-100 text-xs font-serif flex items-center gap-1.5 shadow"
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Seal with Hot Wax</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* UNFOLDED PHYSICAL LETTER CANVAS */
        <div 
          id="beloved-letter-print"
          className="letter-print-canvas w-full max-w-3xl rounded-2xl shadow-2xl p-8 md:p-14 md:py-16 transition-all duration-300 relative border deckled-border"
          style={{
            backgroundColor: theme.paperBg,
            color: theme.textColor,
            borderColor: theme.borderColor,
          }}
        >
          {/* Subtle vintage watermark emblem */}
          <div className="absolute top-8 right-8 opacity-10 pointer-events-none select-none">
            <Feather className="w-24 h-24" style={{ color: theme.textColor }} />
          </div>

          {/* Letter Header: Dateline & Title */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b pb-4" style={{ borderColor: theme.borderColor }}>
            {isEditing ? (
              <input
                type="text"
                value={letter.title}
                onChange={(e) => onUpdateLetter({ title: e.target.value })}
                placeholder="Title (e.g. Under the Parisian Lanterns)"
                className="font-serif text-lg md:text-xl font-semibold bg-transparent border-b border-dashed border-[#8c7463]/40 focus:outline-none focus:border-[#d4a373] w-full md:w-auto"
                style={{ color: theme.textColor }}
              />
            ) : (
              <h2 className="font-serif text-lg md:text-2xl font-semibold tracking-tight" style={{ color: theme.textColor }}>
                {letter.title || 'Untitled Love Letter'}
              </h2>
            )}

            {isEditing ? (
              <input
                type="text"
                value={letter.dateline}
                onChange={(e) => onUpdateLetter({ dateline: e.target.value })}
                placeholder="Dateline (e.g. Autumn twilight, 2026)"
                className="font-serif text-xs md:text-sm italic bg-transparent border-b border-dashed border-[#8c7463]/40 focus:outline-none focus:border-[#d4a373] text-right"
                style={{ color: theme.accentColor }}
              />
            ) : (
              <div className="text-xs md:text-sm font-serif italic text-right" style={{ color: theme.accentColor }}>
                {letter.dateline || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            )}
          </div>

          {/* Salutation */}
          <div className="mb-6">
            {isEditing ? (
              <input
                type="text"
                value={letter.salutation}
                onChange={(e) => onUpdateLetter({ salutation: e.target.value })}
                placeholder="Salutation (e.g. My dearest Genevieve,)"
                className={`w-full bg-transparent font-serif text-xl md:text-2xl font-semibold border-b border-dashed border-[#8c7463]/40 focus:outline-none focus:border-[#d4a373] ${getFontClass()}`}
                style={{ color: theme.textColor }}
              />
            ) : (
              <div 
                className={`font-serif text-xl md:text-2xl font-semibold tracking-wide ${getFontClass()}`}
                style={{ color: theme.textColor }}
              >
                {letter.salutation || 'My beloved,'}
              </div>
            )}
          </div>

          {/* Letter Body Text */}
          <div className="mb-10 min-h-[220px]">
            {isEditing ? (
              <textarea
                value={letter.body}
                onChange={(e) => onUpdateLetter({ body: e.target.value })}
                placeholder="Pour your heart onto the parchment..."
                rows={12}
                className={`w-full bg-transparent focus:outline-none resize-y border border-dashed border-[#8c7463]/30 p-4 rounded-xl leading-relaxed whitespace-pre-wrap ${getFontClass()} ${getFontSizeClass()}`}
                style={{ color: theme.textColor }}
              />
            ) : (
              <div 
                className={`whitespace-pre-wrap font-serif ${getFontClass()} ${getFontSizeClass()}`}
                style={{ color: theme.textColor }}
              >
                {letter.body ? (
                  letter.body.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-5 last:mb-0 indent-0 md:indent-6">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="italic opacity-50">
                    This parchment awaits your heart’s words. Tap "Edit" or summon the AI Muse above to begin.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Signoff & Sender */}
          <div className="flex flex-col items-end gap-1 mt-8 pt-4 border-t border-dashed" style={{ borderColor: theme.borderColor }}>
            {isEditing ? (
              <div className="flex flex-col items-end gap-2 w-full max-w-xs">
                <input
                  type="text"
                  value={letter.signoff}
                  onChange={(e) => onUpdateLetter({ signoff: e.target.value })}
                  placeholder="Sign-off (e.g. Forever yours,)"
                  className="font-serif italic text-right bg-transparent border-b border-dashed border-[#8c7463]/40 focus:outline-none focus:border-[#d4a373] w-full text-sm"
                  style={{ color: theme.accentColor }}
                />
                <input
                  type="text"
                  value={letter.sender}
                  onChange={(e) => onUpdateLetter({ sender: e.target.value })}
                  placeholder="Your Name (e.g. Julian)"
                  className="font-alex text-2xl md:text-3xl text-right bg-transparent border-b border-dashed border-[#8c7463]/40 focus:outline-none focus:border-[#d4a373] w-full"
                  style={{ color: theme.textColor }}
                />
              </div>
            ) : (
              <div className="text-right">
                <p className="font-serif italic text-sm md:text-base mb-1" style={{ color: theme.accentColor }}>
                  {letter.signoff || 'Forever and always yours,'}
                </p>
                <p className="font-alex text-3xl md:text-4xl tracking-wide" style={{ color: theme.textColor }}>
                  {letter.sender || 'Yours'}
                </p>
              </div>
            )}
          </div>

          {/* Wax Seal Emblem at bottom center or corner */}
          <div className="mt-8 flex items-center justify-between pt-4">
            <div className="text-[11px] font-serif italic opacity-60" style={{ color: theme.textColor }}>
              Beloved Letter Studio • Keepsake Edition
            </div>

            {/* Interactive Seal */}
            {letter.isSealed ? (
              <div className="flex items-center gap-3">
                <div 
                  className="group relative cursor-pointer"
                  onClick={onOpenSealModal}
                  title="Click to change or examine wax seal"
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center wax-seal-shadow transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: sealColor.bgGradient,
                      border: `2px solid ${sealColor.borderHex}`,
                    }}
                  >
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-amber-300/40 flex items-center justify-center">
                      {renderSealIcon(letter.sealStamp)}
                    </div>
                  </div>
                </div>

                <div className="no-print flex flex-col items-start text-xs">
                  <span className="font-semibold font-serif text-[13px]" style={{ color: theme.textColor }}>
                    {sealColor.name} Seal
                  </span>
                  <button
                    onClick={() => onUpdateLetter({ isSealed: false })}
                    className="text-[10px] text-[#b23b28] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Break Seal</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="canvas-seal-action-btn"
                onClick={onOpenSealModal}
                className="no-print flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#361a14] hover:bg-[#4d251d] text-[#f8d7ce] text-xs font-serif border border-[#803828] shadow-md transition-all active:scale-95"
              >
                <Stamp className="w-3.5 h-3.5 text-amber-300" />
                <span>Affix Wax Seal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
