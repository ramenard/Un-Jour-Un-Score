export type Game = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  lastActivationDate: string;
  isReady: boolean;
  imagePath?: string;
};

export const GAME_NAMES = {
  COIN_FLIP: 'coin-flip',
  ROCK_PAPER_SCISSORS: 'rock-paper-scissors',
} as const;
