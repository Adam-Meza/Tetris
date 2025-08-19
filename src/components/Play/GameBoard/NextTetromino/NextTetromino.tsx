import React from 'react';
import { Grid } from '../../../../grid/Grid';
import type { PixelType } from '../../../../grid/Pixel';
import { useAtomValue } from 'jotai';
import {
  nextTetrominoAtom,
  gameOverAtom,
} from '../../../../atoms';
import {
  getLetter,
  rotateShapeClockwise,
} from '../utilities';
import { GameManager } from '../../../../grid/GameManager';
import type {
  Coord,
  PieceType,
} from '../../../../grid/GameManagerTypes';

export const NextTetromino = () => {
  const BOARD_WIDTH = 6;
  const BOARD_HEIGHT = 4;

  const next = useAtomValue(nextTetrominoAtom);
  const gameOver = useAtomValue(gameOverAtom);

  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    Array.from({ length: BOARD_HEIGHT }, () =>
      Array.from({ length: BOARD_WIDTH }, () => null)
    )
  );

  const focalPointRef = React.useRef<Coord>([0, 0]);

  const gm = React.useMemo(
    () => new GameManager(pixelRefs, focalPointRef),
    []
  );

  // track when all preview pixels are mounted (StrictMode-safe)
  const totalCells = BOARD_WIDTH * BOARD_HEIGHT;
  const seen = React.useRef(0);
  const [ready, setReady] = React.useState(false);

  const setPixelRef = (pixel: PixelType) => {
    const { x, y } = pixel;
    if (
      y >= 0 &&
      y < BOARD_HEIGHT &&
      x >= 0 &&
      x < BOARD_WIDTH
    ) {
      if (!pixelRefs.current[y][x]) seen.current += 1;
      pixelRefs.current[y][x] = pixel;
      if (!ready && seen.current === totalCells)
        setReady(true);
    }
  };

  // pure helper: clone a piece without mutating the atom value
  const clonePiece = (p: PieceType): PieceType => ({
    ...p,
  });

  const displayNext = (source: PieceType) => {
    const preview = clonePiece(source);
    let previewFocal: Coord = [1, 1];

    switch (getLetter(preview.id!)) {
      case 'i':
      case 'j':
      case 'l':
        preview.shape = rotateShapeClockwise(preview.shape);
        break;
      case 'o':
        previewFocal = [2, 1];
        break;
    }

    gm.clearBoard();
    gm.put({ piece: preview, focalPoint: previewFocal });
  };

  // draw whenever next changes, but only after the grid is ready
  React.useEffect(() => {
    if (!ready || !next || gameOver) return;
    // ensure DOM refs are all live this frame
    requestAnimationFrame(() => displayNext(next));
  }, [ready, next, gameOver]);

  return (
    <div className='next-tetromino-wrapper grid-wrapper'>
      <Grid
        dimensions={[BOARD_WIDTH, BOARD_HEIGHT]}
        setPixelRef={setPixelRef}
        baseClass='tetromino'
      />
    </div>
  );
};
