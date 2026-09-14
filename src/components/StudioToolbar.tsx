import React from 'react';
import { 
  Palette, 
  Type, 
  Sparkles, 
  Stamp, 
  Wand2, 
  HeartHandshake, 
  Flame, 
  Music, 
  Feather, 
  Shrink,
  Sliders,
  Mail
} from 'lucide-react';
import { LoveLetter, FontStyleId } from '../types';
import { STATIONERY_THEMES } from '../data/themes';

interface StudioToolbarProps {
  letter: LoveLetter;
  onUpdateLetter: (updated: Partial<LoveLetter>) => void;
  onOpenAiMuse: () => void;
  onOpenPolishModal: (action?: string) => void;
  onOpenSealModal: () => void;
}

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  letter,
  onUpdateLetter,
  onOpenAiMuse,
  onOpenPolishModal,
  onOpenSealModal,
}) => {
  return (
    <div className="no-print w-full max-w-3xl mb-6 flex flex-col gap-3">
      {/* Quick Muse & Polish Actions Row */}
      <div className="bg-[#1a1410] border border-[#33241b] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            id="toolbar-ai-muse-btn"
            onClick={onOpenAiMuse}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8a2e1d] to-[#ad3b26] hover:from-[#9c3422] hover:to-[#be422c] text-[#fef1ee] text-xs md:text-sm font-medium shadow transition-all border border-[#ca4f38]/40 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Generate with AI Muse</span>
          </button>

          <button
            id="toolbar-wax-seal-btn"
            onClick={onOpenSealModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2b1e16] hover:bg-[#38281e] text-[#e8d5c4] text-xs md:text-sm font-medium border border-[#4a3426] transition-all active:scale-95"
          >
            <Stamp className="w-4 h-4 text-[#d4a373]" />
            <span>{letter.isSealed ? 'Modify Wax Seal' : 'Affix Wax Seal'}</span>
          </button>
        </div>

        {/* Quick Polishes Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-serif italic text-[#8c796b] mr-1 hidden sm:inline">
            Polish Prose:
          </span>
          <button
            onClick={() => onOpenPolishModal('deepen_emotion')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241a14] hover:bg-[#32231b] text-[#c9b7a7] hover:text-[#f8ede3] text-xs border border-[#3a2a20] transition-colors"
            title="Deepen Emotional Gravity"
          >
            <HeartHandshake className="w-3 h-3 text-[#e07a5f]" />
            <span>Deepen Heart</span>
          </button>

          <button
            onClick={() => onOpenPolishModal('poetic_metaphor')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241a14] hover:bg-[#32231b] text-[#c9b7a7] hover:text-[#f8ede3] text-xs border border-[#3a2a20] transition-colors"
            title="Infuse Starlight & Poetic Metaphors"
          >
            <Feather className="w-3 h-3 text-[#d4a373]" />
            <span>Metaphors</span>
          </button>

          <button
            onClick={() => onOpenPolishModal('rhythmic_verse')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241a14] hover:bg-[#32231b] text-[#c9b7a7] hover:text-[#f8ede3] text-xs border border-[#3a2a20] transition-colors"
            title="Harmonize Lyrical Cadence"
          >
            <Music className="w-3 h-3 text-[#81b29a]" />
            <span>Lyrical Cadence</span>
          </button>

          <button
            onClick={() => onOpenPolishModal('intimate_brevity')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#241a14] hover:bg-[#32231b] text-[#c9b7a7] hover:text-[#f8ede3] text-xs border border-[#3a2a20] transition-colors"
            title="Condense into a Short Love Note"
          >
            <Shrink className="w-3 h-3 text-[#a892ee]" />
            <span>Postcard Note</span>
          </button>
        </div>
      </div>

      {/* Styling Atelier: Stationery & Typography Selector */}
      <div className="bg-[#16110e] border border-[#2d2018] rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Themes Palette */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[#8c796b] font-medium flex items-center gap-1 mr-1">
            <Palette className="w-3.5 h-3.5 text-[#d4a373]" />
            <span>Parchment:</span>
          </span>
          {STATIONERY_THEMES.map((th) => (
            <button
              key={th.id}
              onClick={() => onUpdateLetter({ themeId: th.id })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] whitespace-nowrap transition-all ${
                letter.themeId === th.id
                  ? 'border-[#d4a373] bg-[#332218] text-[#fbe1ce] shadow-sm font-medium'
                  : 'border-[#302219] bg-[#1f1611] text-[#9b887a] hover:text-[#f3e7dc]'
              }`}
              title={th.tagline}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full border border-black/30" 
                style={{ backgroundColor: th.paperBg }}
              />
              <span>{th.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Fonts & Size */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Font Family */}
          <div className="flex items-center gap-1 bg-[#1f1611] p-1 rounded-lg border border-[#33241b]">
            <Type className="w-3.5 h-3.5 text-[#8c796b] ml-1" />
            <button
              onClick={() => onUpdateLetter({ fontStyle: 'cormorant' })}
              className={`px-2 py-0.5 rounded text-[11px] font-cormorant ${
                letter.fontStyle === 'cormorant' ? 'bg-[#3b271d] text-[#fbeee0] font-semibold' : 'text-[#8c796b]'
              }`}
            >
              Classic Serif
            </button>
            <button
              onClick={() => onUpdateLetter({ fontStyle: 'newsreader' })}
              className={`px-2 py-0.5 rounded text-[11px] font-newsreader ${
                letter.fontStyle === 'newsreader' ? 'bg-[#3b271d] text-[#fbeee0] font-semibold' : 'text-[#8c796b]'
              }`}
            >
              Literary
            </button>
            <button
              onClick={() => onUpdateLetter({ fontStyle: 'alex' })}
              className={`px-2 py-0.5 rounded text-[11px] font-alex ${
                letter.fontStyle === 'alex' ? 'bg-[#3b271d] text-[#fbeee0] font-semibold' : 'text-[#8c796b]'
              }`}
            >
              Script
            </button>
            <button
              onClick={() => onUpdateLetter({ fontStyle: 'caveat' })}
              className={`px-2 py-0.5 rounded text-[11px] font-caveat ${
                letter.fontStyle === 'caveat' ? 'bg-[#3b271d] text-[#fbeee0] font-semibold' : 'text-[#8c796b]'
              }`}
            >
              Handwritten
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center gap-1 bg-[#1f1611] p-1 rounded-lg border border-[#33241b]">
            {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => onUpdateLetter({ fontSize: sz })}
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${
                  letter.fontSize === sz ? 'bg-[#3b271d] text-[#fbeee0] font-bold' : 'text-[#7d6c5f]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
