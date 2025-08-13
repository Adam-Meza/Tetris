import { Grid } from '../../grid/Grid';
import React from 'react';
import type { PixelType } from '../../grid/Pixel';
import {
  nextTetrominoAtom,
  gameOverAtom,
} from '../../atoms';
import { useAtomValue } from 'jotai';
import { rotateShapeClockwise } from '../../utilities';
import { makeRefMatrix } from '../../grid/utilities';
import { GameManager } from '../../grid/GameManager';
import type { PieceType } from '../../grid/GameManagerTypes';

export const NextTetromino = () => {
  const BOARD_WIDTH = 6;
  const BOARD_HEIGHT = 4;

  const next = useAtomValue(nextTetrominoAtom);
  const gameOver = useAtomValue(gameOverAtom);

  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix(BOARD_HEIGHT, BOARD_WIDTH)
  );
  const focalPoint = React.useRef<number[]>([0, 0]);

  const gm = new GameManager(pixelRefs, focalPoint);

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

  const displayNext = (tetromino: PieceType) => {
    let focalPoint = [1, 1];
    const { letter } = tetromino;

    switch (letter) {
      case 'i':
      case 'j':
      case 'l':
        tetromino.shape = rotateShapeClockwise(
          tetromino.shape
        );
        break;
      case 'o':
        focalPoint = [2, 1];
        break;
    }

    gm.put({
      piece: tetromino,
      focalPoint: focalPoint,
    });
  };

  React.useMemo(() => {
    if (next && !gameOver) {
      gm.clearBoard();
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
