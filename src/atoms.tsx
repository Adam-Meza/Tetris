import { atom, useAtom } from 'jotai';
import { randomTetromino } from './utilities';

export const scoreAtom = atom(0);
export const gameOverAtom = atom(true);
export const currentTetrominoAtom = atom(randomTetromino());
