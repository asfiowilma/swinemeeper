import { persisted } from 'svelte-persisted-store';

export const difficulty = persisted<Difficulty>('swinemeeper-difficulty', 'beginner');
export const board = persisted<Board>('swinemeeper-board', []);
export const boardState = persisted<BoardState>('swinemeeper-state', []);
export const flags = persisted<BoardState>('swinemeeper-flags', []);
export const gameState = persisted<GameState>('swinemeeper-game-state', 'INITIALIZING');

export const time = persisted<number>('swinemeeper-time', 0);
