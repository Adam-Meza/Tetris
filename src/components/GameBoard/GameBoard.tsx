import React from 'react';
import { Grid, GridHandle } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';

export const GameBoard = () => {
  const boardHeight = 20;
  const boardWidth = 10;
  const gridRef = React.useRef<GridHandle>(null);

  const [currentPiece, setPiece] =
    React.useState<TetrominoType>({
      shape: [[]],
      id: '',
    });
  const refPoint = React.useRef<number[]>([3, 0]);

  const pickRandomPiece = (): TetrominoType => {
    const randomIndex = Math.floor(
      Math.random() * blocks.length
    );

    return blocks[randomIndex];
  };

  const placeTetromino = (tetromino: TetrominoType) => {
    const { shape, id } = tetromino;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          handleClassChange(colIndex, rowIndex, 'add');
        }
      });
    });
  };

  const handleClassChange = (
    column: number,
    row: number,
    action: string
  ) => {
    const x = refPoint.current[0] + column;
    const y = refPoint.current[1] + row;
    const cellRef = gridRef?.current?.getCell(x, y);

    if (cellRef?.current) {
      action === 'remove'
        ? cellRef.current.classList.remove('test')
        : cellRef.current.classList.add('test');
    }
  };

  const clearTetromino = () => {
    const { shape, id } = currentPiece;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          handleClassChange(colIndex, rowIndex, 'remove');
        }
      });
    });
  };

  const moveTetromino = (
    direction?: 'down' | 'left' | 'right'
  ) => {
    let [x, y] = refPoint.current;

    clearTetromino();

    switch (direction) {
      case 'down':
        if (y + currentPiece.shape.length < boardHeight)
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

    refPoint.current = [x, y];
    placeTetromino(currentPiece, x, y);
  };

  const clearBoard = () => {
    clearTetromino();
    refPoint.current = [3, 0];
  };

  const makeNewPiece = () => {
    const newPiece = pickRandomPiece();
    setPiece(newPiece);
    placeTetromino(newPiece);
  };

  return (
    <div>
      <Grid
        ref={gridRef}
        width={boardWidth}
        height={boardHeight}
      />
      <button
        onClick={() => {
          clearBoard();
          makeNewPiece();
        }}
      >
        Place Block
      </button>
      <button
        onClick={() => {
          moveTetromino('down');
        }}
      >
        Move Block to down
      </button>

      <button
        onClick={() => {
          moveTetromino('left');
        }}
      >
        Move Block to left
      </button>

      <button
        onClick={() => {
          moveTetromino('right');
        }}
      >
        Move Block to right
      </button>
    </div>
  );
};
