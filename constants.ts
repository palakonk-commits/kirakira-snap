import type { LayoutOption, FilterOption } from './types';

export const LAYOUTS: LayoutOption[] = [
  { id: 'A', name: 'Layout A', poses: 4, description: '4 Poses', grid: { cols: 1, rows: 4 }, aspectRatio: '2/6' },
  { id: 'B', name: 'Layout B', poses: 3, description: '3 Poses', grid: { cols: 1, rows: 3 }, aspectRatio: '2/5' },
  { id: 'C', name: 'Layout C', poses: 2, description: '2 Poses', grid: { cols: 1, rows: 2 }, aspectRatio: '2/4' },
  { id: 'D', name: 'Layout D', poses: 6, description: '6 Poses', grid: { cols: 2, rows: 3 }, aspectRatio: '4/4.5' },
];

export const FILTERS: FilterOption[] = [
  { name: 'No Filter', value: 'none' },
  { name: 'B&W', value: 'grayscale(1)' },
  { name: 'Sepia', value: 'sepia(1)' },
  { name: 'Vintage', value: 'sepia(0.5) contrast(0.85) brightness(1.1)' },
  { name: 'Soft', value: 'brightness(1.05) blur(1px)' },
  { name: 'Noir', value: 'grayscale(1) contrast(1.3) brightness(0.7)' },
  { name: 'Vivid', value: 'saturate(1.8) contrast(1.2)' },
];

export const FRAME_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Pastel Pink', value: '#FAD1E6' },
  { name: 'Pastel Blue', value: '#D1E8FA' },
  { name: 'Pastel Green', value: '#D4F0E0' },
  { name: 'Pastel Yellow', value: '#FFFACD' },
  { name: 'Pastel Purple', value: '#E6DFF2' },
  { name: 'Black', value: '#4B4B4B' },
];

export const STICKER_PACKS: { name: string; stickers: string[] }[] = [
    { name: 'No Stickers', stickers: []},
    { name: 'Kawaii Friends', stickers: ['🐶', '🐰', '🐻‍❄️', '🦊', '🐱', '🐼', '💖', '🌸', '☁️', '⭐']},
    { name: 'Girlypop', stickers: ['🩷', '✨', '🎀', '💅', '👑', '💄', '💖', '💎']},
    { name: 'Jellycat', stickers: ['🐸', '🐻', '🥑', '🍞', '☕️', '🥚', '🍉', '🥐']},
    { name: 'Cute', stickers: ['🥰', '🥹', '🥺', '😇', '😴', '👻', '🍓', '🍰']},
    { name: 'Mofusand', stickers: ['😻', '🍤', '🦈', '🍞', '🧺', '✏️', '💕', '🍀']},
    { name: 'Shin Chan', stickers: ['👦🏻', '🐶', '🍫', 'アクション仮面', '🍑', '🖍️', '🔥', '💧']},
    { name: 'Miffy', stickers: ['🐰', '🎈', '⭐', '🌙', '🚲', '🥕', '💧', '❤️']},
    { name: 'Mark\'s Debut', stickers: ['🐯', '🎤', '🎶', '🌹', '🥂', '🔥', '🎸', '🌟']},
];