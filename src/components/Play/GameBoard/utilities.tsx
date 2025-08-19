import { blocks } from '../GameBoard/Tetromino/Tetromino';
import { TetrominoType } from './Tetromino/Tetromino';
import { ShapeMatrix } from '../../../grid/GameManagerTypes';

export const randomTetromino = (): TetrominoType => {
  const block =
    blocks[Math.floor(Math.random() * blocks.length)];

  return {
    id: block.letter + Date.now(),
    shape: block.shape,
    letter: block.letter,
    className: `${block.letter}-block`,
  };
};

export const getLetter = (id: string): string => {
  return id.split('')[0];
};

export const calculateScore = (
  multiplier: number,
  score: number
) => {
  const newScore =
    score +
    multiplier * (150 * Math.floor(Math.random() * 10));

  return newScore;
};
