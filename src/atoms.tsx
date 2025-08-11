import { atom } from 'jotai';
import { randomTetromino } from './utilities';
import { TetrominoType } from './components/Tetromino/Tetromino';
import { PrimitiveAtom } from 'jotai';

export const scoreAtom = atom(0);
export const gameOverAtom = atom(true);
export const currentTetrominoAtom = atom(randomTetromino());
export const nextTetrominoAtom = atom(randomTetromino());
