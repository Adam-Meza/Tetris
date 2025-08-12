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
  lineCountAtom,
} from '../../atoms';
import Info from '../Info/Info';
import {
  makeRefMatrix,
  addOrRemovePixel,
  clearBoard,
} from '../../grid/utilities';
import TopDisplay from '../TopDisplay/TopDisplay';

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
  const [lineCount, setCount] = useAtom(lineCountAtom);

  /**
   * Focal point determining the coordinates on the Grid that pieces are placed/oriented with.
   */
  const focalPointRef = React.useRef<[number, number]>([
    3, 0,
  ]);

  /**
   * Mutable ref object that will be used as the point of truth for game state logic.
   */
  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix(BOARD_HEIGHT, BOARD_WIDTH)
  );

  // const pixelRefs = buildRefs()

  /**
   * Sets the individual pixel ref objects and is responsible for effecting change on the DOM.
   */

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
              const className = `${letter}-block`;

              addOrRemovePixel(
                pixelRefs,
                [x, y],
                action,
                className,
                id
              );
            }
          }
        );
      }
    );

    if (!isMovePossible('down', tetromino))
      handleBlockLanding();
  };

  // this might be hard to abstract out as different games have different needs
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

        if (
          targetX >= BOARD_WIDTH ||
          targetY >= BOARD_HEIGHT
        )
          return false;

        const currentSquare = pixelRefs.current[y][x];

        const nextSquare =
          pixelRefs.current[targetY][targetX];

        if (
          !runCheck(currentSquare, nextSquare, tetromino)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const runCheck = (
    currentSquare: PixelType | null,
    nextSquare: PixelType | null,
    tetromino: TetrominoType
  ) => {
    if (!nextSquare) return false;
    // The following code will only check if the nextSqaure is occupied
    if (nextSquare.id) {
      if (
        //first we check if the current square is occupied
        // i.e. parts of each tetromino will have blank spaces
        // that do not carry and ID
        // if thats true, we make sure the
        (currentSquare?.id === tetromino.id &&
          nextSquare.id !== currentSquare?.id) ||
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

  const moveRowsDown = () => {
    // check every row...
    for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
      const row = pixelRefs.current[i];

      //if that row is empty
      if (row.every((pixel) => pixel?.id === undefined)) {
        // check all the rows above it..
        for (let j = i; j >= 0; j--) {
          const newRow = pixelRefs.current[j];

          //if any of the square are occupied...
          if (
            newRow.some((pixel) => pixel?.id !== undefined)
          ) {
            //iterate (again) through that row...
            newRow.forEach((pixel) => {
              // if the pixel doesn't exist, return.

              if (!pixel?.id) return;

              const { x, y, id } = pixel;
              const letter = getLetter(id);
              const className = `${letter}-block`;

              // store the value of the difference between those two rows
              const difference = i - j;

              // then calculate the new y value based on the difference.
              const targetY = y + difference;

              // THHIS ACTIOM OF REMOVING AN MATRIX AND THEN ADDING IT BACK SHOULD BE REUSABLE
              // UPDATECURREMNT SHOILD JUST BE MOVE(OBJECT, DIRECTION, DIRECTION: number)
              addOrRemovePixel(
                pixelRefs,
                [x, y],
                'remove',
                className
              );

              addOrRemovePixel(
                pixelRefs,
                [x, targetY],
                'add',
                className,
                id
              );
            });

            //break so we don move everyrow above it, go back
            // to checking for empty rows, theres gonna be at least one.
            break;
          }
        }
      }
    }
  };

  const handleBlockLanding = () => {
    // setTimeout(() => {
    const completedRowIndexes = findCompletedRows();

    if (completedRowIndexes) {
      removeRows(completedRowIndexes);
      moveRowsDown();

      const newScore = calculateScore(
        completedRowIndexes.length,
        score
      );

      setCount(lineCount + completedRowIndexes.length);
      setScore(newScore);
    }

    makeNewTetromino();
    // }, 80);
  };

  const removeRows = (rows: number[]) => {
    if (!rows) return;

    rows.forEach((y) => {
      for (let i = 0; i < BOARD_WIDTH; i++) {
        const x = i;
        const id = pixelRefs.current[y][x]?.id;

        if (!id) return;
        const letter = getLetter(id);
        const className = `${letter}-block`;

        addOrRemovePixel(
          pixelRefs,
          [x, y],
          'remove',
          className
        );
      }
    });
  };

  const findCompletedRows = (): number[] | null => {
    let rowsToRemove: number[];

    pixelRefs.current.forEach((row, index) => {
      if (row.every((pixel) => pixel?.id)) {
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

  const startNewGame = () => {
    setGameOver(true);
    clearBoard(pixelRefs);
    setGameOver(false);
    setScore(0);
    setCount(0);
    makeNewTetromino();
  };

  return (
    <main
      tabIndex={0}
      onKeyDown={(event) => handleKeyPress(event)}
    >
      <Info startNewGame={startNewGame} />

      <section className='gameboard-wrapper'>
        <TopDisplay />
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
