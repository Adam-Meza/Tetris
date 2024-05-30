import React from 'react';
import { PixelType } from '../components/GameBoard/GameBoard';

export type PixelProps = {
  x: number;
  y: number;
  setPixelRef: (pixel: PixelType) => void;
};

/**
 * Pixel component
 */
export const Pixel = React.forwardRef<
  HTMLSpanElement,
  PixelProps
>((props, ref) => {
  const { setPixelRef, x, y } = props;

  const pixelRef = React.useRef<HTMLSpanElement>(null);

  React.useMemo(() => {
    setPixelRef({
      x,
      y,
      html: pixelRef,
    });
  }, [x, y, pixelRef, setPixelRef]);

  return <span ref={pixelRef}></span>;
});
