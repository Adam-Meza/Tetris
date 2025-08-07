import React from 'react';

export type PixelProps = {
  x: number;
  y: number;
  setPixelRef: (pixel: PixelType) => void;
};

export type PixelType = {
  x: number;
  y: number;
  id?: string | undefined;
  // why am i doing this again???
  // something to look into
  html?: React.RefObject<HTMLSpanElement>;
};

/**
 * Pixel component - uses forwarded pixelRef to rerender itself
 * 
 * @example 
 * <Pixel 
 *    setPixelRef ={setPixelRef}
      x={2}
      y={6}
  />
 */
export const Pixel = (props: PixelProps) => {
  const { setPixelRef, x, y } = props;

  const pixelRef = React.useRef<HTMLSpanElement>(null);

  React.useMemo(() => {
    setPixelRef({
      x,
      y,
      html: pixelRef,
    });
  }, [x, y, pixelRef, setPixelRef]);

  return <span ref={pixelRef}>{/* {x}-{y} */}</span>;
};
