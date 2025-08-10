import { Grid } from '../../grid/Grid';
import React from 'react';
import type { PixelType } from '../../grid/Pixel';
import { makeRefMatrix } from '../../utilities';
import { nextTetrominoAtom } from '../../atoms';
import { useAtomValue } from 'jotai';
import { rotateShapeClockwise } from '../../utilities';
import {
  addOrRemovePixel,
  clearBoard,
} from '../../grid/utilities';

export const NextTetromino = () => {
  const BOARD_WIDTH = 6;
  const BOARD_HEIGHT = 4;
  const FOCAL_POINT = [1, 1];
  const next = useAtomValue(nextTetrominoAtom);

  React.useEffect(() => {
    console.log(pixelRefs);
    clearBoard(pixelRefs, setPixelRef);
    displayNext();
  }, [next]);

  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix(BOARD_HEIGHT, BOARD_WIDTH)
  );

  const displayNext = (tetromino = next) => {
    let { shape } = tetromino;
    const { id, letter } = tetromino;

    switch (letter) {
      case 'i':
      case 'j':
      case 'l':
        shape = rotateShapeClockwise(shape);
        break;
    }

    const width = shape[0].length;
    const height = shape.length;
    const [x, y] = FOCAL_POINT;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let pixel = shape[i][j];

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
      pixelRefs.current[y][x] = pixel;
    }
    console.log(pixelRefs);
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
