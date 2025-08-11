import { Grid } from '../../grid/Grid';
import React from 'react';
import type { PixelType } from '../../grid/Pixel';
import {
  nextTetrominoAtom,
  gameOverAtom,
} from '../../atoms';
import { useAtomValue } from 'jotai';
import { rotateShapeClockwise } from '../../utilities';
import {
  addOrRemovePixel,
  clearBoard,
  makeRefMatrix,
} from '../../grid/utilities';
import { TetrominoType } from '../Tetromino/Tetromino';

export const NextTetromino = () => {
  const BOARD_WIDTH = 6;
  const BOARD_HEIGHT = 4;
  let focalPoint = [1, 1];

  const next = useAtomValue(nextTetrominoAtom);
  const gameOver = useAtomValue(gameOverAtom);

  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix(BOARD_HEIGHT, BOARD_WIDTH)
  );

  const setPixelRef = (pixel: PixelType) => {
    const { x, y } = pixel;
    if (
      y >= 0 &&
      y < BOARD_HEIGHT &&
      x >= 0 &&
      x < BOARD_WIDTH
    ) {
      pixelRefs.current[y][x] = pixel;
    }
  };

  const displayNext = (tetromino: TetrominoType) => {
    let { shape } = tetromino;
    const { id, letter } = tetromino;

    switch (letter) {
      case 'i':
      case 'j':
      case 'l':
        shape = rotateShapeClockwise(shape);
        break;
      case 'o':
        focalPoint = [2, 1];
        break;
    }

    const width = shape[0].length;
    const height = shape.length;
    const [x, y] = focalPoint;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (shape[i][j]) {
          addOrRemovePixel(
            pixelRefs,
            [x + j, y + i],
            'add',
            letter,
            id
          );
        }
      }
    }
  };

  const display = React.useMemo(() => {
    if (next && !gameOver) {
      clearBoard(pixelRefs);
      displayNext(next);
    }
  }, [next, gameOver]);

  return (
    <div className='next-tetromino-wrapper grid-wrapper'>
      <Grid
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        setPixelRef={setPixelRef}
        baseClass='tetromino'
      />
    </div>
  );
};
