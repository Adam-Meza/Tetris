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
  height: number;
  baseClass: string;
  setPixelRef: (pixel: PixelType) => void;
};

/**
 * Grid React component
 */
export const Grid = (props: GridProps) => {
  const { width, height, baseClass, setPixelRef } = props;

  const styles = {
    '--grid-width': width,
    '--grid-height': height,
  } as React.CSSProperties;

  const makePixels = () => {
    const grid = [];

    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const key = i * width + j;

        const pixelProps = {
          setPixelRef: setPixelRef,
          x: j,
          y: i,
        };

        row.push(
          <Pixel
            {...pixelProps}
            key={key}
            baseClass={baseClass}
          />
        );
      }
      grid.push(row);
    }

    return grid;
  };

  const pixels = makePixels();

  return (
    <section className='grid' style={styles}>
      {pixels}
    </section>
  );
};
