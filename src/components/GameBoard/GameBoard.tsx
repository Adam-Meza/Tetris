import React from 'react';
import { Grid } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';

/**
 * Tetris GameBoardComponent
 *
 * Handles almost all the logic for game playin including:
 *
 * creating Tetrominos
 * moving, placing, and deleting them
 */
export const GameBoard = () => {
  console.log('GameBoard render');

  const boardHeight = 20;
  const boardWidth = 10;
  const focalPointRef = React.useRef<number[]>([3, 0]);
  const [currentPiece, setPiece] =
    React.useState<TetrominoType>();

  /**
   * This is a mutable ref that will be used as the point of truth for game state logic
   */
  const pixelRefs = React.useRef<{
    [key: string]: React.RefObject<HTMLSpanElement>;
  }>({});

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
   *
   * @param x - x coordinate of the pixel
   * @param y - y coordinate of the pixel
   * @param ref
   */
  const setPixelRef = (
    x: number,
    y: number,
    ref: React.RefObject<HTMLSpanElement>
  ) => {
    pixelRefs.current[`${x}-${y}`] = ref;
  };

  const handleClassChange = (
    colIndex: number,
    rowIndex: number,
    action: 'add' | 'remove',
    tetromino: TetrominoType
  ) => {
    //Locates the desired new position
    //based on current focal point and the index of the pixel relative to the tetromino shape
    const x = focalPointRef.current[0] + colIndex;
    const y = focalPointRef.current[1] + rowIndex;

    const pixelRef = pixelRefs.current[`${x}-${y}`];
    const { letter, id } = tetromino;

    if (pixelRef?.current) {
      if (action === 'add') {
        pixelRef.current.setAttribute(
          'data-occupied',
          'true'
        );
        pixelRef.current.setAttribute('data-id', `${id}`);

        pixelRef.current.classList.add(`${letter}-block`);
      } else {
        pixelRef.current.removeAttribute('data-occupied');
        pixelRef.current.removeAttribute('data-id');

        pixelRef.current.classList.remove(
          `${letter}-block`
        );
      }
    }
  };

  const AddOrRemoveTetromino = (
    tetromino = currentPiece,
    action: 'add' | 'remove'
  ) => {
    tetromino?.shape.forEach(
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

  const moveTetromino = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (currentPiece) {
      let [x, y] = focalPointRef.current;
      const lowestYValue = y + currentPiece.shape.length;
      const nextSquare =
        pixelRefs.current[`${x}-${lowestYValue + 1}`]
          ?.current?.attributes[1];

      const nextId =
        pixelRefs.current[`${x}-${lowestYValue + 1}`]
          ?.current?.attributes[2];

      console.log(
        'x',
        x,
        'y;',
        y,
        'lowest',
        lowestYValue,
        'occupied',
        nextSquare,
        nextId
      );

      // console.log(
      //   pixelRefs?.current[`${x}-${y}`]?.current?.attributes
      // );

      // Determines the changes in focal point desired
      // based on direction argument and board state
      switch (direction) {
        case 'down':
          y += 1;
          break;
        case 'left':
          if (x > 0) x -= 1;
          break;
        case 'right':
          if (x + currentPiece.shape[0].length < boardWidth)
            x += 1;
          break;
      }

      AddOrRemoveTetromino(currentPiece, 'remove');
      focalPointRef.current = [x, y];
      AddOrRemoveTetromino(currentPiece, 'add');

      if (
        lowestYValue + 1 >= boardHeight ||
        !!pixelRefs.current[`${x}-${lowestYValue + 1}`]
          ?.current?.attributes[1]
      ) {
        makeNewPiece();
        return;
      }
    }
  };

  const makeNewPiece = () => {
    const newPiece = pickRandomPiece();
    setPiece(newPiece);

    focalPointRef.current = [3, 0];
    AddOrRemoveTetromino(newPiece, 'add');
  };

  // React.useEffect(() => {
  //   if (currentPiece) {
  //     const interval = setInterval(() => {
  //       moveTetromino('down');
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [currentPiece]);

  // React.useEffect(() => {});

  return (
    <div>
      <Grid
        setPixelRef={setPixelRef}
        width={boardWidth}
        height={boardHeight}
        ref={pixelRefs}
      />
      <button
        onClick={() => {
          makeNewPiece();
        }}
      >
        Place Block
      </button>
      {['down', 'left', 'right'].map((direction) => (
        <button
          key={direction}
          onClick={() => {
            moveTetromino(direction);
          }}
        >
          {direction}
        </button>
      ))}
    </div>
  );
};
