import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  Feather, 
  Plus, 
  Calendar, 
  Filter,
  Sparkles,
  Archive,
  BookOpen
} from 'lucide-react';
import { LoveLetter } from '../types';
import { STATIONERY_THEMES, WAX_SEAL_COLORS } from '../data/themes';

interface LetterVaultProps {
  letters: LoveLetter[];
  activeLetterId: string;
  onSelectLetter: (letterId: string) => void;
  onDeleteLetter: (letterId: string) => void;
  onDuplicateLetter: (letterId: string) => void;
  onToggleFavorite: (letterId: string) => void;
  onNewLetter: () => void;
}

export const LetterVault: React.FC<LetterVaultProps> = ({
  letters,
  activeLetterId,
  onSelectLetter,
  onDeleteLetter,
  onDuplicateLetter,
  onToggleFavorite,
  onNewLetter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites' | 'sealed' | 'poems'>('all');

  const filteredLetters = letters.filter((letter) => {
    const matchesSearch = 
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.sender.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'favorites') return letter.isFavorite;
    if (filterMode === 'sealed') return letter.isSealed;
    if (filterMode === 'poems') return letter.format === 'poem';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-fade-in">
      {/* Vault Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#2d2119] pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#fdf5ee] flex items-center gap-2.5">
            <Archive className="w-6 h-6 text-[#d4a373]" />
            <span>The Keepsake Vault</span>
          </h2>
          <p className="text-xs md:text-sm text-[#a89587] font-serif italic mt-1">
            Your preserved correspondence, sealed vows, and cherished verses
          </p>
        </div>

        <button
          onClick={onNewLetter}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a2f1e] to-[#b83e28] hover:from-[#9c3622] hover:to-[#cb462e] text-[#fff2ee] text-xs md:text-sm font-medium shadow-lg border border-[#dc583f]/40 transition-all self-start md:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>New Love Letter</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8c796b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letters, recipients, memories..."
            className="w-full bg-[#1c1511] border border-[#38261c] rounded-xl pl-9 pr-3 py-2 text-xs text-[#f5e9dc] placeholder-[#7d6b5e] focus:outline-none focus:border-[#d4a373]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${letters.length})` },
            { id: 'favorites', label: `Favorites (${letters.filter(l => l.isFavorite).length})` },
            { id: 'sealed', label: `Wax Sealed (${letters.filter(l => l.isSealed).length})` },
            { id: 'poems', label: `Poetry (${letters.filter(l => l.format === 'poem').length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterMode(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif whitespace-nowrap transition-all ${
                filterMode === f.id
                  ? 'bg-[#3b271d] text-[#fbeee0] border border-[#6b4733] font-semibold'
                  : 'bg-[#1a1410] text-[#9b887a] hover:text-[#eedecf] border border-[#2e2017]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Letters Grid */}
      {filteredLetters.length === 0 ? (
        <div className="py-20 text-center bg-[#18120e] rounded-3xl border border-[#2e2017] p-8">
          <BookOpen className="w-12 h-12 text-[#5c473a] mx-auto mb-3" />
          <h3 className="text-lg font-serif text-[#fbe1ce] mb-1">No letters found in this drawer</h3>
          <p className="text-xs text-[#8c796b] max-w-sm mx-auto mb-6">
            {searchQuery 
              ? `No correspondence matched "${searchQuery}". Try different keywords.`
              : 'Your vault is waiting for its first sealed words.'}
          </p>
          <button
            onClick={onNewLetter}
            className="px-4 py-2 rounded-xl bg-[#2e1f18] hover:bg-[#3b271d] text-[#eedecf] text-xs font-serif border border-[#4d3627] inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#d4a373]" />
            <span>Compose a Letter Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLetters.map((letter) => {
            const theme = STATIONERY_THEMES.find((t) => t.id === letter.themeId) || STATIONERY_THEMES[0];
            const seal = WAX_SEAL_COLORS.find((c) => c.id === letter.sealColor) || WAX_SEAL_COLORS[0];
            const isCurrent = letter.id === activeLetterId;

            return (
              <div
                key={letter.id}
                onClick={() => onSelectLetter(letter.id)}
                className={`group cursor-pointer rounded-2xl p-5 transition-all flex flex-col justify-between border relative overflow-hidden ${
                  isCurrent
                    ? 'bg-[#221812] border-[#d4a373] shadow-lg ring-1 ring-[#d4a373]/30'
                    : 'bg-[#18120f] border-[#302219] hover:border-[#4d3627] hover:bg-[#1e1612]'
                }`}
              >
                {/* Top letter metadata */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-[#2a1d16] text-[#d4a373] border border-[#422e23]">
                      {letter.format}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(letter.id);
                      }}
                      className="text-[#9c897a] hover:text-[#e07a5f] transition-colors p-1"
                      title={letter.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                    >
                      <Heart 
                        className={`w-4 h-4 ${letter.isFavorite ? 'text-[#e07a5f] fill-[#e07a5f]' : ''}`} 
                      />
                    </button>
                  </div>

                  <h3 className="text-base font-serif font-semibold text-[#fbf1e8] line-clamp-1 mb-1 group-hover:text-amber-200 transition-colors">
                    {letter.title || 'Untitled Letter'}
                  </h3>

                  <div className="text-xs text-[#d4a373] font-serif italic mb-2">
                    To: {letter.recipient || 'Beloved'}
                  </div>

                  {/* Snippet preview */}
                  <p className="text-xs text-[#a49182] font-serif line-clamp-3 leading-relaxed mb-4">
                    {letter.body || 'No text penned yet.'}
                  </p>
                </div>

                {/* Bottom card footer */}
                <div className="pt-3 border-t border-[#291d16] flex items-center justify-between text-[11px] text-[#7d6c5e]">
                  <div className="flex items-center gap-2">
                    {letter.isSealed ? (
                      <span className="flex items-center gap-1 text-[#e07a5f]">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: seal.hex }} 
                        />
                        <span>Sealed</span>
                      </span>
                    ) : (
                      <span className="text-[#8c796b]">Draft</span>
                    )}
                  </div>

                  {/* Actions (Duplicate, Delete) */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateLetter(letter.id);
                      }}
                      className="p-1.5 hover:bg-[#2b1e16] rounded text-[#9b887a] hover:text-[#eedecf]"
                      title="Duplicate this letter"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you wish to consign "${letter.title}" to the ashes?`)) {
                          onDeleteLetter(letter.id);
                        }
                      }}
                      className="p-1.5 hover:bg-[#2b1e16] rounded text-[#9b887a] hover:text-red-400"
                      title="Consign to ashes (delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
