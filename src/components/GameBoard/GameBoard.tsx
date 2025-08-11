import React from 'react';
import { Grid } from '../../grid/Grid';
import { TetrominoType } from '../Tetromino/Tetromino';
import { Pixel, PixelType } from '../../grid/Pixel';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import {
  randomTetromino,
  Direction,
  calculateScore,
  rotateShapeClockwise,
  getLetter,
  makeNewCoordinates,
} from '../../utilities';
import { useAtom } from 'jotai';
import {
  scoreAtom,
  gameOverAtom,
  currentTetrominoAtom,
  nextTetrominoAtom,
} from '../../atoms';
import Info from '../Info/Info';
import ScoreBoard from './ScoreBoard';
import { NextTetromino } from '../NextTetromino/NextTetromino';

/**
 * Tetris GameBoard Component -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  // console.log('Gameboard Render');
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const [currentTetromino, setTetromino] = useAtom(
    currentTetrominoAtom
  );
  const [gameOver, setGameOver] = useAtom(gameOverAtom);
  const [score, setScore] = useAtom(scoreAtom);
  const [next, setNext] = useAtom(nextTetrominoAtom);

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

  // const pixelRefs = buildRefs()

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

    const spanRef = dataRef.html;

    if (!spanRef?.current) return false;

    if (action === 'add') {
      spanRef.current.classList.add(`${letter}-block`);
      setPixelRef({
        x,
        y,
        id: id,
        html: spanRef,
      });
    } else if (action === 'remove') {
      spanRef.current.classList.remove(`${letter}-block`);
      setPixelRef({
        x,
        y,
        id: undefined,
      });
    }
  };

  // CONVERT THIS TO UPDATE OBJECT
  // BE ABLE TO TAKE IN AN OBJECT
  // AND A FOCAL POINT
  // and move that objec to the focal point
  const updateCurrentTetromino = (
    action: 'add' | 'remove',
    tetromino = currentTetromino
  ) => {
    tetromino.shape?.forEach(
      (row: (string | null)[], rowIndex: number) => {
        row.forEach(
          (cell: string | null, colIndex: number) => {
            // some parts of the shape will be null,
            // this ensures we are only updating
            // DOM and data model for filled squares
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

    if (!isMovePossible('down', tetromino))
      handleBlockLanding();
  };

  const isMovePossible = (
    direction: Direction,
    tetromino = currentTetromino,
    focalPoint = focalPointRef
  ): boolean => {
    const tetrominoHeight = tetromino.shape.length;
    const tetrominoWidth = tetromino.shape[0].length;

    for (let i = 0; i < tetrominoHeight; i++) {
      for (let j = 0; j < tetrominoWidth; j++) {
        const x = j + focalPoint.current[0];
        const y = i + focalPoint.current[1];
        const [targetX, targetY] = makeNewCoordinates(
          x,
          y,
          direction
        );

        const currentSquare =
          pixelRefs?.current[`${x}-${y}`];

        const nextSquare =
          pixelRefs?.current[`${targetX}-${targetY}`];

        if (!runCheck(currentSquare, nextSquare, tetromino))
          return false;
      }
    }
    return true;
  };

  const runCheck = (
    currentSquare: PixelType,
    nextSquare: PixelType,
    tetromino: TetrominoType
  ) => {
    //If the next sqaure doesn't exist, move is not possible
    //return false.
    if (!nextSquare) return false;
    // The following code will only check if the nextSqaure is occupied
    if (nextSquare.id) {
      if (
        //first we check if the current square is occupied
        // i.e. parts of each tetromino will have blank spaces
        // that do not carry and ID
        // if thats true, we make sure the
        (currentSquare.id === tetromino.id &&
          nextSquare.id !== currentSquare.id) ||
        // given that the nextSquare has an id,
        // if the tetromino in question is not the current
        // then we check if nextSquare is occupied by anooter piece
        // based on the given tetromino NOT the current pixelRef
        (tetromino !== currentTetromino &&
          nextSquare.id !== tetromino.id)
      )
        return false;
    }

    // if none of the falsifying conditions are met
    // move is possible, return true
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
    // setTimeout(() => {
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
    // }, 80);
  };

  //
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

  // delete once update DM
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

  const makeNewTetromino = () => {
    const current = currentTetromino;
    const [x, y] = focalPointRef.current;

    if (isMovePossible('down', current) && gameOver) return;
    else if (current.shape.length + y <= 3) {
      setGameOver(true);
      return;
    }

    const tetromino = randomTetromino();

    setNext(tetromino);
    setTetromino(next);

    if (
      !isMovePossible('same', next, {
        current: [3, 0],
      })
    ) {
      setGameOver(true);
      return;
    }

    // could be place();
    focalPointRef.current = [3, 0];
    updateCurrentTetromino('add', next);
  };

  // could be GameManager.rotate();
  const rotateTetromino = () => {
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
      // this can be changed to movePiece(refs, object, focalpoint, {direction: })

      //??/
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
      case 'Shift':
        rotateTetromino();
        return;
    }
  };

  const consoleLogData = () => {
    console.log('currentTetromino:', currentTetromino);
    console.log('pixelrefs:', pixelRefs.current);
    console.log('gameOver', gameOver);
    console.log('focal point', focalPointRef.current);
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
    setGameOver(true);
    clearBoard();
    setGameOver(false);
    makeNewTetromino();
  };

  return (
    <main
      tabIndex={0}
      onKeyDown={(event) => handleKeyPress(event)}
    >
      <Info startNewGame={startNewGame} />
      <section className='gameboard-wrapper'>
        <ControlPanel
          consoleLogData={consoleLogData}
          setGameOver={setGameOver}
        />
        <div className='top-display'>
          <ScoreBoard />
          <NextTetromino />
        </div>

        <div className='grid-wrapper' id='gameboard'>
          <Grid
            setPixelRef={setPixelRef}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            baseClass={'tetromino'}
          />
        </div>
      </section>
    </main>
  );
};
