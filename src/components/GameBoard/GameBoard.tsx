import React from 'react';
import { Grid } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';

export type PixelType = {
  x: number;
  y: number;
  id?: string | undefined;
  html?: React.RefObject<HTMLSpanElement>;
  nextSquare?: PixelType | undefined;
  letter?: string;
};

/**
 * Tetris GameBoardComponent -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  const boardHeight = 20;
  const boardWidth = 10;
  const [currentPiece, setPiece] =
    React.useState<TetrominoType>();

  const pickRandomPiece = (): TetrominoType => {
    const block =
      blocks[Math.floor(Math.random() * blocks.length)];

    return {
      id: block.letter + Date.now(),
      shape: block.shape,
      letter: block.letter,
    };
  };

  /**
   * Focal point determining the coordinates on the Grid that pieces are placed/oriented with
   *
   * @returns [ x : number, y : number ]
   */
  const focalPointRef = React.useRef<number[]>([3, 0]);

  /**
   * This is a mutable ref that will be used as the point of truth for game state logic
   */
  const pixelRefs = React.useRef<{
    [key: string]: PixelType;
  }>({});

  const setPixelRef = (pixel: PixelType) => {
    const key = `${pixel.x}-${pixel.y}`;

    if (!pixelRefs.current[key]) {
      pixelRefs.current[key] = pixel;
    } else {
      pixelRefs.current[key] = {
        ...pixelRefs.current[key],
        ...pixel,
      };
    }
  };

  const handleClassChange = (
    colIndex: number,
    rowIndex: number,
    action: 'add' | 'remove',
    tetromino: TetrominoType
  ) => {
    const x = focalPointRef.current[0] + colIndex;
    const y = focalPointRef.current[1] + rowIndex;
    const { letter, id } = tetromino;

    const dataRef = pixelRefs.current[
      `${x}-${y}`
    ] as PixelType;

    const spanRef = dataRef.html?.current as HTMLElement;

    if (!spanRef) return;

    if (action === 'add') {
      spanRef.classList.add(`${letter}-block`);
      setPixelRef({ x, y, id: id });
    } else {
      spanRef.classList.remove(`${letter}-block`);
      setPixelRef({
        x,
        y,
        id: undefined,
      });
    }
  };

  const addOrRemoveTetromino = (
    tetromino = currentPiece,
    action: 'add' | 'remove'
  ) => {
    tetromino?.shape.forEach(
      //@ts-expect-error: unknown error
      (row: TetrominoType[], rowIndex: number) => {
        row.forEach(
          (cell: TetrominoType, colIndex: number) => {
            if (cell) {
              handleClassChange(
                colIndex,
                rowIndex,
                action,
                tetromino
              );
            }
          }
        );
      }
    );
  };

  const nextSpaceOccupied = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (!currentPiece) return;

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        let x = j;
        let y = i;

        const square = pixelRefs?.current[`${x}-${y}`];

        switch (direction) {
          case 'down':
            y += 1;
            break;
          case 'left':
            if (x > 0) x -= 1;
            break;
          case 'right':
            if (
              x + currentPiece.shape[0].length <
              boardWidth
            )
              x += 1;
            break;
        }

        const nextSquare = pixelRefs?.current[`${x}-${y}`];

        if (square.id === currentPiece?.id)
          if (
            !nextSquare ||
            (square.id !== nextSquare.id && nextSquare.id)
          ) {
            return true;
          }
      }
    }
    return false;
  };

  const moveTetromino = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (!currentPiece) return;

    let [x, y] = focalPointRef.current;

    switch (direction) {
      case 'down':
        y += 1;
        break;
      case 'left':
        if (x > 0 && !nextSpaceOccupied('left')) x -= 1;
        break;
      case 'right':
        if (
          x + currentPiece.shape[0].length < boardWidth &&
          !nextSpaceOccupied('right')
        )
          x += 1;
        break;
    }

    addOrRemoveTetromino(currentPiece, 'remove');
    focalPointRef.current = [x, y];
    addOrRemoveTetromino(currentPiece, 'add');

    if (nextSpaceOccupied('down')) handleBlockLanding();
  };

  const handleBlockLanding = () => {
    makeNewPiece();
  };

  const makeNewPiece = () => {
    const newPiece = pickRandomPiece();
    setPiece(newPiece);

    focalPointRef.current = [3, 0];
    addOrRemoveTetromino(newPiece, 'add');
  };

  React.useEffect(() => {
    if (currentPiece) {
      const interval = setInterval(() => {
        moveTetromino('down');
      }, 700);
      return () => clearInterval(interval);
    }
  }, [currentPiece]);

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'ArrowDown':
        moveTetromino('down');
        return;
      case 'ArrowLeft':
        moveTetromino('left');
        return;
      case 'ArrowRight':
        moveTetromino('right');
        return;
      case 'Enter':
        makeNewPiece();
        return;
    }
  };

  return (
    <div onKeyDown={(event) => handleKeyPress(event.key)}>
      <Grid
        setPixelRef={setPixelRef}
        width={10}
        height={boardHeight}
        ref={pixelRefs}
      />
      <div className='button-container'>
        <button
          onClick={() => {
            makeNewPiece();
          }}
        >
          Place Block
        </button>

        <button
          onClick={() => {
            console.log('currentPiece:', currentPiece);

            console.log('pixelrefs:', pixelRefs.current);
          }}
        >
          console log stuff
        </button>
      </div>
    </div>
  );
};
