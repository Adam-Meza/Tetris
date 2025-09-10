import React from 'react';
import { PixelType } from './GameManagerTypes';

/**
 * Props for a single `Pixel` cell rendered by `Grid`.
 *
 * Each `Pixel` reports itself via `setPixelRef` so the wrapper can
 * build a 2D matrix (`pixelRefs`) used by `GameManager` for imperative updates.
 */
export type PixelProps = {
  /**
   * Column index (0-based).
   */
  x: number;
  /**
   * Row index (0-based).
   */
  y: number;
  /**
   * Optional base CSS class applied to the pixel element for styling purposes.
   *
   * Set by GameManager Class.
   *
   * Commonly inherited from the `Grid`'s `baseClass` to theme multiple grids.
   */
  baseClass?: string;
  /**
   * Collector invoked once per mounted `Pixel`.
   *
   * Use to populate the external ref matrix:
   * `pixelRefs.current[y][x] = pixel`
   *
   * @example
   * const setPixelRef = (p: PixelType) => {
   *   pixelRefs.current[p.y][p.x] = p;
   * };
   */
  setPixelRef: (pixel: PixelType) => void;

  baseID?: string | undefined;
};

export const Pixel = (props: PixelProps) => {
  const { setPixelRef, x, y, baseClass, baseID } = props;

  const pixelRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    setPixelRef({
      x,
      y,
      baseID,
      html: pixelRef,
      baseClass: baseClass,
    });
  }, []);

  return <span ref={pixelRef} className={baseClass}></span>;
};
