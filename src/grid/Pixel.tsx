import React from 'react';
import { PixelType } from '../components/GameBoard/GameBoard';

/**
 * Pixel component
 * @example
 *
 * @returns Basic Pixel Unit
 */

type PixelProps = {
  x: number;
  y: number;
  setPixelRef: (
    x: number,
    y: number,
    ref: React.RefObject<HTMLSpanElement>
  ) => void;
};

export const Pixel = React.forwardRef<
  HTMLSpanElement,
  PixelProps
>(
  //@ts-expect-error tes
  (props, ref) => {
    const { setPixelRef, x, y } = props;

    const pixelRef = React.useRef<HTMLSpanElement>(null);

    // React.useMemo(() => {
    //   setPixelRef(x, y, pixelRef);
    // }, [x, y, setPixelRef, pixelRef]);

    React.useMemo(() => {
      setPixelRef(x, y, pixelRef);
    }, [x, y, pixelRef, setPixelRef]);

    return <span ref={pixelRef}></span>;
  }
);
