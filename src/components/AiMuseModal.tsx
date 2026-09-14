import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Heart, 
  Feather, 
  HelpCircle, 
  RefreshCw, 
  Send, 
  BookOpen, 
  Calendar,
  Flame,
  MessageSquareHeart,
  Smile,
  Compass,
  AlertCircle
} from 'lucide-react';
import { LetterFormat, LetterTone, AiLetterParams, LoveLetter } from '../types';

interface AiMuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLetter: (generatedLetter: Partial<LoveLetter>) => void;
  currentLetter: LoveLetter;
}

export const AiMuseModal: React.FC<AiMuseModalProps> = ({
  isOpen,
  onClose,
  onApplyLetter,
  currentLetter,
}) => {
  const [params, setParams] = useState<AiLetterParams>({
    recipient: currentLetter.recipient || '',
    sender: currentLetter.sender || '',
    occasion: currentLetter.occasion || 'Anniversary',
    tone: 'passionate',
    format: currentLetter.format || 'letter',
    length: 'medium',
    keyMemories: '',
    specialQuirks: '',
    futurePromise: '',
    poeticElements: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [promptSparks, setPromptSparks] = useState<string[]>([
    "Describe the exact moment you realized you were falling in love.",
    "What is an unspoken habit of theirs that always makes you smile?",
    "If you could freeze one afternoon with them forever, which one would it be?",
    "What is a silent promise you make to them every single day?"
  ]);
  const [isFetchingSparks, setIsFetchingSparks] = useState(false);

  if (!isOpen) return null;

  const loadingMessages = [
    "Consulting the literary muses...",
    "Weaving your memories into parchment and ink...",
    "Tuning the lyrical cadence and quiet emotion...",
    "Sealing the heartfelt verses..."
  ];

  const handleFetchSparks = async () => {
    setIsFetchingSparks(true);
    try {
      const res = await fetch('/api/suggest-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: params.occasion,
          relationship: params.recipient || 'beloved',
        }),
      });
      const data = await res.json();
      if (data.prompts && data.prompts.length > 0) {
        setPromptSparks(data.prompts);
      }
    } catch (e) {
      console.warn('Failed to fetch sparks', e);
    } finally {
      setIsFetchingSparks(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(0);

    const stepTimer = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    try {
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        throw new Error(data.error || 'Failed to compose letter');
      }

      if (data.letter) {
        const letter = data.letter;
        onApplyLetter({
          title: letter.title || `${params.occasion} for ${params.recipient || 'Beloved'}`,
          dateline: letter.dateline || 'At twilight, by candlelight',
          salutation: letter.salutation || `My dearest ${params.recipient || 'Beloved'},`,
          body: letter.body || '',
          signoff: letter.signoff || 'Forever and completely yours,',
          sender: letter.sender || params.sender || 'Yours',
          recipient: params.recipient || 'Beloved',
          format: params.format,
          occasion: params.occasion,
          updatedAt: new Date().toISOString(),
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMsg(err.message || 'The Muse encountered a whisper in the dark. Please try again.');
    } finally {
      clearInterval(stepTimer);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#1a1411] border border-[#3d291e] rounded-3xl p-6 md:p-8 shadow-2xl text-[#f5e9dc] relative my-8"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#9c897a] hover:text-[#f8eee4] rounded-full hover:bg-[#2e1f17] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8a2f1e] to-[#47120a] flex items-center justify-center border border-[#ad422e]/40 shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#fdf5ee]">
              The Romantic Muse
            </h3>
            <p className="text-xs text-[#a89587] font-serif italic">
              Whisper your memories and let Gemini 3.8 Flash spin them into timeless poetry and letters
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-[#d4a373]/20 border-t-[#d4a373] animate-spin flex items-center justify-center">
              </div>
              <Feather className="w-6 h-6 text-amber-200 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="font-serif text-lg text-[#fbe1ce] italic">
              {loadingMessages[loadingStep]}
            </p>
            <p className="text-xs text-[#9c897a] max-w-sm">
              Weaving raw sentiment into literary imagery, rhythm, and enduring devotion.
            </p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Format & Tone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Format Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4a373] font-semibold mb-1.5">
                  Composition Format
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'letter', label: 'Classic Letter' },
                    { id: 'poem', label: 'Poem / Sonnet' },
                    { id: 'vows', label: 'Sacred Vows' },
                    { id: 'postcard', label: 'Postcard Note' },
                  ].map((fmt) => (
                    <button
                      type="button"
                      key={fmt.id}
                      onClick={() => setParams({ ...params, format: fmt.id as LetterFormat })}
                      className={`px-3 py-2 rounded-xl text-xs font-serif border text-left transition-all ${
                        params.format === fmt.id
                          ? 'bg-[#3b251a] border-[#d4a373] text-[#fbe1ce] font-semibold'
                          : 'bg-[#221813] border-[#38261c] text-[#a49182] hover:text-[#eedecf]'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emotional Tone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#d4a373] font-semibold mb-1.5">
                  Emotional Tone
                </label>
                <select
                  value={params.tone}
                  onChange={(e) => setParams({ ...params, tone: e.target.value as LetterTone })}
                  className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
                >
                  <option value="passionate">Passionate & Classic (Keats, Lord Byron)</option>
                  <option value="tender">Tender & Quiet (Sanctuary in small moments)</option>
                  <option value="poetic">Poetic & Lyrical (Cosmic metaphors, nature)</option>
                  <option value="playful">Playful & Charming (Shared humor, sweet banter)</option>
                  <option value="vows">Sacred Devotion (Solemn promises for eternity)</option>
                  <option value="distance">Long Distance (Yearning, across the miles)</option>
                  <option value="apology">Gentle Reconciliation (Humility, healing love)</option>
                </select>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#9c897a]">Length:</span>
                  <div className="flex gap-1">
                    {(['short', 'medium', 'long'] as const).map((len) => (
                      <button
                        type="button"
                        key={len}
                        onClick={() => setParams({ ...params, length: len })}
                        className={`px-2 py-0.5 rounded text-[10px] capitalize border ${
                          params.length === len
                            ? 'bg-[#3b251a] border-[#d4a373] text-[#fbe1ce]'
                            : 'bg-[#221813] border-[#38261c] text-[#8c796b]'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient, Sender, Occasion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-[#c9b7a7] mb-1 font-serif">
                  To (Recipient Name / Pet Name)
                </label>
                <input
                  type="text"
                  value={params.recipient}
                  onChange={(e) => setParams({ ...params, recipient: e.target.value })}
                  placeholder="e.g. Genevieve, My Dearest"
                  className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#c9b7a7] mb-1 font-serif">
                  From (Your Name / Moniker)
                </label>
                <input
                  type="text"
                  value={params.sender}
                  onChange={(e) => setParams({ ...params, sender: e.target.value })}
                  placeholder="e.g. Julian, Yours Always"
                  className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c9b7a7] mb-1 font-serif">
                  Occasion / Season
                </label>
                <input
                  type="text"
                  value={params.occasion}
                  onChange={(e) => setParams({ ...params, occasion: e.target.value })}
                  placeholder="e.g. 5th Anniversary, Just Because"
                  className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            {/* Heartfelt Memories & Personal Sparks */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider text-[#d4a373] font-semibold">
                  Personal Memories & Shared Moments
                </label>
                <button
                  type="button"
                  onClick={handleFetchSparks}
                  disabled={isFetchingSparks}
                  className="text-[11px] text-[#b89578] hover:text-[#f8ede3] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isFetchingSparks ? 'animate-spin' : ''}`} />
                  <span>Refresh Sparks</span>
                </button>
              </div>

              {/* Spark suggestions pill bank */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {promptSparks.map((spark, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      const current = params.keyMemories;
                      setParams({
                        ...params,
                        keyMemories: current ? `${current}\n${spark}` : spark,
                      });
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#271c16] hover:bg-[#38261e] border border-[#422e23] text-[#c7b5a5] text-left transition-colors"
                  >
                    + {spark}
                  </button>
                ))}
              </div>

              <textarea
                value={params.keyMemories}
                onChange={(e) => setParams({ ...params, keyMemories: e.target.value })}
                placeholder="Share key memories (e.g. The rainstorm on Pont Neuf, that cozy booth in the diner, the way you sleep with one foot outside the blanket)..."
                rows={3}
                className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl p-3 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373] resize-none leading-relaxed"
              />
            </div>

            {/* Quirk & Future Promise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#c9b7a7] mb-1 font-serif">
                  A Quirky or Adorable Detail You Love
                </label>
                <input
                  type="text"
                  value={params.specialQuirks}
                  onChange={(e) => setParams({ ...params, specialQuirks: e.target.value })}
                  placeholder="e.g. The little laugh when embarrassed, cold nose"
                  className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c9b7a7] mb-1 font-serif">
                  A Promise You Want to Make
                </label>
                <input
                  type="text"
                  value={params.futurePromise}
                  onChange={(e) => setParams({ ...params, futurePromise: e.target.value })}
                  placeholder="e.g. To hold your hand through every unknown year"
                  className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl px-3 py-2 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3 border-t border-[#33241b]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#a49182] hover:text-[#eedecf] transition-colors"
              >
                Cancel
              </button>

              <button
                id="muse-compose-submit-btn"
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8a2f1e] to-[#b23d27] hover:from-[#9c3622] hover:to-[#c6452d] text-[#fff2ee] text-xs md:text-sm font-medium shadow-xl border border-[#d6573e]/40 transition-all active:scale-95"
              >
                <Feather className="w-4 h-4 text-amber-200" />
                <span>Pen Love Letter</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
