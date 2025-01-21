import { blocks } from './components/Tetromino/Tetromino';
import { TetrominoType } from './components/GameBoard/GameBoard';

export type Direction = 'down' | 'left' | 'right';

export const randomTetromino = (): TetrominoType => {
  const block =
    blocks[Math.floor(Math.random() * blocks.length)];

  return {
    id: block.letter + Date.now(),
    shape: block.shape,
    letter: block.letter,
  };
};