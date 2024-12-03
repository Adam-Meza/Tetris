import React from 'react';
import { Pixel } from './Pixel';
import { PixelType } from '../components/GameBoard/GameBoard';

/**
 * Props for Grid component
 * @param width number
 * @param height number (optional)
 * @param setPixelRef React.RefObject<HTMLSpanElement>
  ) => void;
 */
type GridProps = {
  width: number;
  height?: number;
  setPixelRef: (pixel: PixelType) => void;
};

/**
 * Grid React component
 */
export const Grid = React.forwardRef((props: GridProps) => {
  const { width, height = null, setPixelRef } = props;

  const trueHeight = height ?? width;

  const styles = {
    '--pixel-width': width,
    '--pixel-height': trueHeight,
  } as React.CSSProperties;

  const pixels = () => {
    const grid = [];

    for (let i = 0; i < trueHeight; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const key = i * width + j;

        const pixelProps = {
          setPixelRef: setPixelRef,
          x: j,
          y: i,
        };

        row.push(<Pixel {...pixelProps} key={key} />);
      }
      grid.push(row);
    }

    return grid;
  };

  return (
    <div className='grid' style={styles}>
      {pixels()}
    </div>
  );
});
