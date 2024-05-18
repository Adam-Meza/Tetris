import React, { CSSProperties } from "react";
import { Pixel, PixelProps } from "./Pixel";

/**
 * Props for Grid component
 */
interface GridProps {
  /**
   * Number representing the width value of the final grid
   */
  width: number;
  /**
   * Optionalheight value
   * If no height value is provided the grid dimensions will be width * width
   */
  height?: number;
}

/**
 * Interactive Grid component
 *
 * @example
 * <Grid width={3} height={12} />
 */
export const Grid = (props: GridProps) => {
  const { width, height = null } = props;
  const heightValue = height ?? width;
  const pixelCount = React.useMemo(
    () => ({ "--pixel-count": width }),
    [width]
  ) as CSSProperties;

  const initialize = () => {
    const grid = [];

    for (let i = 0; i < heightValue; i++) {
      const row = [];

      for (let j = 0; j < width; j++) {
        const props: PixelProps = {
          x: j,
          y: i,
        };

        row.push(<Pixel {...props} />);
      }

      grid.push(row);
    }

    return grid;
  };

  console.log(initialize());

  return (
    <div className="grid" style={pixelCount}>
      {initialize()}
    </div>
  );
};
