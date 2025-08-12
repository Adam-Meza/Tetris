import React from 'react';

export type PixelProps = {
  x: number;
  y: number;
  baseClass?: string;
  setPixelRef: (pixel: PixelType) => void;
};

export type PixelType = {
  x: number;
  y: number;
  // el: HTMLSpanElement | null;
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
      class
  />
 */

export const Pixel = (props: PixelProps) => {
  const { setPixelRef, x, y, baseClass } = props;

  const pixelRef = React.useRef<HTMLSpanElement>(null);

  React.useMemo(() => {
    setPixelRef({
      x,
      y,
      html: pixelRef,
    });
  }, []);

  return (
    <span ref={pixelRef} className={baseClass}>
      {/* {x}-{y} */}
    </span>
  );
};
