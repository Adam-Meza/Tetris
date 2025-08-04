import React from 'react';
import { Pixel } from './Pixel';
import { PixelType } from './Pixel';
/**
 * Props for Grid component
 * @param width number
 * @param height number (optional)
 * @param setPixelRef React.RefObject<HTMLSpanElement>
  ) => void;
 */
type GridProps = {
  width: number;
  setPixelRef: (pixel: PixelType) => void;
  height?: number;
};

/**
 * Grid React component
 */
export const Grid = React.forwardRef((props: GridProps) => {
  const { width, height = null, setPixelRef } = props;
  console.log('Grid Render');

  const trueHeight = height ?? width;

  // this is setting the size of the grid based on provided values
  // by passing those via custom properties to the scss

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
    <section className='grid' style={styles}>
      {pixels()}
    </section>
  );
});
