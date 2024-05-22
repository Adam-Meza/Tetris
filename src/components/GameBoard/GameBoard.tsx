import React from 'react';
import { Grid } from '../../grid/Grid';
import {
  blocks,
  TetrominoType,
} from '../Tetromino/Tetromino';

export const GameBoard = () => {
  const [currentPiece, setPiece] =
    React.useState<TetrominoType>(pickRandomPiece());
  let refPoint = React.useRef<number[]>([3, 0]);

  function pickRandomPiece(): TetrominoType {
    const randomIndex = Math.floor(
      Math.random() * blocks.length
    );

    return blocks[randomIndex];
  }

  const gridRef =
    React.useRef<React.RefObject<HTMLSpanElement>>();

  const placeTetromino = (
    tetromino: TetrominoType,
    startX = refPoint.current[0],
    startY = refPoint.current[1]
  ) => {
    const { shape, id } = tetromino;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const x = startX + colIndex;
          const y = startY + rowIndex;

          const cellRef = gridRef?.current?.getCell(x, y);

          if (cellRef.current) {
            cellRef.current.classList.add('test');
          }
        }
      });
    });
  };

  const clearTetromino = (
    startX: number,
    startY: number
  ) => {
    const { shape, id } = currentPiece;

    shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          const x = startX + colIndex;
          const y = startY + rowIndex;
          const cellRef = gridRef?.current?.getCell(x, y);

          if (cellRef.current)
            cellRef.current.classList.remove('test');
        }
      });
    });
  };

  const moveTetromino = (
    direction?: 'down' | 'left' | 'right'
  ) => {
    let x = refPoint.current[0];
    let y = refPoint.current[1];

    clearTetromino(x, y);
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

    refPoint.current = [x, y];
    placeTetromino(currentPiece, x, y);
  };

  return (
    <div>
      <Grid ref={gridRef} width={10} height={20} />
      <button
        onClick={() => {
          placeTetromino(currentPiece);
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
