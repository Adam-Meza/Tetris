import React from 'react';
import { Grid } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';
import { version } from 'process';

export type PixelType = {
  x: number;
  y: number;
  id?: string | undefined;
  html?: React.RefObject<HTMLSpanElement>;
  nextSquare?: PixelType | undefined;
  letter?: string;
};

type Direction = 'down' | 'left' | 'right';

/**
 * Tetris GameBoardComponent -
 * Handles almost all the logic for game play including:
 * moving, placing, and deleting Tetrominos.
 */
export const GameBoard = () => {
  const boardWidth = 10;
  const boardHeight = 20;
  const [currentTetromino, setTetromino] =
    React.useState<TetrominoType>();
  // const [gameOver, setGameOver] = React.useState(false);

  const randomTetromino = (): TetrominoType => {
    const block =
      blocks[Math.floor(Math.random() * blocks.length)];

    return {
      id: block.letter + Date.now(),
      shape: block.shape,
      letter: block.letter,
    };
  };

  /**
   * Focal point determining the coordinates on the Grid that pieces are placed/oriented with. Example
   */
  const focalPointRef = React.useRef<[number, number]>([
    3, 0,
  ]);

  /**
   * This is a mutable ref object that will be used as the point of truth for game state logic
   */
  const pixelRefs = React.useRef<{
    [key: string]: PixelType;
  }>({});

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

    const spanRef = dataRef.html?.current as HTMLElement;

    if (!spanRef) return false;

    if (action === 'add') {
      spanRef.classList.add(`${letter}-block`);
      setPixelRef({ x, y, id: id });
    } else {
      spanRef.classList.remove(`${letter}-block`);
      setPixelRef({
        x,
        y,
        id: undefined,
      });
    }
  };

  const updateCurrentTetromino = (
    action: 'add' | 'remove',
    tetromino = currentTetromino
  ) => {
    tetromino?.shape.forEach(
      (row: (string | null)[], rowIndex: number) => {
        row.forEach(
          (cell: string | null, colIndex: number) => {
            if (cell) {
              const x = focalPointRef.current[0] + colIndex;
              const y = focalPointRef.current[1] + rowIndex;

              const { id, letter } = tetromino;

              addOrRemovePixel(x, y, action, letter, id);
            }
          }
        );
      }
    );
  };

  const isMovePossible = React.useCallback(
    (direction: Direction) => {
      if (!currentTetromino) return;

      for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
          let x = j;
          let y = i;

          const square = pixelRefs?.current[`${x}-${y}`];

          switch (direction) {
            case 'down':
              y += 1;
              break;
            case 'left':
              x -= 1;
              break;
            case 'right':
              x += 1;
              break;
          }

          const nextSquare =
            pixelRefs?.current[`${x}-${y}`];

          if (square.id === currentTetromino.id)
            if (
              !nextSquare ||
              (square.id !== nextSquare.id && nextSquare.id)
            ) {
              return false;
            }
        }
      }
      return true;
    },
    [currentTetromino]
  );

  const moveTetromino = (direction: Direction) => {
    if (!currentTetromino) return;
    let [x, y] = focalPointRef.current;

    if (isMovePossible(direction)) {
      switch (direction) {
        case 'down':
          y += 1;
          break;
        case 'left':
          x -= 1;
          break;
        case 'right':
          x += 1;
          break;
      }
    }

    updateCurrentTetromino('remove');
    focalPointRef.current = [x, y];
    updateCurrentTetromino('add');

    if (!isMovePossible('down'))
      setTimeout(() => {
        handleBlockLanding();
      }, 200);
  };

  const moveRowsDown = (rows: number[]) => {
    const pixelsInRows = reformattedRefs().reverse();

    pixelsInRows.forEach((row) => {
      row.forEach((pixel) => {
        if (pixel.y < rows[0]) {
          const { x, y, id } = pixel;
          const letter = getLetter(id);

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

  React.useMemo(() => {
    console.log('we work');
    if (currentTetromino && !isMovePossible('down')) {
      console.log(currentTetromino);
    }
  }, [currentTetromino, isMovePossible]);

  const handleBlockLanding = async () => {
    const completedRowIndexes = findCompletedRows();

    if (completedRowIndexes) {
      removeRows(completedRowIndexes);
      moveRowsDown(completedRowIndexes);
    }

    makeNewTetromino();
  };

  const removeRows = (rows: number[]) => {
    if (!rows) return;

    rows.forEach((y) => {
      for (let i = 0; i < boardWidth; i++) {
        if (!pixelRefs.current[`${i}-${y}`].id) return;

        const id = pixelRefs.current[`${i}-${y}`].id;
        const letter = getLetter(id);

        addOrRemovePixel(i, y, 'remove', letter);
      }
    });
  };

  const getLetter = (id: string | undefined) => {
    return id?.split('')[0];
  };

  const reformattedRefs = () => {
    const pixelsInRows = [];

    for (let i = 0; i < boardHeight; i++) {
      const row = [];

      for (let j = 0; j < boardWidth; j++) {
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
    if (
      focalPointRef.current[0] === 3 &&
      focalPointRef.current[1] === 0 &&
      currentTetromino
    )
      return;

    const tetromino = randomTetromino();
    setTetromino(tetromino);

    focalPointRef.current = [3, 0];
    updateCurrentTetromino('add', tetromino);

    // console.log(isMovePossible('down'));
  };

  /**
   *
   * @param shape
   * @returns
   */
  const rotateShapeClockwise = (
    shape: (string | null)[][]
  ): (string | null)[][] => {
    const transposedShape = shape[0]
      .map((_, colIndex) =>
        shape.map((row) => row[colIndex])
      )
      .map((row) => row.reverse());

    return transposedShape;
  };
  version;
  const rotateTetromino = () => {
    if (!currentTetromino) return;
    const original = currentTetromino;

    const rotated = {
      ...currentTetromino,
      shape: rotateShapeClockwise(currentTetromino.shape),
    };

    updateCurrentTetromino('remove');
    setTetromino(rotated);
    if (isMovePossible('down'))
      updateCurrentTetromino('add', rotated);
    else {
      console.log('here');
      setTetromino(original);
      updateCurrentTetromino('add', original);
    }
  };

  React.useEffect(() => {
    if (currentTetromino) {
      const interval = setInterval(() => {
        moveTetromino('down');
      }, 700);
      return () => clearInterval(interval);
    }
  });

  const handleKeyPress = (key: string) => {
    const direction = key
      .replace('Arrow', '')
      .toLowerCase() as Direction;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (isMovePossible(direction))
          moveTetromino(direction);
        return;
      case 'Enter':
        makeNewTetromino();
        return;
      case 'Shift':
        rotateTetromino();
        return;
      default:
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
            makeNewTetromino();
          }}
        >
          Place Block
        </button>

        <button
          onClick={() => {
            console.log(
              'currentTetromino:',
              currentTetromino
            );

            console.log('pixelrefs:', pixelRefs.current);
          }}
        >
          console log stuff
        </button>

        <button onClick={() => rotateTetromino()}>
          rotate
        </button>
      </div>
    </div>
  );
};
