import React, { useState } from 'react';
import { 
  X, 
  Wand2, 
  HeartHandshake, 
  Feather, 
  Music, 
  Shrink, 
  BookOpen, 
  Smile, 
  Check, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TextPolisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBody: string;
  onApplyPolishedText: (newText: string) => void;
  initialAction?: string;
}

export const TextPolisherModal: React.FC<TextPolisherModalProps> = ({
  isOpen,
  onClose,
  currentBody,
  onApplyPolishedText,
  initialAction = 'deepen_emotion',
}) => {
  const [selectedAction, setSelectedAction] = useState<string>(initialAction);
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [polishedResult, setPolishedResult] = useState<string | null>(null);
  const [changesNote, setChangesNote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const polishActions = [
    {
      id: 'deepen_emotion',
      label: 'Deepen Emotion & Vulnerability',
      description: 'Infuse authentic emotional gravity, tenderness, and heartfelt resonance.',
      icon: HeartHandshake,
      color: 'text-[#e07a5f]',
    },
    {
      id: 'poetic_metaphor',
      label: 'Weave Poetic Metaphors',
      description: 'Enrich with evocative imagery from starlight, changing seasons, and nature.',
      icon: Feather,
      color: 'text-[#d4a373]',
    },
    {
      id: 'rhythmic_verse',
      label: 'Harmonize Lyrical Cadence',
      description: 'Tune the sentence flow and rhythm so words sound like spoken music.',
      icon: Music,
      color: 'text-[#81b29a]',
    },
    {
      id: 'intimate_brevity',
      label: 'Distill to Postcard Note',
      description: 'Condense into a short, intensely heartfelt love note without losing punch.',
      icon: Shrink,
      color: 'text-[#a892ee]',
    },
    {
      id: 'classic_vintage',
      label: '19th-Century Classical Romance',
      description: 'Graceful epistolary style in the spirit of Austen, Keats, and Byron.',
      icon: BookOpen,
      color: 'text-[#e9c46a]',
    },
    {
      id: 'playful_charm',
      label: 'Playful & Charming Banter',
      description: 'Add affectionate wit and lighthearted charm while keeping sincerity.',
      icon: Smile,
      color: 'text-[#f4a261]',
    },
  ];

  const handlePolish = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/polish-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentText: currentBody,
          polishAction: selectedAction,
          customInstruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to refine letter');
      }

      setPolishedResult(data.polishedText);
      setChangesNote(data.changesNote || 'Refined with gentle romantic care.');
    } catch (err: any) {
      setErrorMsg(err.message || 'The muse could not complete this polish.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (polishedResult) {
      onApplyPolishedText(polishedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#1a1411] border border-[#3d291e] rounded-3xl p-6 md:p-8 shadow-2xl text-[#f5e9dc] relative my-8"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#9c897a] hover:text-[#f8eee4] rounded-full hover:bg-[#2e1f17] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#361c14] border border-[#6d3424] flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-semibold text-[#fdf5ee]">
              Literary Polisher & Style Refiner
            </h3>
            <p className="text-xs text-[#a89587] font-serif italic">
              Elevate your prose, cadence, or imagery while preserving your authentic voice
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Polishing Options */}
        <div className="space-y-4 mb-6">
          <label className="block text-xs uppercase tracking-wider text-[#d4a373] font-semibold">
            Choose a Poetic Direction
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {polishActions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => {
                    setSelectedAction(act.id);
                    setPolishedResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    selectedAction === act.id
                      ? 'bg-[#3b251a] border-[#d4a373] shadow-sm'
                      : 'bg-[#221813] border-[#38261c] hover:border-[#52392b]'
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${act.color}`} />
                  <div>
                    <div className="text-xs font-serif font-semibold text-[#fbf0e6]">
                      {act.label}
                    </div>
                    <div className="text-[11px] text-[#9b887a] leading-tight mt-0.5">
                      {act.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optional specific note */}
          <div>
            <label className="block text-xs text-[#c9b7a7] mb-1 font-serif">
              Optional Note or Wish to the Muse:
            </label>
            <input
              type="text"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g. Keep the reference to the lavender tea, make the ending more lingering..."
              className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
            />
          </div>
        </div>

        {/* Trigger Polish Button */}
        {!polishedResult && (
          <div className="flex justify-end gap-3 pt-2 border-t border-[#33241b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-[#a49182] hover:text-[#eedecf]"
            >
              Cancel
            </button>
            <button
              onClick={handlePolish}
              disabled={isLoading || !currentBody.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a2f1e] to-[#ad3b26] hover:from-[#9c3422] hover:to-[#be422c] text-[#fef1ee] text-xs font-medium border border-[#ca4f38]/40 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Polishing Prose...' : 'Refine Text'}</span>
            </button>
          </div>
        )}

        {/* Comparison / Result View */}
        {polishedResult && (
          <div className="mt-4 pt-4 border-t border-[#33241b] space-y-4 animate-fade-in">
            {changesNote && (
              <div className="p-2.5 bg-[#291e17] rounded-xl border border-[#4a3426] text-xs text-[#e5d2c2] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="italic font-serif">{changesNote}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-[#81b29a] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Refined Version
              </span>
              <div className="p-4 rounded-xl bg-[#221813] border border-[#3d2a1f] text-xs md:text-sm font-serif leading-relaxed text-[#f7f0e8] whitespace-pre-wrap max-h-60 overflow-y-auto">
                {polishedResult}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePolish}
                disabled={isLoading}
                className="text-xs text-[#d4a373] hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Try Another Polish</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#a49182] hover:text-[#eedecf]"
                >
                  Discard
                </button>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2e6b48] hover:bg-[#367d55] text-white text-xs font-semibold shadow-lg border border-[#48996b]/50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Parchment</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
