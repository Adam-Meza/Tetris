import React from 'react';
import * as Jotai from 'jotai';
import { Grid } from '../../grid/Grid';
import { GameModal } from '../Modal/Modal';
import { TetrominoType } from '../Tetromino/Tetromino';
import { PixelType } from '../../grid/Pixel';
import {
  randomTetromino,
  calculateScore,
  rotateShapeClockwise,
  getLetter,
} from '../../utilities';
import {
  scoreAtom,
  gameOverAtom,
  currentTetrominoAtom,
  nextTetrominoAtom,
  lineCountAtom,
} from '../../atoms';
import { makeRefMatrix } from '../../grid/utilities';
import TopDisplay from '../TopDisplay/TopDisplay';
import {
  CallbackPayload,
  Coord,
  Direction,
} from '../../grid/GameManagerTypes';
import { GameManager } from '../../grid/GameManager';

/**
 * Tetris GameBoard Component -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  // console.log('Gameboard Render');
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const mainRef = React.useRef<HTMLElement | null>(null);

  const [currentTetromino, setTetromino] = Jotai.useAtom(
    currentTetrominoAtom
  );

  const [score, setScore] = Jotai.useAtom(scoreAtom);
  const [next, setNext] = Jotai.useAtom(nextTetrominoAtom);

  const [gameOver, setGameOver] =
    Jotai.useAtom(gameOverAtom);
  const [lineCount, setCount] =
    Jotai.useAtom(lineCountAtom);

  /**
   * Focal point determining the coordinates on the Grid that pieces are placed/oriented with.
   */
  const focalPointRef = React.useRef<Coord>([3, 0]);

  /**
   * Mutable ref object that will be used as the point of truth for game state logic.
   */
  const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix([BOARD_WIDTH, BOARD_HEIGHT])
  );

  /**
   * GameManager in charge of manipulating DOM
   */
  const gm = new GameManager(pixelRefs, focalPointRef);
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

  const didBlockLand = (args: CallbackPayload) => {
    const { piece, focalPoint, pixelRefs } = args;
    const tetrominoHeight = piece.shape.length;
    const tetrominoWidth = piece.shape[0].length;

    for (let i = 0; i < tetrominoHeight; i++) {
      for (let j = 0; j < tetrominoWidth; j++) {
        const x = j + focalPoint.current[0];
        const y = i + focalPoint.current[1];

        const [, lowerY] = gm.offsetCoord(
          [x, y],
          'down',
          1
        );

        if (lowerY >= BOARD_HEIGHT)
          return handleBlockLanding();

        const currentSquare = pixelRefs.current[y][x];

        const nextSquare = pixelRefs.current[lowerY][x];

        if (!runCheck(currentSquare, nextSquare, piece))
          handleBlockLanding();
      }
    }

    return false;
  };

  const isMovePossible = (
    direction: Direction,
    piece: TetrominoType,
    focalPoint = focalPointRef
  ): boolean => {
    const tetrominoHeight = piece.shape.length;
    const tetrominoWidth = piece.shape[0].length;

    for (let i = 0; i < tetrominoHeight; i++) {
      for (let j = 0; j < tetrominoWidth; j++) {
        const x = j + focalPoint.current[0];
        const y = i + focalPoint.current[1];
        const [targetX, targetY] = gm.offsetCoord(
          [x, y],
          direction,
          1
        );

        if (
          targetX >= BOARD_WIDTH ||
          targetY >= BOARD_HEIGHT
        )
          return false;

        const currentSquare = pixelRefs.current[y][x];

        const nextSquare =
          pixelRefs.current[targetY][targetX];

        if (!runCheck(currentSquare, nextSquare, piece)) {
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

    const focalPoint = [
      focalPointRef.current[0],
      focalPointRef.current[1],
    ] as Coord;

    const args = {
      piece: currentTetromino,
      direction: direction,
      distance: 1,
      focalPoint: focalPoint,
      onAfter: didBlockLand,
    };

    if (isMovePossible(direction, currentTetromino)) {
      gm.playerMove(args);
    }
  };

  const moveRowsDown = () => {
    // check every row...
    for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
      const row = pixelRefs.current[i];

      //if that row is empty...
      if (row.every((pixel) => pixel?.id === undefined)) {
        // check all the rows above it...
        for (let j = i; j >= 0; j--) {
          const newRow = pixelRefs.current[j];
          //if any of the squares are occupied...
          if (
            newRow.some((pixel) => pixel?.id !== undefined)
          ) {
            //iterate (again) through that row...
            newRow.forEach((pixel) => {
              if (!pixel?.id) return;

              const { x, id } = pixel;
              const letter = getLetter(id);
              const className = `${letter}-block`;

              gm.removePixel(pixel, className);
              gm.addPixel(id, className, [x, i]);
            });

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
        const pixel = pixelRefs.current[y][x];

        if (!pixel || !pixel.id) return;
        const letter = getLetter(pixel.id);
        const className = `${letter}-block`;

        gm.removePixel(pixel, className);
      }
    });
  };

  const findCompletedRows = (): number[] | null => {
    let rowsToRemove = [] as number[];

    pixelRefs.current.forEach((row, index) => {
      if (row.every((pixel) => pixel?.id)) {
        if (!rowsToRemove) rowsToRemove = [];
        rowsToRemove.push(index);
      }
    });

    return rowsToRemove;
  };

  const makeNewTetromino = () => {
    const current = currentTetromino;
    const [, y] = focalPointRef.current;

    if (isMovePossible('down', current) && gameOver) return;
    else if (current.shape.length + y <= 3) {
      setGameOver(true);
      return;
    }

    const tetromino = randomTetromino();

    setNext(tetromino);
    setTetromino(next);
    focalPointRef.current = [3, 0];

    if (!isMovePossible('same', next)) {
      setGameOver(true);
      return;
    }

    gm.put({ piece: next, focalPoint: [3, 0] });
  };

  // could be GameManager.rotate();
  // would need piece,
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
      const [x, y] = focalPointRef.current;

      gm.delete({
        piece: currentTetromino,
        focalPoint: [x, y],
      });

      setTetromino(rotated);

      gm.put({ piece: rotated, focalPoint: [x, y] });
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentTetromino && !gameOver)
        moveTetromino('down');
    }, 700);

    return () => clearInterval(interval);
  });

  React.useCallback(() => {
    mainRef.current?.focus();
  }, []);

  const handleKeyPress = (
    ev: React.KeyboardEvent<HTMLElement>
  ) => {
    const { key, repeat } = ev;
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

  // const consoleLogData = () => {
  //   console.log('currentTetromino:', currentTetromino);
  //   console.log('pixelrefs:', pixelRefs.current);
  //   console.log('gameOver', gameOver);
  //   console.log('focal point', focalPointRef.current);
  // };

  const startNewGame = () => {
    setGameOver(true);
    setGameOver(false);
    setScore(0);
    setCount(0);
    makeNewTetromino();

    requestAnimationFrame(() => mainRef.current?.focus());
  };

  return (
    <main
      tabIndex={0}
      onKeyDown={(event) => handleKeyPress(event)}
      ref={mainRef}
    >
      <GameModal startNewGame={startNewGame} />

      <section className='gameboard-wrapper'>
        <TopDisplay />
        <div className='grid-wrapper' id='gameboard'>
          <Grid
            setPixelRef={setPixelRef}
            dimensions={[BOARD_WIDTH, BOARD_HEIGHT]}
            baseClass={'tetromino'}
            // handleKeyPress={handleKeyPress}
          />
        </div>
      </section>
    </main>
  );
};
