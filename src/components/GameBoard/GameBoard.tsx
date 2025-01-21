import React from 'react';
import { Grid } from '../../grid/Grid';
import { TetrominoType } from '../Tetromino/Tetromino';
import { PixelType } from '../../grid/Pixel';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import {
  randomTetromino,
  Direction,
  calculateScore,
  rotateShapeClockwise,
  getLetter,
} from '../../utilities';

/**
 * Tetris GameBoard Component -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  const boardWidth = 10;
  const boardHeight = 20;
  const [currentTetromino, setTetromino] =
    React.useState<TetrominoType>();
  const [gameOver, setGameOver] = React.useState(false);
  const [score, setScore] = React.useState(0);

  /**
   * Focal point determining the coordinates on the Grid that pieces are placed/oriented with.
   */
  const focalPointRef = React.useRef<[number, number]>([
    3, 0,
  ]);

  /**
   * This is a mutable ref object that will be used as the point of truth for game state logic
   */
  const pixelRefs = React.useRef<{
    [key: string]: PixelType;
  }>({});

  /**
   * This sets the individual pixel ref objects and is responsible for effecting change on the dom

   */
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

    if (!spanRef) return false;

    if (action === 'add') {
      // right now we are both adding the class and setting the ref
      // shouldnt one be good enough?
      // Why isnt it enough?
      spanRef.classList.add(`${letter}-block`);
      setPixelRef({ x, y, id: id });
    } else if (action === 'remove') {
      spanRef.classList.remove(`${letter}-block`);
      setPixelRef({
        x,
        y,
        id: undefined,
      });
    }
  };

  // this will take the entire tetromino and
  // invoke addOrRemove Pixel to update the pixel
  const updateCurrentTetromino = (
    action: 'add' | 'remove',
    tetromino = currentTetromino
  ) => {
    tetromino?.shape.forEach(
      (row: (string | null)[], rowIndex: number) => {
        row.forEach(
          (cell: string | null, colIndex: number) => {
            if (cell) {
              const x = focalPointRef.current[0] + colIndex;
              const y = focalPointRef.current[1] + rowIndex;

              const { id } = tetromino;
              const letter = getLetter(id);

              addOrRemovePixel(x, y, action, letter, id);
            }
          }
        );
      }
    );
  };

  const isMovePossible = (
    direction: Direction,
    current = currentTetromino
  ) => {
    for (let i = 0; i < boardHeight; i++) {
      for (let j = 0; j < boardWidth; j++) {
        let x = j,
          y = i;

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
        const tetrominoLength =
          current?.shape[0].length ?? 0;

        // This is where the verification happens,
        // first we check if the square in question is occupied by the current Tetromino
        if (square.id === current?.id)
          if (
            // then if the next square doesn't exist return false
            !nextSquare ||
            /* Or if the next square does exist,
              but the target square has an id other than the default
             i.e. the square is already occupied, then return false */
            (nextSquare.id &&
              square.id !== nextSquare.id) ||
            //Of if the length of the Tetromino plus the X value of the focal point
            // is greater then the width of the board, return false.
            tetrominoLength + focalPointRef.current[0] >
              boardWidth
          )
            return false;
      }
    }
    return true;
  };

  const moveTetromino = (direction: Direction) => {
    if (!currentTetromino) return;
    let [x, y] = focalPointRef.current;

    if (isMovePossible(direction)) {
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
    }

    updateCurrentTetromino('remove');
    focalPointRef.current = [x, y];
    updateCurrentTetromino('add');

    // this is causing a user error:
    //to recreate hold the down arrow while there's a current tetromino
    // new pieces will load on top of each other
    if (!isMovePossible('down')) handleBlockLanding();
  };

  const moveRowsDown = (rows: number[]) => {
    const pixelsInRows = reformattedRefs().reverse();

    pixelsInRows.forEach((row) => {
      row.forEach((pixel) => {
        if (pixel.y < rows[0]) {
          const { x, y, id } = pixel;
          const letter = getLetter(id);

          addOrRemovePixel(x, y, 'remove', letter);
          addOrRemovePixel(
            x,
            y + rows.length,
            'add',
            letter,
            id
          );
        }
      });
    });
  };

  // this is causing a user error:
  //to recreate hold the down arrow while there's a current tetromino
  // new pieces will load on top of each other
  const handleBlockLanding = () => {
    setTimeout(() => {
      const completedRowIndexes = findCompletedRows();

      if (completedRowIndexes) {
        removeRows(completedRowIndexes);
        moveRowsDown(completedRowIndexes);

        const newScore = calculateScore(
          completedRowIndexes.length,
          score
        );

        setScore(newScore);
      }

      makeNewTetromino();
    }, 150);
  };

  const removeRows = (rows: number[]) => {
    if (!rows) return;

    rows.forEach((y) => {
      for (let i = 0; i < boardWidth; i++) {
        const id = pixelRefs.current[`${i}-${y}`].id;

        if (!id) return;
        const letter = getLetter(id);

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
    let rowsToRemove: null | number[];

    reformattedRefs().forEach((row, index) => {
      if (row.every((pixel) => pixel.id)) {
        if (!rowsToRemove) rowsToRemove = [];
        rowsToRemove.push(index);
      }
    });

    //@ts-expect-error faulty error
    return rowsToRemove;
  };

  const makeNewTetromino = () => {
    if (
      (focalPointRef.current[0] === 3 &&
        focalPointRef.current[1] === 0 &&
        currentTetromino) ||
      isMovePossible('down')
    )
      return;

    const tetromino = randomTetromino();
    setTetromino(tetromino);

    focalPointRef.current = [3, 0];
    updateCurrentTetromino('add', tetromino);
  };

  const rotateTetromino = () => {
    if (!currentTetromino) return;

    const rotated = {
      ...currentTetromino,
      shape: rotateShapeClockwise(currentTetromino.shape),
    };

    if (isMovePossible('down', rotated)) {
      updateCurrentTetromino('remove');
      setTetromino(rotated);
      updateCurrentTetromino('add', rotated);
    }
  };

  //this moves the piece downwards automatically on a constant interval
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentTetromino && !gameOver)
        moveTetromino('down');
    }, 700);
    return () => clearInterval(interval);
  });

  const pauseGame = () => {
    setGameOver(!gameOver);
  };

  const handleKeyPress = (key: string) => {
    const direction = key
      .replace('Arrow', '')
      .toLowerCase() as Direction;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (isMovePossible(direction))
          moveTetromino(direction);
        return;
      case 'Enter':
        makeNewTetromino();
        return;
      case 'Shift':
        rotateTetromino();
        return;
      default:
        return;
    }
  };

  const consoleLogData = () => {
    console.log('currentTetromino:', currentTetromino);
    console.log('pixelrefs:', pixelRefs.current);
  };

  return (
    <main onKeyDown={(event) => handleKeyPress(event.key)}>
      <div className='score-board'>{score}</div>
      <Grid
        setPixelRef={setPixelRef}
        width={boardWidth}
        height={boardHeight}
        ref={pixelRefs}
      />

      <ControlPanel
        makeNewTetromino={makeNewTetromino}
        consoleLogData={consoleLogData}
        pauseGame={pauseGame}
      />
    </main>
  );
};
