/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationHeader 
} from './components/NavigationHeader';
import { 
  StudioToolbar 
} from './components/StudioToolbar';
import { 
  LetterCanvas 
} from './components/LetterCanvas';
import { 
  LetterVault 
} from './components/LetterVault';
import { 
  AiMuseModal 
} from './components/AiMuseModal';
import { 
  TextPolisherModal 
} from './components/TextPolisherModal';
import { 
  WaxSealModal 
} from './components/WaxSealModal';
import { LoveLetter } from './types';
import { INITIAL_VAULT_LETTERS } from './data/themes';
import { Feather, Heart, Sparkles, X, Minimize2, Stamp } from 'lucide-react';

const STORAGE_KEY = 'beloved_letters_vault_v1';

export default function App() {
  // Load letters from localStorage or initial vault
  const [letters, setLetters] = useState<LoveLetter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved letters', e);
    }
    return INITIAL_VAULT_LETTERS;
  });

  // Active letter ID
  const [activeLetterId, setActiveLetterId] = useState<string>(() => {
    return letters[0]?.id || 'letter-001';
  });

  // Main navigation view
  const [activeView, setActiveView] = useState<'studio' | 'vault'>('studio');

  // Editing state for letter
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fullscreen candlelight reading mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isAiMuseOpen, setIsAiMuseOpen] = useState<boolean>(false);
  const [isPolishOpen, setIsPolishOpen] = useState<boolean>(false);
  const [initialPolishAction, setInitialPolishAction] = useState<string>('deepen_emotion');
  const [isWaxSealOpen, setIsWaxSealOpen] = useState<boolean>(false);

  // Save letters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    } catch (e) {
      console.warn('Could not persist letters', e);
    }
  }, [letters]);

  // Handle ESC key to exit fullscreen or modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        setIsAiMuseOpen(false);
        setIsPolishOpen(false);
        setIsWaxSealOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Current active letter
  const activeLetter = letters.find((l) => l.id === activeLetterId) || letters[0];

  // Update active letter fields
  const handleUpdateLetter = (updatedFields: Partial<LoveLetter>) => {
    setLetters((prev) =>
      prev.map((item) =>
        item.id === activeLetterId
          ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  // Create new love letter
  const handleNewLetter = () => {
    const newId = `letter-${Date.now()}`;
    const newLetter: LoveLetter = {
      id: newId,
      title: 'A New Whisper',
      dateline: 'In the quiet hours',
      salutation: 'My dearest,',
      body: 'I sat down by the window, and before my thoughts could turn elsewhere, they found you...',
      signoff: 'Forever yours,',
      sender: '',
      recipient: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSealed: false,
      sealColor: 'crimson',
      sealStamp: 'rose',
      themeId: 'antique-parchment',
      fontStyle: 'cormorant',
      fontSize: 'md',
      isFavorite: false,
      occasion: 'Just because',
      format: 'letter',
    };

    setLetters([newLetter, ...letters]);
    setActiveLetterId(newId);
    setActiveView('studio');
    setIsEditing(true);
  };

  // Select letter from vault
  const handleSelectLetter = (id: string) => {
    setActiveLetterId(id);
    setActiveView('studio');
  };

  // Delete letter
  const handleDeleteLetter = (id: string) => {
    const remaining = letters.filter((l) => l.id !== id);
    if (remaining.length === 0) {
      // Create a default if all are deleted
      const fresh: LoveLetter = {
        id: `letter-${Date.now()}`,
        title: 'An Unwritten Promise',
        dateline: 'Today',
        salutation: 'My dearest,',
        body: 'Every love story begins with a single line.',
        signoff: 'Yours always,',
        sender: '',
        recipient: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSealed: false,
        sealColor: 'crimson',
        sealStamp: 'heart',
        themeId: 'antique-parchment',
        fontStyle: 'cormorant',
        fontSize: 'md',
        isFavorite: false,
        occasion: 'Just because',
        format: 'letter',
      };
      setLetters([fresh]);
      setActiveLetterId(fresh.id);
    } else {
      setLetters(remaining);
      if (activeLetterId === id) {
        setActiveLetterId(remaining[0].id);
      }
    }
  };

  // Duplicate letter
  const handleDuplicateLetter = (id: string) => {
    const target = letters.find((l) => l.id === id);
    if (!target) return;
    const duplicated: LoveLetter = {
      ...target,
      id: `letter-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSealed: false,
    };
    setLetters([duplicated, ...letters]);
    setActiveLetterId(duplicated.id);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))
    );
  };

  // Print keepsake
  const handlePrint = () => {
    window.print();
  };

  // Apply letter from AI Muse
  const handleApplyLetterFromMuse = (generated: Partial<LoveLetter>) => {
    handleUpdateLetter({
      ...generated,
      isSealed: false,
    });
    setIsEditing(false);
  };

  // Apply polished text
  const handleApplyPolishedText = (newText: string) => {
    handleUpdateLetter({ body: newText });
  };

  // Apply wax seal
  const handleApplySeal = (sealColor: string, sealStamp: string, envelopeAddress?: string) => {
    handleUpdateLetter({
      isSealed: true,
      sealColor,
      sealStamp,
      ...(envelopeAddress !== undefined ? { envelopeAddress } : {}),
    });
  };

  // Open polish modal with specific action
  const handleOpenPolish = (action?: string) => {
    setInitialPolishAction(action || 'deepen_emotion');
    setIsPolishOpen(true);
  };

  return (
    <div className={`min-h-screen bg-[#110d0b] text-[#f7f1eb] font-sans-ui flex flex-col ${isFullscreen ? 'p-0' : ''}`}>
      {/* CANDLELIGHT FULLSCREEN READING MODE */}
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-[#0d0907] flex flex-col items-center justify-between p-4 md:p-10 overflow-y-auto">
          {/* Top Bar for Fullscreen */}
          <div className="w-full max-w-3xl flex items-center justify-between py-2 text-[#9c897a] border-b border-[#291d17] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="font-serif italic text-xs tracking-wider text-[#d4a373]">
                Candlelight Reading Mode
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#221813] hover:bg-[#30211a] text-[#eedecf] text-xs transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit (ESC)</span>
            </button>
          </div>

          {/* Centered Letter */}
          <div className="my-auto w-full flex justify-center py-6">
            <LetterCanvas
              letter={activeLetter}
              onUpdateLetter={handleUpdateLetter}
              onOpenSealModal={() => setIsWaxSealOpen(true)}
              onOpenPolishModal={() => handleOpenPolish()}
              onOpenAiMuse={() => setIsAiMuseOpen(true)}
              isEditing={false}
              setIsEditing={setIsEditing}
            />
          </div>

          {/* Fullscreen footer */}
          <div className="py-4 text-center text-xs font-serif text-[#6d5b4e] italic">
            Beloved Love Letter Studio • Read slowly, as it was written
          </div>
        </div>
      ) : (
        /* STANDARD STUDIO / VAULT VIEW */
        <>
          <NavigationHeader
            activeView={activeView}
            setActiveView={setActiveView}
            isFullscreen={isFullscreen}
            toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onNewLetter={handleNewLetter}
            onOpenAiMuse={() => setIsAiMuseOpen(true)}
            onPrint={handlePrint}
            vaultCount={letters.length}
          />

          <main className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-7xl mx-auto w-full">
            {activeView === 'studio' ? (
              <div className="w-full flex flex-col items-center animate-fade-in">
                {/* Studio Toolbar (Styling, Fonts, Wax Seal, Polish shortcuts) */}
                <StudioToolbar
                  letter={activeLetter}
                  onUpdateLetter={handleUpdateLetter}
                  onOpenAiMuse={() => setIsAiMuseOpen(true)}
                  onOpenPolishModal={handleOpenPolish}
                  onOpenSealModal={() => setIsWaxSealOpen(true)}
                />

                {/* The Letter Parchment Canvas */}
                <LetterCanvas
                  letter={activeLetter}
                  onUpdateLetter={handleUpdateLetter}
                  onOpenSealModal={() => setIsWaxSealOpen(true)}
                  onOpenPolishModal={handleOpenPolish}
                  onOpenAiMuse={() => setIsAiMuseOpen(true)}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              </div>
            ) : (
              /* Keepsake Vault View */
              <LetterVault
                letters={letters}
                activeLetterId={activeLetterId}
                onSelectLetter={handleSelectLetter}
                onDeleteLetter={handleDeleteLetter}
                onDuplicateLetter={handleDuplicateLetter}
                onToggleFavorite={handleToggleFavorite}
                onNewLetter={handleNewLetter}
              />
            )}
          </main>

          {/* Studio Footer */}
          <footer className="no-print border-t border-[#261c16] py-6 px-4 text-center text-xs font-serif text-[#8c796b] bg-[#110d0b]">
            <p className="flex items-center justify-center gap-1.5 mb-1">
              <span>Beloved Love Letter Studio</span>
              <span>•</span>
              <span className="italic">Every sentiment preserved in timeless ink</span>
            </p>
            <p className="text-[11px] opacity-60">
              Crafted with romantic care, powered by Gemini 3.8 Flash
            </p>
          </footer>
        </>
      )}

      {/* AI Muse Modal */}
      <AiMuseModal
        isOpen={isAiMuseOpen}
        onClose={() => setIsAiMuseOpen(false)}
        onApplyLetter={handleApplyLetterFromMuse}
        currentLetter={activeLetter}
      />

      {/* Literary Polisher Modal */}
      <TextPolisherModal
        isOpen={isPolishOpen}
        onClose={() => setIsPolishOpen(false)}
        currentBody={activeLetter.body}
        onApplyPolishedText={handleApplyPolishedText}
        initialAction={initialPolishAction}
      />

      {/* Wax Sealing Modal */}
      <WaxSealModal
        isOpen={isWaxSealOpen}
        onClose={() => setIsWaxSealOpen(false)}
        selectedColor={activeLetter.sealColor}
        selectedStamp={activeLetter.sealStamp}
        envelopeAddress={activeLetter.envelopeAddress}
        onApplySeal={handleApplySeal}
      />
    </div>
  );
}
