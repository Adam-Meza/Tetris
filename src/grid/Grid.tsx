import React from 'react';
import { Pixel } from './Pixel';
import { PixelType } from './Pixel';
/**
 * Props for Grid component
 * @param width number
 * @param height number (optional)
 * @param setPixelRef React.RefObject<HTMLSpanElement>
  ) => void;
 */

type GridProps = {
  width: number;
  height: number;
  baseClass: string;
  setPixelRef: (pixel: PixelType) => void;
  handleKeyPress?: (ev: KeyboardEvent) => void;
};

/**
 * Grid React component
 */
export const Grid: React.FC<GridProps> = ({
  width,
  height,
  baseClass,
  setPixelRef,
  handleKeyPress,
}) => {
  const style = {
    '--grid-width': width,
    '--grid-height': height,
  } as React.CSSProperties;

  const pixels: React.ReactNode[] = [];

  // React.useCallback(() => {
  //   window.addEventListener('keydown', handleKeyPress);
  // }, []);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixels.push(
        <Pixel
          key={y * width + x}
          baseClass={baseClass}
          x={x}
          y={y}
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
