import { atom } from 'jotai';
import { randomTetromino } from './components/Play/GameBoard/utilities';

export const scoreAtom = atom(0);
export const gameOverAtom = atom(true);
export const currentTetrominoAtom = atom(randomTetromino());
export const nextTetrominoAtom = atom(randomTetromino());
export const lineCountAtom = atom(0);
export const currentPlayerAtom = atom({
  userName: 'GUEST',
});
export const gamesAtom = atom([]);
export const gamePauseAtom = atom(true);
