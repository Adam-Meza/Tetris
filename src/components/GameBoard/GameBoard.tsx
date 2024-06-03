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
  const boardWidth = 10;
  const boardHeight = 20;
  const [currentTetromino, setTetromino] =
    React.useState<TetrominoType>();

  const randomTetromino = (): TetrominoType => {
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

    if (!pixelRefs.current[key])
      pixelRefs.current[key] = pixel;
    else
      pixelRefs.current[key] = {
        ...pixelRefs.current[key],
        ...pixel,
      };
  };

  const addOrRemovePixel = (
    x: number,
    y: number,
    action: 'add' | 'remove',
    letter?: string,
    id?: string
  ) => {
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

  const updateCurrentTetromino = (
    tetromino = currentTetromino,
    action: 'add' | 'remove'
  ) => {
    tetromino?.shape.forEach(
      (row: (string | null)[], rowIndex: number) => {
        row.forEach(
          (cell: string | null, colIndex: number) => {
            if (cell) {
              const x = focalPointRef.current[0] + colIndex;
              const y = focalPointRef.current[1] + rowIndex;

              const { id, letter } = tetromino;

              addOrRemovePixel(x, y, action, letter, id);
            }
          }
        );
      }
    );
  };

  const isMovePossible = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (!currentTetromino) return;

    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        let x = j;
        let y = i;

        const square = pixelRefs?.current[`${x}-${y}`];

        switch (direction) {
          case 'down':
            y += 1;
            break;
          case 'left':
            x -= 1;
            break;
          case 'right':
            x += 1;
            break;
        }

        const nextSquare = pixelRefs?.current[`${x}-${y}`];

        if (square.id === currentTetromino.id)
          if (
            !nextSquare ||
            (square.id !== nextSquare.id && nextSquare.id)
          ) {
            return false;
          }
      }
    }
    return true;
  };

  const moveTetromino = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (!currentTetromino) return;

    let [x, y] = focalPointRef.current;

    switch (direction) {
      case 'down':
        if (isMovePossible('down')) y += 1;
        break;
      case 'left':
        if (isMovePossible('left')) x -= 1;
        break;
      case 'right':
        if (isMovePossible('right')) x += 1;
        break;
    }

    updateCurrentTetromino(currentTetromino, 'remove');
    focalPointRef.current = [x, y];
    updateCurrentTetromino(currentTetromino, 'add');

    console.log('ere');

    if (!isMovePossible('down'))
      setTimeout(() => {
        handleBlockLanding();
      }, 200);
  };

  const moveRowsDown = () => {
    const pixelsInRows = reformattedRefs();

    console.log(pixelsInRows);
  };

  const handleBlockLanding = () => {
    // put a timer here to wait for a side move if no move make new piece

    makeNewTetromino();
    if (findCompletedRows()) {
      const rows = findCompletedRows();
      removeRows(rows);
    }
  };

  const removeRows = (rows: number[]) => {
    if (!rows) return;

    rows.forEach((y) => {
      for (let i = 0; i < boardWidth; i++) {
        if (!pixelRefs.current[`${i}-${y}`].id) return;

        const id = pixelRefs.current[`${i}-${y}`].id;
        const letter = id?.split('')[0];

        addOrRemovePixel(i, y, 'remove', letter);
      }
    });
  };

  const reformattedRefs = () => {
    const pixelsInRows = [];

    for (let i = 0; i < boardHeight; i++) {
      const row = [];

      for (let j = 0; j < boardWidth; j++) {
        const pixel = pixelRefs.current[`${j}-${i}`];
        row.push(pixel);
      }

      pixelsInRows.push(row);
    }

    return pixelsInRows;
  };

  const findCompletedRows = (): number[] => {
    const pixelsInRows = reformattedRefs();
    const rowsToRemove = [] as number[];

    pixelsInRows.forEach((row, index) => {
      if (row.every((pixel) => pixel.id)) {
        rowsToRemove.push(index);
      }
    });

    return rowsToRemove;
  };

  const makeNewTetromino = () => {
    if (
      focalPointRef.current[0] === 3 &&
      focalPointRef.current[1] === 0 &&
      currentTetromino
    )
      return;

    const tetromino = randomTetromino();
    setTetromino(tetromino);

    focalPointRef.current = [3, 0];
    updateCurrentTetromino(tetromino, 'add');
  };

  const rotateShapeClockwise = (
    shape: (string | null)[][]
  ): (string | null)[][] => {
    // add some check in here to see if the next square exists

    const transposedShape = shape[0].map((_, colIndex) =>
      shape.map((row) => row[colIndex])
    );

    return transposedShape.map((row) => row.reverse());
  };

  const rotateTetromino = () => {
    if (!currentTetromino) return;

    const rotatedShape = rotateShapeClockwise(
      currentTetromino.shape
    );

    const rotated = {
      ...currentTetromino,
      shape: rotatedShape,
    };

    updateCurrentTetromino(currentTetromino, 'remove');
    setTetromino(rotated);
    updateCurrentTetromino(rotated, 'add');
  };

  // React.useEffect(() => {
  //   if (currentTetromino) {
  //     const interval = setInterval(() => {
  //       moveTetromino('down');
  //     }, 700);
  //     return () => clearInterval(interval);
  //   }
  // }, [currentTetromino]);

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'ArrowDown':
        if (isMovePossible('down')) moveTetromino('down');
        return;
      case 'ArrowLeft':
        if (isMovePossible('right')) moveTetromino('left');
        return;
      case 'ArrowRight':
        if (isMovePossible('right')) moveTetromino('right');
        return;
      case 'Enter':
        makeNewTetromino();
        return;
      case 'Shift':
        rotateTetromino();
        return;
    }
  };

  return (
    <div onKeyDown={(event) => handleKeyPress(event.key)}>
      <Grid
        setPixelRef={setPixelRef}
        width={boardWidth}
        height={boardHeight}
        ref={pixelRefs}
      />
      <div className='button-container'>
        <button
          onClick={() => {
            makeNewTetromino();
          }}
        >
          Place Block
        </button>

        <button
          onClick={() => {
            console.log(
              'currentTetromino:',
              currentTetromino
            );

            console.log('pixelrefs:', pixelRefs.current);
          }}
        >
          console log stuff
        </button>

        <button onClick={() => rotateTetromino()}>
          rotate
        </button>
      </div>
    </div>
  );
};
