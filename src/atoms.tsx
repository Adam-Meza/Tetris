import { atom } from 'jotai';
import { randomTetromino } from './utilities';

export const scoreAtom = atom(0);
export const gameOverAtom = atom(true);
export const currentTetrominoAtom = atom(randomTetromino());
export const nextTetrominoAtom = atom(randomTetromino());
export const lineCountAtom = atom(0);
export const currentPlayerAtom = atom({
  name: 'test',
});
export const gamesAtom = atom([]);
