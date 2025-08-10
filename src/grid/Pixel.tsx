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
  el: HTMLSpanElement | null;
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
export const Pixel = React.memo(
  ({
    x,
    y,
    baseClass = 'pixel',
    setPixelRef,
  }: PixelProps) => {
    const refCallback = React.useCallback(
      (el: HTMLSpanElement | null) => {
        setPixelRef({ x, y, el });
      },
      [x, y, setPixelRef]
    );

    return <span ref={refCallback} className={baseClass} />;
  }
);
