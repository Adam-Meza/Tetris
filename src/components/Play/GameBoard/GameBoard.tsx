import React from 'react';
import * as Jotai from 'jotai';
import { Grid } from '../../../grid/Grid';
import { TetrominoType } from './Tetromino/Tetromino';
import { PixelType } from '../../../grid/Pixel';
import { GameManager } from '../../../grid/GameManager';
import { LeaderBoard } from '../LeaderBoard/LeaderBoard';
import { makeRefMatrix } from '../../../grid/utilities';
import TopDisplay from './TopDisplay/TopDisplay';
import GameOverModal from '../GameOverModal';
import GamePauseModal from '../GamePauseModal';
import Info from './Info/Info';
import {
  randomTetromino,
  calculateScore,
  rotateShapeClockwise,
  getLetter,
} from './utilities';
import {
  scoreAtom,
  gameOverAtom,
  currentTetrominoAtom,
  nextTetrominoAtom,
  lineCountAtom,
  gamePauseAtom,
} from '../../../atoms';
import {
  CallbackPayload,
  Coord,
  Direction,
} from '../../../grid/GameManagerTypes';

/**
 * Tetris GameBoard Component -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  console.log('Gameboard Render');
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const mainRef = React.useRef<HTMLElement | null>(null);
  const [gamePause, setGamePause] =
    Jotai.useAtom(gamePauseAtom);

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
   *
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
  const gm = React.useMemo(
    () => new GameManager(pixelRefs, focalPointRef),
    []
  );

  /**
   * Sets the individual pixel ref objects and is responsible for effecting change on the DOM.
   */
  const setPixelRef = (pixel: PixelType) => {
    const { x, y } = pixel;
    pixelRefs.current[y][x] = pixel;
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
          return handleBlockLanding(args);

        const currentSquare = pixelRefs.current[y][x];

        const nextSquare = pixelRefs.current[lowerY][x];

        if (
          isNextSquareOccupied(
            currentSquare,
            nextSquare,
            piece
          )
        )
          handleBlockLanding(args);
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

        if (
          isNextSquareOccupied(
            currentSquare,
            nextSquare,
            piece
          )
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const isNextSquareOccupied = (
    currentSquare: PixelType | null,
    nextSquare: PixelType | null,
    tetromino: TetrominoType
  ) => {
    if (!nextSquare) return false;

    if (nextSquare.id) {
      if (
        // is the currentSquare ID part of the piece we're moving?
        (currentSquare?.id === tetromino.id &&
          // if so, if the next square is occupied by a different piece..
          nextSquare.id !== currentSquare?.id) ||
        // or if we're checking for a new/rotating piece
        (tetromino !== currentTetromino &&
          // check based on the theoratical piece
          nextSquare.id !== tetromino.id)
      )
        return true;
    }

    return false;
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
      conditional: (args: CallbackPayload) => {
        const { direction, piece } = args;

        if (
          (direction &&
            !isMovePossible(direction, piece)) ||
          gamePause
        )
          return false;

        return true;
      },
    };

    gm.playerMove(args);
  };

  const moveRowsDown = (args: CallbackPayload) => {
    const { pixelRefs } = args;
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

              gm.removePixel(pixel);
              gm.addPixel(id, className, [x, i]);
            });

            break;
          }
        }
      }
    }
  };

  const handleBlockLanding = (args: CallbackPayload) => {
    // setTimeout(() => {
    const completedRowIndexes = findCompletedRows(args);

    if (completedRowIndexes) {
      removeRows(completedRowIndexes);
      moveRowsDown(args);

      const newScore = calculateScore(
        completedRowIndexes.length,
        score
      );

      setCount(lineCount + completedRowIndexes.length);
      setScore(newScore);
    }

    makeNewTetromino();
  };

  const removeRows = (rows: number[]) => {
    if (!rows) return;

    rows.forEach((y) => {
      for (let i = 0; i < BOARD_WIDTH; i++) {
        const x = i;
        const pixel = pixelRefs.current[y][x];

        if (!pixel || !pixel.id) return;

        gm.removePixel(pixel);
      }
    });
  };

  const findCompletedRows = (
    args: CallbackPayload
  ): number[] | null => {
    let rowsToRemove = [] as number[];
    const { pixelRefs } = args;

    pixelRefs.current.forEach((row, index) => {
      if (row.every((pixel) => pixel?.id)) {
        if (!rowsToRemove) rowsToRemove = [];
        rowsToRemove.push(index);
      }
    });

    return rowsToRemove;
  };

  const makeNewTetromino = () => {
    const promoted = next ?? randomTetromino();

    setTetromino(promoted);
    focalPointRef.current = [3, 0];

    gm.put({
      // What are we placing?
      piece: promoted,
      // Where are we placing it?
      focalPoint: [3, 0],
      // Before we place the piece,
      // Let's check if we can...
      conditional: (args: CallbackPayload) => {
        if (!isMovePossible('same', next)) {
          setGameOver(true);
          return false;
        }

        return true;
      },
      // and once we place it, we ask,
      // can we go anywhere?
      onAfter: () => {
        if (!isMovePossible('down', next)) {
          setGameOver(true);
        }
      },
    });

    const queued = randomTetromino();
    setNext(queued);
  };

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

  const startNewGame = () => {
    setGamePause(false);
    setGameOver(false);
    makeNewTetromino();
    requestAnimationFrame(() => mainRef.current?.focus());
  };

  const endGame = () => {
    gm.clearBoard();
    setGameOver(true);
    setScore(0);
    setCount(0);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      mainRef.current?.focus();
      if (currentTetromino && !gameOver)
        moveTetromino('down');
    }, 700);

    return () => clearInterval(interval);
  });

  //LOOK INTO CHANGING THIS USEFEFFECT TO SOMETHING ELSE
  React.useEffect(() => {
    endGame();
    startNewGame();
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
      case 'n':
        endGame();
        startNewGame();
        return;
      case 'Enter':
        setGamePause(!gamePause);
        return;
    }
  };

  return (
    <main
      tabIndex={0}
      onKeyDown={(event) => handleKeyPress(event)}
      ref={mainRef}
    >
      <Info />
      <section className='gameboard-wrapper'>
        <TopDisplay />

        <div className='grid-wrapper' id='gameboard'>
          <Grid
            setPixelRef={setPixelRef}
            dimensions={[BOARD_WIDTH, BOARD_HEIGHT]}
            baseClass={'tetromino'}
          />
        </div>
      </section>

      <LeaderBoard />
      <GameOverModal
        startNewGame={startNewGame}
        endGame={endGame}
      />
      <GamePauseModal />
    </main>
  );
};
