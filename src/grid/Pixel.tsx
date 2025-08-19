import React from 'react';

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
   * Base CSS class applied to the pixel element.
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

/**
 * Runtime shape stored in the `pixelRefs` matrix.
 *
 * `GameManager` mutates these entries imperatively to paint/erase blocks
 * without triggering React re-renders of the entire grid.
 */
export type PixelType = {
  /**
   * Column index (0-based).
   */
  x: number;
  /**
   * Row index (0-based).
   */
  y: number;
  /**
   * Identifier of the occupying piece, if any.
   *
   * Used to determine ownership and collisions. `undefined` means empty cell.
   */
  id?: string | undefined;
  /**
   * Optional class name associated with the current occupant.
   *
   * Usually redundant because `GameManager` toggles classes on the DOM node,
   * but may be useful as a cached value for debugging/logic.
   */
  baseClass?: string;

  baseID?: string;
  /**
   * Ref to the underlying `<span>` element for imperative class toggling.
   *
   * `GameManager.addPixel/removePixel` rely on this to mutate the DOM.
   */
  html?: React.RefObject<HTMLSpanElement>;
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
