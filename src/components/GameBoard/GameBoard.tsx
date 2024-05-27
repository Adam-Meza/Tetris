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
  // console.log('GameBoard render');

  const boardHeight = 20;
  const boardWidth = 10;
  const [currentPiece, setPiece] =
    React.useState<TetrominoType>();

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
      if (action === 'add' && !isSquareOccupied(pixelRef)) {
        pixelRef.current.setAttribute(
          'data-occupied',
          'true'
        );
        pixelRef.current.setAttribute('data-id', `${id}`);

        // is this bad practice?
        pixelRef.current.id = currentPiece?.id as string;

        pixelRef.current.classList.add(`${letter}-block`);
      } else {
        pixelRef.current.removeAttribute('data-occupied');
        pixelRef.current.removeAttribute('data-id');
        pixelRef.current.id = '';

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

  const isSquareOccupied = (
    ref: React.RefObject<HTMLSpanElement>
  ) => {
    const squareAttributes = ref?.current?.attributes;

    if (squareAttributes)
      for (let i = 0; i < squareAttributes.length; i++) {
        if (
          squareAttributes[i].value.includes('true') ||
          squareAttributes[i].value.includes('block')
        )
          return true;
      }

    return false;
  };

  const getSqaureData = (startingPoint: number[]) => {
    const [x, y] = startingPoint;
    const square = pixelRefs.current[`${x}-${y}`];

    return {
      x,
      y,
      occupied: isSquareOccupied(square),
      id: square?.current?.id,
    };
  };

  const reformatData = () => {
    return Object.keys(pixelRefs.current).map((key) => {
      const [x, y] = key
        .split('-')
        .map((value) => Number(value));

      return {
        ...getSqaureData([x, y]),
        nextSquare: getSqaureData([x, y + 1]),
      };
    });
  };

  const checkDownWardMove = () => {
    return reformatData().some((square) => {
      const { id, nextSquare } = square;

      if (id === currentPiece?.id) {
        //prettier-ignore
        return (
          (
            nextSquare?.occupied &&
            id !== nextSquare.id
          ) || (
            nextSquare.y >= boardHeight
            )
        );
      }
    });
  };

  const moveTetromino = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (currentPiece) {
      let [x, y] = focalPointRef.current;

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
      console.log(checkDownWardMove());
      if (checkDownWardMove()) {
        makeNewPiece();
      }
    }
  };

  const makeNewPiece = () => {
    const newPiece = pickRandomPiece();
    setPiece(newPiece);

    focalPointRef.current = [3, 0];
    AddOrRemoveTetromino(newPiece, 'add');
    console.log('last');
  };

  //This is the timer which makes the piece move downward.
  //Currently the only use of useEffect which I hope to get rid of
  // I have comment out because it annoys me when im testing stuff

  // React.useEffect(() => {
  //   if (currentPiece) {
  //     const interval = setInterval(() => {
  //       moveTetromino('down');
  //     }, 700);
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
        <button
          onClick={() => {
            console.log('current:', currentPiece);

            // console.log('pixelrefs:', pixelRefs.current);
          }}
        >
          console log stuff
        </button>
        <button onClick={() => makeNewPiece()}>
          makeNewPiece
        </button>
      </div>
    </div>
  );
};
