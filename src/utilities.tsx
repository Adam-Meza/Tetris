import { blocks } from './components/Tetromino/Tetromino';
import { TetrominoType } from './components/Tetromino/Tetromino';

export type Direction =
  | 'down'
  | 'left'
  | 'right'
  | 'same'
  | 'up';

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

export const rotateShapeClockwise = (
  shape: (string | null)[][]
) => {
  const transposedShape = shape[0]
    .map((_, colIndex) => shape.map((row) => row[colIndex]))
    .map((row) => row.reverse());

  return transposedShape;
};
