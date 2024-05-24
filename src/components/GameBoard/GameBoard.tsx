import React from 'react';
import { Grid } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';

/*
random to do

learn more avout refs figure out how to avoid the reredners when a new piece is made. its using state rn but would be better in the ref. need to better understand how this is working tbh

Tetromino ROTATIOn!

Somethings up with the landing logic. pieces will sotp early under some cases. probably need to conditionally check for null values in currentPiece.shape array as classes are placed. also OTHER STUFFFFFF

remove row on completion logic


*/

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
    React.useState<TetrominoType>();

  // kinda wanna abstract pickRandomPiece  out
  // like maybe use a class to do this logic
  // it would just need to return the object and maybe a way to do the randomization
  // use case might look like
  /*

const tetro = new Tetromino() 

returns:
{
  id: t3242123, - always new ID
  shape: [
          ['t', 't', 't'],
          [null, 't', null],
    ]
  letter: l
}

maybe add methods too later idk.

 */
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

      // const nextYValue = y + currentPiece.shape.length + 1;
      // const nextSquare =
      //   pixelRefs.current[`${x}-${nextYValue}`];

      // const nextSquareOccupied =
      //   nextSquare?.current?.attributes[1];

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

      //Ideally want to make this into a single call
      // Was gonna make it take a 'both' argument  and use recursion to call it but in the other direction.
      // maybe default to adding since i use it more.
      // or maybe remove since it always happens first idk
      // focual point change needs to happen in between tho
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
    const newPiece = pickRandomPiece();
    setPiece(newPiece);

    focalPointRef.current = [3, 0];
    AddOrRemoveTetromino(newPiece, 'add');
  };

  //This is the timer which makes the piece move downward.
  //Currently the only use of useEffect which I hope to get rid of

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
