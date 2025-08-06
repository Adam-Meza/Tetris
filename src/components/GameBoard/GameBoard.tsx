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
  makeNewCoordinates,
} from '../../utilities';

/**
 * Tetris GameBoard Component -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  console.log('Gamnboard Render');
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

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
   * Mutable ref object that will be used as the point of truth for game state logic.
   */
  const pixelRefs = React.useRef<{
    [key: string]: PixelType;
  }>({});

  /**
   * Sets the individual pixel ref objects and is responsible for effecting change on the DOM.
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
              const letter = id ? getLetter(id) : undefined;

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
  ): boolean => {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        let x = j;
        let y = i;

        const square = pixelRefs?.current[`${x}-${y}`];

        [x, y] = makeNewCoordinates(x, y, direction);

        const nextSquare = pixelRefs?.current[`${x}-${y}`];

        if (square.id === current?.id)
          if (
            !nextSquare ||
            (nextSquare.id && square.id !== nextSquare.id)
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
      [x, y] = makeNewCoordinates(x, y, direction);

      updateCurrentTetromino('remove');
      focalPointRef.current = [x, y];
      updateCurrentTetromino('add');

      if (!isMovePossible('down')) {
        handleBlockLanding();
      }
    }
  };

  const moveRowsDown = (rows: number[]) => {
    const pixelsInRows = reformattedRefs().reverse();

    pixelsInRows.forEach((row) => {
      row.forEach((pixel) => {
        if (pixel.y < rows[0]) {
          const { x, y, id } = pixel;
          const letter = id ? getLetter(id) : undefined;

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

  const handleBlockLanding = () => {
    setTimeout(() => {
      if (!currentTetromino) return;

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
    }, 80);
  };

  const removeRows = (rows: number[]) => {
    if (!rows) return;

    rows.forEach((y) => {
      for (let i = 0; i < BOARD_WIDTH; i++) {
        const x = i;
        const id = pixelRefs.current[`${x}-${y}`].id;

        if (!id) return;
        const letter = getLetter(id);

        addOrRemovePixel(x, y, 'remove', letter);
      }
    });
  };

  const reformattedRefs = () => {
    const pixelsInRows = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const row = [];

      for (let j = 0; j < BOARD_WIDTH; j++) {
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

  const makeNewTetromino = (override?: boolean) => {
    let current;

    if (!override) current = currentTetromino;

    if (current) {
      const [x, y] = focalPointRef.current;

      if (
        (x === 3 && y === 0) ||
        isMovePossible('down', current)
      )
        return;
      if (current.shape.length + y <= 3) {
        setGameOverState(true);
        return;
      }
    }

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

    const tetrominoLength = rotated.shape[0].length;

    if (
      tetrominoLength + focalPointRef.current[0] <=
        BOARD_WIDTH &&
      isMovePossible('same', rotated)
    ) {
      updateCurrentTetromino('remove');
      setTetromino(rotated);
      updateCurrentTetromino('add', rotated);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentTetromino && !gameOver)
        moveTetromino('down');
    }, 700);

    return () => clearInterval(interval);
  });

  const setGameOverState = (state: boolean) => {
    setGameOver(state);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    const { key, repeat } = e;
    const [x, y] = focalPointRef.current;

    let direction;

    if ((repeat && x === 3 && y === 0) || gameOver) return;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        direction = key
          .replace('Arrow', '')
          .toLowerCase() as Direction;
        moveTetromino(direction);
        return;
      case 'Enter':
        makeNewTetromino();
        return;
      case 'Shift':
        rotateTetromino();
        return;
    }
  };

  const consoleLogData = () => {
    console.log('currentTetromino:', currentTetromino);
    console.log('pixelrefs:', pixelRefs.current);
    console.log('gameOver', gameOver);
  };

  const clearBoard = () => {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        const id = pixelRefs.current[`${j}-${i}`].id;

        if (id) {
          const letter = getLetter(id);
          addOrRemovePixel(j, i, 'remove', letter, id);
        }
      }
    }
  };

  const startNewGame = () => {
    setTetromino(undefined);
    clearBoard();
    setGameOver(false);
    makeNewTetromino(true);
  };

  return (
    <main onKeyDown={(event) => handleKeyPress(event)}>
      <div className='score-board'>{`${gameOver}`}</div>
      <Grid
        setPixelRef={setPixelRef}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        ref={pixelRefs}
      />

      <ControlPanel
        startNewGame={startNewGame}
        consoleLogData={consoleLogData}
        setGameOverState={setGameOverState}
      />
    </main>
  );
};
