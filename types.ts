
export type Step = 'welcome' | 'layout' | 'capture' | 'preview';

export interface LayoutOption {
  id: string;
  name: string;
  poses: number;
  description: string;
  grid: {
    cols: number;
    rows: number;
  };
  aspectRatio: string; // e.g., '2/6' for a tall strip
}

export interface FilterOption {
  name: string;
  value: string; // CSS filter value
}

export interface StickerObject {
  id: string;
  emoji: string;
  x: number; // percentage
  y: number; // percentage
  size: number; // in pixels
  rotation: number; // in degrees
}