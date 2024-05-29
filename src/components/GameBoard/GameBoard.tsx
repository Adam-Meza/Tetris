import React from 'react';
import { Grid } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';

export type PixelType = {
  occupied: boolean;
  x: number;
  y: number;
  id?: string | undefined;
  html?: React.RefObject<HTMLSpanElement>;
  nextSquare?: PixelType | undefined;
};

/**
 * Tetris GameBoardComponent -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
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
    [key: string]: PixelType;
  }>({});

  const setPixelRef = (
    x: number,
    y: number,
    ref: React.RefObject<HTMLSpanElement>
  ) => {
    pixelRefs.current[`${x}-${y}`] = {
      x,
      y,
      occupied: false,
      html: ref,
    };
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

    const spanRef =
      pixelRefs?.current[`${x}-${y}`]?.html?.current;

    const dataRef = pixelRefs.current[`${x}-${y}`];

    const { letter, id } = tetromino;

    if (!spanRef) return;

    if (action === 'add' && !isSquareOccupied(spanRef)) {
      dataRef.occupied = true;
      dataRef.id = id;

      spanRef.setAttribute('data-occupied', 'true');
      spanRef.setAttribute('data-id', `${id}`);

      // is this bad practice?
      spanRef.id = currentPiece?.id as string;

      spanRef.classList.add(`${letter}-block`);
    } else {
      pixelRefs.current[`${x}-${y}`].occupied = false;

      spanRef.removeAttribute('data-occupied');
      spanRef.removeAttribute('data-id');
      spanRef.id = '';

      spanRef.classList.remove(`${letter}-block`);
    }
  };

  const addOrRemoveTetromino = (
    tetromino = currentPiece,
    action: 'add' | 'remove'
  ) => {
    tetromino?.shape.forEach(
      //@ts-expect-error: I don't know but it wont go away
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
    ref: HTMLSpanElement | null | undefined
  ) => {
    if (!ref) return;

    const attributes = ref.attributes;

    // console.log(attributes);

    for (let i = 0; i < attributes.length; i++) {
      if (
        attributes[i].value.includes('true') ||
        attributes[i].value.includes('block')
      )
        return true;
    }

    return false;
  };

  const getSqaureData = (startingPoint: number[]) => {
    const [x, y] = startingPoint;
    const square = pixelRefs?.current[`${x}-${y}`];

    return {
      x,
      y,
      occupied: isSquareOccupied(square?.html?.current),
      id: square?.id,
    };
  };

  const nextSpaceOccupied = () => {
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        const square = getSqaureData([j, i]);
        const nextSquare = getSqaureData([j, i + 1]);

        if (square.id === currentPiece?.id) {
          if (
            (nextSquare.occupied &&
              square.id !== nextSquare.id) ||
            nextSquare.y >= boardHeight
          ) {
            console.log('teste');
            return true;
          }
        }
      }
    }

    return false;
  };

  const moveTetromino = (
    direction: 'down' | 'left' | 'right'
  ) => {
    if (!currentPiece) return;
    let [x, y] = focalPointRef.current;

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

    addOrRemoveTetromino(currentPiece, 'remove');
    focalPointRef.current = [x, y];
    addOrRemoveTetromino(currentPiece, 'add');

    if (nextSpaceOccupied()) handleBlockLanding();
  };

  const handleBlockLanding = () => {
    makeNewPiece();
  };

  const makeNewPiece = () => {
    const newPiece = pickRandomPiece();
    setPiece(newPiece);

    focalPointRef.current = [3, 0];
    addOrRemoveTetromino(newPiece, 'add');
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

  const handleKeyPress = (key: string) => {
    switch (key) {
      case 'ArrowDown':
        moveTetromino('down');
        return;
      case 'ArrowLeft':
        moveTetromino('left');
        return;
      case 'ArrowRight':
        moveTetromino('right');
        return;
      case 'Enter':
        makeNewPiece();
        return;
    }
  };

  return (
    <div onKeyDown={(event) => handleKeyPress(event.key)}>
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

        <button
          onClick={() => {
            console.log('currentPiece:', currentPiece);

            console.log('pixelrefs:', pixelRefs.current);
          }}
        >
          console log stuff
        </button>
      </div>
    </div>
  );
};
