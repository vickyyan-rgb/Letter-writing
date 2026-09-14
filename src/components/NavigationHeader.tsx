import React, { useState } from 'react';
import { 
  Feather, 
  Archive, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Plus, 
  Sparkles, 
  Flame, 
  CloudRain, 
  Disc,
  Sliders
} from 'lucide-react';
import { ambianceAudio } from '../utils/audioAmbiance';

interface NavigationHeaderProps {
  activeView: 'studio' | 'vault';
  setActiveView: (view: 'studio' | 'vault') => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onNewLetter: () => void;
  onOpenAiMuse: () => void;
  onPrint: () => void;
  vaultCount: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeView,
  setActiveView,
  isFullscreen,
  toggleFullscreen,
  onNewLetter,
  onOpenAiMuse,
  onPrint,
  vaultCount,
}) => {
  const [showAmbianceMenu, setShowAmbianceMenu] = useState(false);
  const [currentSound, setCurrentSound] = useState<'off' | 'rain' | 'fireplace' | 'vinyl'>(ambianceAudio.getCurrentSound());
  const [volume, setVolume] = useState<number>(ambianceAudio.getVolume());

  const handleSoundChange = (sound: 'off' | 'rain' | 'fireplace' | 'vinyl') => {
    ambianceAudio.playSound(sound);
    setCurrentSound(sound);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambianceAudio.setVolume(val);
  };

  return (
    <header className="no-print border-b border-[#2d241e] bg-[#14100d]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Brand & Studio Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8a3324] via-[#5c1a11] to-[#3a0d07] flex items-center justify-center shadow-lg border border-[#a84432]/40 text-[#fcedea]">
          <Feather className="w-5 h-5 text-[#f5d0c5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-serif tracking-tight text-[#fdf6ee] font-semibold flex items-center gap-1.5">
              Beloved
              <span className="text-xs font-sans-ui tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#35251c] text-[#d4a373] border border-[#523b2c]">
                Studio
              </span>
            </h1>
          </div>
          <p className="text-xs text-[#a89587] hidden sm:block font-serif italic">
            The Atelier of Heartfelt Letters, Poems & Vows
          </p>
        </div>
      </div>

      {/* Center navigation tabs */}
      <div className="flex items-center bg-[#1d1612] p-1 rounded-xl border border-[#33261e]">
        <button
          id="nav-studio-btn"
          onClick={() => setActiveView('studio')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeView === 'studio'
              ? 'bg-[#3b271d] text-[#fbeee0] shadow-sm border border-[#6b4733]'
              : 'text-[#9c897a] hover:text-[#f3e7dc]'
          }`}
        >
          <Feather className="w-4 h-4 text-[#d4a373]" />
          <span>Atelier</span>
        </button>
        <button
          id="nav-vault-btn"
          onClick={() => setActiveView('vault')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
            activeView === 'vault'
              ? 'bg-[#3b271d] text-[#fbeee0] shadow-sm border border-[#6b4733]'
              : 'text-[#9c897a] hover:text-[#f3e7dc]'
          }`}
        >
          <Archive className="w-4 h-4 text-[#d4a373]" />
          <span>Keepsake Vault</span>
          {vaultCount > 0 && (
            <span className="text-[10px] bg-[#5a3928] text-[#f6d7bd] px-1.5 py-0.2 rounded-full font-bold">
              {vaultCount}
            </span>
          )}
        </button>
      </div>

      {/* Right utility buttons */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* AI Muse Trigger */}
        <button
          id="topbar-muse-btn"
          onClick={onOpenAiMuse}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7a2517] to-[#9b311f] hover:from-[#8d2d1c] hover:to-[#ae3823] text-[#fff1ee] text-xs md:text-sm font-medium shadow-md transition-all border border-[#b64632]/50 hover:shadow-lg active:scale-95"
          title="Summon the Romantic AI Muse"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#fcd5ce]" />
          <span>AI Muse</span>
        </button>

        {/* New Letter */}
        <button
          id="topbar-new-letter-btn"
          onClick={onNewLetter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b1f18] hover:bg-[#382920] text-[#edd9c9] text-xs md:text-sm font-medium border border-[#4a362a] transition-all active:scale-95"
          title="Start a New Blank Letter"
        >
          <Plus className="w-3.5 h-3.5 text-[#d4a373]" />
          <span className="hidden sm:inline">New Letter</span>
        </button>

        {/* Ambiance Soundscape Button */}
        <div className="relative">
          <button
            id="ambiance-toggle-btn"
            onClick={() => setShowAmbianceMenu(!showAmbianceMenu)}
            className={`p-2 rounded-lg border transition-all ${
              currentSound !== 'off'
                ? 'bg-[#402619] border-[#8a4e32] text-[#f5cca0]'
                : 'bg-[#1f1712] border-[#382a20] text-[#a49182] hover:text-[#f3e7dc]'
            }`}
            title="Romantic Soundscape Ambiance"
          >
            {currentSound !== 'off' ? (
              <Volume2 className="w-4 h-4 animate-pulse text-[#f5cca0]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Ambiance Popup Menu */}
          {showAmbianceMenu && (
            <div className="absolute right-0 mt-2 w-64 p-3 bg-[#1c1511] border border-[#422e23] rounded-xl shadow-2xl z-50 text-[#f5e9dc]">
              <div className="flex items-center justify-between border-b border-[#33241b] pb-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#d4a373] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Studio Atmosphere
                </span>
                <span className="text-[10px] text-[#9b887a] italic">Web Audio</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button
                  onClick={() => handleSoundChange('rain')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                    currentSound === 'rain'
                      ? 'bg-[#45281b] text-[#fbe1ce] border border-[#7a4932]'
                      : 'bg-[#261c16] hover:bg-[#30231c] text-[#a89587]'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5 text-[#85b8cb]" />
                  <span>Rain on Glass</span>
                </button>
                <button
                  onClick={() => handleSoundChange('fireplace')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                    currentSound === 'fireplace'
                      ? 'bg-[#45281b] text-[#fbe1ce] border border-[#7a4932]'
                      : 'bg-[#261c16] hover:bg-[#30231c] text-[#a89587]'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-[#e76f51]" />
                  <span>Hearth Embers</span>
                </button>
                <button
                  onClick={() => handleSoundChange('vinyl')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                    currentSound === 'vinyl'
                      ? 'bg-[#45281b] text-[#fbe1ce] border border-[#7a4932]'
                      : 'bg-[#261c16] hover:bg-[#30231c] text-[#a89587]'
                  }`}
                >
                  <Disc className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>Vinyl Warmth</span>
                </button>
                <button
                  onClick={() => handleSoundChange('off')}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                    currentSound === 'off'
                      ? 'bg-[#45281b] text-[#fbe1ce] border border-[#7a4932]'
                      : 'bg-[#261c16] hover:bg-[#30231c] text-[#a89587]'
                  }`}
                >
                  <VolumeX className="w-3.5 h-3.5 text-[#9b887a]" />
                  <span>Silence</span>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="pt-2 border-t border-[#33241b]">
                <div className="flex items-center justify-between text-[11px] text-[#9b887a] mb-1">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-[#33241b] rounded-lg appearance-none cursor-pointer accent-[#d4a373]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Print / Export Keepsake Button */}
        <button
          id="topbar-print-btn"
          onClick={onPrint}
          className="p-2 rounded-lg bg-[#1f1712] hover:bg-[#2e2119] text-[#a49182] hover:text-[#f3e7dc] border border-[#382a20] transition-all"
          title="Print or Save as Physical Keepsake"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Fullscreen Reading Mode */}
        <button
          id="topbar-fullscreen-btn"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-[#1f1712] hover:bg-[#2e2119] text-[#a49182] hover:text-[#f3e7dc] border border-[#382a20] transition-all"
          title={isFullscreen ? "Exit Candlelight Reading" : "Candlelight Fullscreen Mode"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
