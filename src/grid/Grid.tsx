import React from 'react';
import { Pixel, PixelProps } from './Pixel';

/**
 * Props for Grid component
 * @param width number
 * @param height number (optional)
 * @param ref Ref Object
 */
type GridProps = {
  width: number;
  height?: number;
  ref: React.RefObject<HTMLSpanElement>;
};


/**
 * Grid React component
 */
export const Grid = React.forwardRef(
  (props: GridProps, ref) => {
    const { width, height = null } = props;
    const heightValue = height ?? width;

    const gridRefs = React.useRef(
      Array.from({ length: width * heightValue }, () =>
        React.createRef<HTMLSpanElement>()
      )
    );

    const styles = {
      '--pixel-width': width,
      '--pixel-height': heightValue,
    } as React.CSSProperties;

    React.useImperativeHandle(ref, () => ({
      getCell: (x: number, y: number) =>
        gridRefs.current[y * width + x],
    }));

    const pixels = React.useMemo(() => {
      const grid = [];

      for (let i = 0; i < heightValue; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
          const key = i * width + j;

          const props: PixelProps = {
            x: j,
            y: i,
            ref: gridRefs.current[key],
            id: key,
          };

          row.push(<Pixel key={key} {...props} />);
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
  }
);
