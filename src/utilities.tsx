import { blocks } from './components/Tetromino/Tetromino';
import { TetrominoType } from './components/Tetromino/Tetromino';
import type { PixelType } from './grid/Pixel';

export type Direction = 'down' | 'left' | 'right' | 'same';

export const randomTetromino = (): TetrominoType => {
  const block =
    blocks[Math.floor(Math.random() * blocks.length)];

  return {
    id: block.letter + Date.now(),
    shape: block.shape,
    letter: block.letter,
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

export const makeNewCoordinates = (
  x: number,
  y: number,
  direction: Direction
) => {
  let newX = x;
  let newY = y;

  switch (direction) {
    case 'down':
      newY += 1;
      break;
    case 'left':
      newX -= 1;
      break;
    case 'right':
      newX += 1;
      break;
  }

  return [newX, newY];
};

export const makeRefMatrix = (
  height: number,
  width: number
) =>
  Array.from({ length: height }, () =>
    Array.from(
      { length: width },
      () => null as PixelType | null
    )
  );
