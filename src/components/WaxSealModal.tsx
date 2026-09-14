import React, { useState } from 'react';
import { 
  X, 
  Stamp, 
  Heart, 
  Flower2, 
  Feather, 
  Sparkles, 
  CircleDot, 
  Compass, 
  Flame, 
  Check, 
  Mail,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WAX_SEAL_COLORS, WAX_SEAL_STAMPS } from '../data/themes';
import { ambianceAudio } from '../utils/audioAmbiance';

interface WaxSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  selectedStamp: string;
  envelopeAddress?: string;
  onApplySeal: (sealColor: string, sealStamp: string, envelopeAddress?: string) => void;
}

export const WaxSealModal: React.FC<WaxSealModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  selectedStamp,
  envelopeAddress = '',
  onApplySeal,
}) => {
  const [currentColor, setCurrentColor] = useState<string>(selectedColor || 'crimson');
  const [currentStamp, setCurrentStamp] = useState<string>(selectedStamp || 'rose');
  const [address, setAddress] = useState<string>(envelopeAddress);
  const [isSealing, setIsSealing] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeColorObj = WAX_SEAL_COLORS.find((c) => c.id === currentColor) || WAX_SEAL_COLORS[0];
  const activeStampObj = WAX_SEAL_STAMPS.find((s) => s.id === currentStamp) || WAX_SEAL_STAMPS[0];

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'rose':
        return <Flower2 className={`${className} text-amber-200 drop-shadow`} />;
      case 'feather':
        return <Feather className={`${className} text-amber-200 drop-shadow`} />;
      case 'sparkle':
        return <Sparkles className={`${className} text-amber-200 drop-shadow`} />;
      case 'rings':
        return <CircleDot className={`${className} text-amber-200 drop-shadow`} />;
      case 'compass':
        return <Compass className={`${className} text-amber-200 drop-shadow`} />;
      case 'heart':
      default:
        return <Heart className={`${className} text-amber-200 drop-shadow fill-amber-200/30`} />;
    }
  };

  const handlePerformSealing = () => {
    setIsSealing(true);

    // Play tactile sound
    ambianceAudio.playWaxSealStampSound();

    // Trigger romantic confetti (crimson, rose, gold)
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9b111e', '#d4a373', '#e07a5f', '#ffccd5', '#ffd166'],
      });
    } catch (e) {
      // Ignored if canvas not ready
    }

    setTimeout(() => {
      setIsSealing(false);
      onApplySeal(currentColor, currentStamp, address);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-[#191310] border border-[#3d291e] rounded-3xl p-6 md:p-8 shadow-2xl text-[#f5e9dc] relative my-8"
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
          <div className="w-12 h-12 rounded-2xl bg-[#361a14] border border-[#783626] flex items-center justify-center">
            <Stamp className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#fdf5ee]">
              Wax Sealing Atelier
            </h3>
            <p className="text-xs text-[#a89587] font-serif italic">
              Affix an authentic, personalized wax seal upon your parchment
            </p>
          </div>
        </div>

        {/* Live Seal Preview Canvas */}
        <div className="flex flex-col items-center justify-center py-6 bg-[#120d0b] rounded-2xl border border-[#2e1e16] mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4a373_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Wax Seal Object with 3D shadow */}
          <div className="relative flex items-center justify-center">
            {/* Melting wax glow effect */}
            <div 
              className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center wax-seal-shadow transition-all duration-500 ${
                isSealing ? 'scale-90 opacity-90' : 'scale-100'
              }`}
              style={{
                background: activeColorObj.bgGradient,
                border: `3px solid ${activeColorObj.borderHex}`,
              }}
            >
              {/* Outer decorative ring */}
              <div className="w-20 h-20 md:w-22 md:h-22 rounded-full border-2 border-amber-300/30 flex flex-col items-center justify-center">
                {renderIcon(activeStampObj.id, "w-8 h-8 md:w-9 md:h-9")}
                <span className="text-[9px] uppercase tracking-widest font-serif text-amber-200/70 mt-1">
                  BELOVED
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-serif font-semibold text-[#fbe1ce]">
              {activeColorObj.name} with {activeStampObj.name}
            </p>
            <p className="text-[11px] text-[#9b887a] italic font-serif">
              "{activeStampObj.meaning}"
            </p>
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-[#d4a373] font-semibold mb-2">
            1. Select Wax Color
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {WAX_SEAL_COLORS.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCurrentColor(c.id)}
                className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                  currentColor === c.id
                    ? 'border-[#d4a373] bg-[#332219] shadow-md scale-105'
                    : 'border-[#302219] bg-[#221813] hover:border-[#4d3729]'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full border border-black/40 shadow-inner"
                  style={{ background: c.bgGradient }}
                />
                <span className="text-[10px] text-[#c9b7a7] text-center leading-tight">
                  {c.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Insignia / Stamp Symbol Selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-[#d4a373] font-semibold mb-2">
            2. Choose Seal Insignia
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WAX_SEAL_STAMPS.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setCurrentStamp(s.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  currentStamp === s.id
                    ? 'bg-[#3b251a] border-[#d4a373] shadow-md'
                    : 'bg-[#221813] border-[#33231a] hover:border-[#4d362a]'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#2e1d16] flex items-center justify-center border border-[#4a3224]">
                  {renderIcon(s.id, "w-4 h-4")}
                </div>
                <div>
                  <div className="text-xs font-serif font-semibold text-[#f8ede3]">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-[#9b887a] truncate max-w-[120px]">
                    {s.meaning}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Envelope Address Information */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-[#d4a373] font-semibold mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>3. Vintage Envelope Address (Optional)</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Mme. Genevieve Vance&#10;No. 14 Rue de la Paix&#10;Paris, France"
            rows={2}
            className="w-full bg-[#221813] border border-[#3d2a1f] rounded-xl p-2.5 text-xs text-[#f5e9dc] focus:outline-none focus:border-[#d4a373] resize-none leading-relaxed font-serif italic"
          />
        </div>

        {/* Sealing Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#33241b]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#a49182] hover:text-[#eedecf]"
          >
            Cancel
          </button>

          <button
            id="affix-wax-seal-submit-btn"
            onClick={handlePerformSealing}
            disabled={isSealing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8a2f1e] to-[#b83e28] hover:from-[#9c3622] hover:to-[#cb462e] text-[#fff2ee] text-xs md:text-sm font-medium shadow-xl border border-[#dc583f]/40 transition-all active:scale-95 disabled:opacity-50"
          >
            <Flame className={`w-4 h-4 text-amber-200 ${isSealing ? 'animate-bounce' : ''}`} />
            <span>{isSealing ? 'Pouring Wax & Stamping...' : 'Pour Wax & Press Seal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
