import React from 'react';
import { Pixel } from './Pixel';
import { Coord, PixelType } from './GameManagerTypes';
type GridProps = {
  /**
   * Grid dimensions as `[width, height]` (in whole tiles).
   *
   * These values are also exposed as CSS custom properties
   * `--grid-width` and `--grid-height` on the root element,
   * which you can use in your styles.
   *
   * @example
   * // 10 columns × 20 rows
   * dimensions={[10, 20]}
   */
  dimensions: Coord;

  /**
   * Base CSS class applied to each `Pixel` for styling variants.
   *
   * Useful when rendering multiple grids (e.g., main board vs. preview)
   * that share structure but have different look-and-feel.
   *
   * @example
   * baseClass="tetris-board"
   */
  baseClass: string;

  /**
   * Map matrix used as a base for PixelRefs
   *
   * Untested, experiemental prop. Theoretically it could be useful
   * for rendering background images.
   *
   * @example
   * baseClass="tetris-board"
   */

  map?: string[][];

  /**
   * PRIVATE Ref collector callback invoked once per rendered `Pixel`.
   *
   */
  setPixelRef: (pixel: PixelType) => void;

  /**
   * Optional keyboard handler intended for the grid container.
   *
   * If provided, you should attach focus to the grid elsewhere
   * (e.g., via a wrapper) or manage focus inside `Grid` in a fork.
   * This component does not attach it automatically.
   *
   * @example
   * const onKey = (ev: KeyboardEvent) => { /* handle arrows/space};
   */
  handleKeyPress?: (ev: KeyboardEvent) => void;
};

/**
 * Grid component that renders a 2D matrix of `Pixel` elements.
 *
 * - Renders `width × height` `Pixel`s based on `dimensions`.
 * - Exposes CSS custom properties `--grid-width` and `--grid-height`
 *   on the root `<section>` for layout/styling hooks.
 * - Calls `setPixelRef` once per pixel so external managers
 *   (e.g., a `GameManager`) can mutate pixels imperatively.
 *
 * @example
 * ```tsx
 * const BOARD_W = 10, BOARD_H = 20;
 * const pixelRefs = React.useRef<(PixelType|null)[][]>(makeRefMatrix(BOARD_H, BOARD_W));
 *
 * const setPixelRef = (p: PixelType) => {
 *   pixelRefs.current[p.y][p.x] = p;
 * };
 *
 * <Grid
 *   dimensions={[BOARD_W, BOARD_H]}
 *   baseClass="tetris-board"
 *   setPixelRef={setPixelRef}
 * />
 * ```
 */
export const Grid: React.FC<GridProps> = ({
  dimensions,
  baseClass,
  map,
  setPixelRef,
}) => {
  const [width, height] = dimensions;
  const style = {
    '--grid-width': width,
    '--grid-height': height,
  } as React.CSSProperties;

  const pixels: React.ReactNode[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let className = baseClass;
      let id = undefined;

      if (map) className += map[y][x]; // still untested but should theoretically add the map class

      pixels.push(
        <Pixel
          key={y * width + x}
          baseClass={className}
          x={x}
          y={y}
          baseID={id}
          setPixelRef={setPixelRef}
        />
      );
    }
  }

  return (
    <section className='grid' style={style}>
      {pixels}
    </section>
  );
};
