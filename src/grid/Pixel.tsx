import React from "react";
import { inflateRaw } from "zlib";

/**
 * Props for Pixel component
 */
interface PixelProps {
  /**
   * x value of the Pixel relative to the parent Grid
   */
  x: number;
  /**
   * y value of the Pixel relative to the parent Grid
   */
  y: number;
}

/**
 * Pixel component
 * @example
 * <Pixel
 *
 * @returns Basic Pixel Unit
 */
export const Pixel = (props: PixelProps) => {
  const { x, y } = props;

  return (
    <span className="pixel" id={`${x}${y}`}>
      {x}
      {y}
    </span>
  );
};
