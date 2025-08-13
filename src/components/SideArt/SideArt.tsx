import React from 'react';
import { Grid } from '../../grid/Grid';
import { TetrominoType } from '../Tetromino/Tetromino';
import { PixelType } from '../../grid/Pixel';
import {
  randomTetromino,
  rotateShapeClockwise,
} from '../../utilities';
import * as Jotai from 'jotai';
import {
  currentTetrominoAtom,
  nextTetrominoAtom,
} from '../../atoms';
import { makeRefMatrix } from '../../grid/utilities';
import { GameManager } from '../../grid/GameManager';
import { Direction } from '../../grid/GameManagerTypes';

/**
 * Tetris GameBoard Component -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const SideArt = () => {
  // console.log('Gameboard Render');
  const BOARD_WIDTH = 20;
  const BOARD_HEIGHT = 40;
  const [blockStyle, setBlockStyle] = React.useState('t');

  const [currentTetromino, setTetromino] = Jotai.useAtom(
    currentTetrominoAtom
  );

  const [next, setNext] = Jotai.useAtom(nextTetrominoAtom);

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
    ];

    const args = {
      piece: currentTetromino,
      direction: direction,
      distance: 1,
      focalPoint: focalPoint,
    };

    if (isMovePossible(direction, currentTetromino)) {
      gm.playerMove(args);
    }
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

  const makeNewTetromino = (styleKey?: string) => {
    const style = styleKey || blockStyle;
    const tetromino = randomTetromino();
    tetromino.className = `${style}-block`;
    next.className = `${style}-block`;

    setNext(tetromino);
    setTetromino(next);
    focalPointRef.current = [3, 0];

    gm.put({ piece: next, focalPoint: [3, 0] });
  };

  const changeStyle = (letter: string) => {
    const [x, y] = focalPointRef.current;

    const newTetromino = {
      className: `${letter}-block`,
      id: currentTetromino.id,
      letter: letter,
      shape: currentTetromino.shape,
    };

    gm.delete({
      piece: currentTetromino,
      focalPoint: [x, y],
    });

    setBlockStyle(letter);
    setTetromino(newTetromino);

    gm.put({
      piece: newTetromino,
      focalPoint: [x, y],
    });
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    const { key, repeat } = e;
    const [x, y] = focalPointRef.current;

    if (repeat && x === 3 && y === 0) return;
    console.log(key);
    switch (key) {
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
        let direction = key
          .replace('Arrow', '')
          .toLowerCase() as Direction;
        moveTetromino(direction);
        return;
      case 'Shift':
        rotateTetromino();
        return;
      case 's':
      case 'l':
      case 'z':
      case 'o':
      case 'i':
      case 't':
      case 'j':
        changeStyle(key);
        return;
      case 'Enter':
        makeNewTetromino();
        return;
    }
  };

  return (
    <main
      tabIndex={0}
      onKeyDown={(event) => handleKeyPress(event)}
    >
      <section className='gameboard-wrapper'>
        <div className='grid-wrapper' id='sideart'>
          <Grid
            setPixelRef={setPixelRef}
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            baseClass={'tetromino'}
          />
        </div>
      </section>
      j = blue <br />
      l = red <br />
      o = yellow <br />
      i = light blue <br />
      t = purple <br />
      s = green <br />
      z = pink <br />
    </main>
  );
};
