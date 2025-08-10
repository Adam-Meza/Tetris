import { Grid } from '../../grid/Grid';
import React from 'react';
import type { PixelType } from '../../grid/Pixel';
import { makeRefMatrix } from '../../utilities';
import { nextTetrominoAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { rotateShapeClockwise } from '../../utilities';
import { addOrRemovePixel } from '../../grid/utilities';

export const NextTetromino = () => {
  const BOARD_WIDTH = 6;
  const BOARD_HEIGHT = 4;
  const focalPoint = [1, 1];
  const next = useAtomValue(nextTetrominoAtom);

  React.useEffect(() => {
    displayNext();
  }, []);

  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix(BOARD_HEIGHT, BOARD_WIDTH)
  );

  const displayNext = (tetromino = next) => {
    let { shape } = tetromino;
    const { id, letter } = tetromino;

    if (letter === 'i') shape = rotateShapeClockwise(shape);

    const width = shape[0].length;
    const height = shape.length;
    const [x, y] = focalPoint;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (shape[i][j]) {
          addOrRemovePixel(
            pixelRefs,
            setPixelRef,
            x + j,
            y + i,
            'add',
            letter,
            id
          );
        }
      }
    }
  };

  const setPixelRef = (pixel: PixelType) => {
    const { x, y } = pixel;
    if (
      y >= 0 &&
      y < BOARD_HEIGHT &&
      x >= 0 &&
      x < BOARD_WIDTH
    ) {
      pixelRefs.current[y]![x] = pixel;
    }
  };

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
