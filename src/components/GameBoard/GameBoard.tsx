import React from 'react';
import { Grid } from '../../grid/Grid';
import { Tetromino } from '../Tetromino/Tetromino';
import { blocks } from '../Tetromino/block';
/**
 * Tetris GameBoardComponent
 *
 * Handles almost all the logic for game playin including:
 *
 * creating Tetrominos
 * moving, placing, and deleting them
 */
export const GameBoard = () => {
  // console.log('GameBoard render');

  const boardHeight = 20;
  const boardWidth = 10;
  const [currentPiece, setPiece] =
    React.useState<Tetromino>();

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
    [key: string]: React.RefObject<HTMLSpanElement>;
  }>({});

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
    tetromino: Tetromino
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
      (row: Tetromino[], rowIndex: number) => {
        row.forEach((cell: Tetromino, colIndex: number) => {
          if (cell) {
            handleClassChange(
              colIndex,
              rowIndex,
              action,
              tetromino
            );
          }
        });
      }
    );
  };

  const getNextSqaureData = (
    currentPoint: [number, number]
  ) => {
    const [x, y] = currentPoint;
    const yValue = y + currentPiece?.shape?.length + 1;
    const nextSquare = pixelRefs.current[`${x}-${yValue}`];

    return {
      yValue: yValue,
      occupied: !!nextSquare?.current?.attributes[1],
    };
  };

  const moveTetromino = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (currentPiece) {
      let [x, y] = focalPointRef.current;
      const nextSquare = getNextSqaureData([x, y]);

      // Currently Tetrominos are adding their id to squares in addition to setting the Pixels `data-occupied` attribute.
      // Not doing anything with it at the moment but it seems like it'd be useful eventually.
      const nextSquareId =
        nextSquare?.current?.attributes[2];

      // Determines the changes in focal point desired based on direction argument and board state
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

      //This is how a piece knows it's landed
      // if true, changes focal point, currentPiece State and
      if (
        nextSquare.yValue >= boardHeight ||
        nextSquare.occupied
      )
        makeNewPiece();
    }
  };

  const makeNewPiece = () => {
    const newPiece = new Tetromino();
    setPiece(newPiece);

    focalPointRef.current = [3, 0];
    AddOrRemoveTetromino(newPiece, 'add');
  };

  //This is the timer which makes the piece move downward.
  //Currently the only use of useEffect which I hope to get rid of
  // I have comment out because it annoys me when im testing stuff

  // React.useEffect(() => {
  //   if (currentPiece) {
  //     const interval = setInterval(() => {
  //       moveTetromino('down');
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, [currentPiece]);

  return (
    <div>
      <Grid
        setPixelRef={setPixelRef}
        width={boardWidth}
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
    </div>
  );
};
