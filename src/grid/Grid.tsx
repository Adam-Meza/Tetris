import React from 'react';
import { Pixel, PixelProps } from './Pixel';
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
  pixelRefs: any;
  testSetRef?: (
    x: number,
    y: number,
    data: PixelType
  ) => void;
  setPixelRef: (
    x: number,
    y: number,
    ref: React.RefObject<HTMLSpanElement>
  ) => void;
};

/**
 * Grid React component
 */
export const Grid = React.forwardRef(
  (props: GridProps, ref) => {
    const {
      width,
      height = null,
      setPixelRef,
      pixelRefs,
      testSetRef,
    } = props;
    const heightValue = height ?? width;

    console.log('grid render');

    /**
     * GridRef
     * - Node List that's used as point of truth for pixel display
     */
    const gridRefs = React.useRef(
      Array.from({ length: width * heightValue }, () =>
        React.createRef<HTMLSpanElement>()
      )
    );

    const styles = {
      '--pixel-width': width,
      '--pixel-height': heightValue,
    } as React.CSSProperties;

    // React.useMemo(() => {
    //   for (let i = 0; i < heightValue; i++) {
    //     for (let j = 0; j < width; j++) {
    //       setPixelRef(
    //         j,
    //         i,
    //         gridRefs.current[i * width + j]
    //       );
    //     }
    //   }
    // }, [width, heightValue, setPixelRef]);

    const pixels = () => {
      const grid = [];

      for (let i = 0; i < heightValue; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          const key = i * width + j;

          row.push(
            <Pixel
              key={key}
              setPixelRef={setPixelRef}
              x={j}
              y={i}
            />
          );
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
  }
);
