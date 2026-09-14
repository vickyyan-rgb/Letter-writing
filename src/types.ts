export type LetterFormat = 'letter' | 'poem' | 'vows' | 'postcard';

export type LetterTone = 
  | 'passionate'
  | 'tender'
  | 'poetic'
  | 'playful'
  | 'vows'
  | 'distance'
  | 'apology';

export type FontStyleId = 'cormorant' | 'newsreader' | 'alex' | 'caveat' | 'sans';

export interface LoveLetter {
  id: string;
  title: string;
  dateline: string;
  salutation: string;
  body: string;
  signoff: string;
  sender: string;
  recipient: string;
  createdAt: string;
  updatedAt: string;
  isSealed: boolean;
  sealColor: string;
  sealStamp: string;
  themeId: string;
  fontStyle: FontStyleId;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  isFavorite: boolean;
  occasion: string;
  format: LetterFormat;
  tags?: string[];
  envelopeAddress?: string;
}

export interface StationeryTheme {
  id: string;
  name: string;
  tagline: string;
  bgClass: string;
  paperBg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  envelopeColor: string;
  fontFamily: string;
  isDark: boolean;
}

export interface WaxSealColor {
  id: string;
  name: string;
  bgGradient: string;
  hex: string;
  borderHex: string;
}

export interface WaxSealStamp {
  id: string;
  name: string;
  iconName: string;
  meaning: string;
}

export interface AiLetterParams {
  recipient: string;
  sender: string;
  occasion: string;
  tone: LetterTone;
  format: LetterFormat;
  length: 'short' | 'medium' | 'long';
  keyMemories: string;
  specialQuirks: string;
  futurePromise: string;
  poeticElements: string;
}
