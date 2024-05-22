import cx from 'classnames';
import React, { forwardRef } from 'react';
import { TetrominoType } from '../components/Tetromino/Tetromino';

/**
 * Props for Pixel component
 * @param x x coordinate of Pixel.
 * @param y y coordinate of Pixel.
 * @param piece (optional) GamePiece occupying Pixel.
 * @param id unqiue identifier
 */
export interface PixelProps {
  x: number;
  y: number;
  id: number;
  piece?: TetrominoType;
  ref: React.RefObject<HTMLSpanElement>;
}

/**
 * Pixel component
 * @example
 * <Pixel />
 *
 * @returns Basic Pixel Unit
 */
export const Pixel = forwardRef<
  HTMLSpanElement,
  PixelProps
>((props, ref) => {
  const { id, piece } = props;

  const fill = React.useMemo(() => {
    return (
      <span
        id={`${id}`}
        ref={ref}
        className={cx(
          { [`${piece?.id}-block`]: piece },
          'tetromino'
        )}
      >
        {id}
      </span>
    );
  }, [piece, id, ref]);

  return <>{fill}</>;
});
