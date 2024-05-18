import React from "react";
import { Pixel } from "./Pixel";

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
   * If noheight value is provided the grid dimensions will be width * width
   */
  height?: number;
}

/**
 * Interactive Grid component
 *
 * @example
 * <Grid width={3}height={12} />
 */
export const Grid = (props: GridProps) => {
  const { width, height = null } = props;

  const heightValue = height ?? width;

  const initialize = () => {
    const grid = [];

    for (let i = 0; i < heightValue; i++) {
      const row = [];

      for (let j = 0; j < width; j++) {
        row.push(<Pixel x={j} y={i} />);
      }

      grid.push(row);
    }

    return grid;
  };

  console.log(initialize());

  return <div>{initialize()}</div>;
};
