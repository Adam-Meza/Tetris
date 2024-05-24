import React from 'react';
import { Pixel, PixelProps } from './Pixel';

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
  setPixelRef: (
    x: number,
    y: number,
    ref: React.RefObject<HTMLSpanElement>
  ) => void;
};

/**
 * Grid React component
 */
export const Grid = React.forwardRef((props: GridProps) => {
  const { width, height = null, setPixelRef } = props;
  const heightValue = height ?? width;

  /**
   * GridRef
   * - Node List that's used as point of truth for pixel display
   */
  const gridRefs = React.useRef(
    Array.from({ length: width * heightValue }, () =>
      React.createRef<HTMLSpanElement>()
    )
  );

  // console.log(gridRefs);

  const styles = {
    '--pixel-width': width,
    '--pixel-height': heightValue,
  } as React.CSSProperties;

  React.useMemo(() => {
    for (let i = 0; i < heightValue; i++) {
      for (let j = 0; j < width; j++) {
        setPixelRef(j, i, gridRefs.current[i * width + j]);
      }
    }
  }, [width, heightValue, setPixelRef]);

  const pixels = React.useMemo(() => {
    const grid = [];

    for (let i = 0; i < heightValue; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const key = i * width + j;

        row.push(
          <Pixel key={key} ref={gridRefs.current[key]}>
            {i}
            {j}
          </Pixel>
        );
      }
      grid.push(row);
    }

    return grid;
  }, [width, heightValue]);

  return (
    <div className='grid' style={styles}>
      {pixels}
    </div>
  );
});
