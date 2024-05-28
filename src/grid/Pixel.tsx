import React from 'react';
import { PixelType } from '../components/GameBoard/GameBoard';

/**
 * Pixel component
 * @example
 *
 * @returns Basic Pixel Unit
 */

type PixelProps = HTMLSpanElement &
  PixelType & {
    setPixelRef: (
      x: number,
      y: number,
      ref: React.RefObject<HTMLSpanElement>
    ) => void;
  };

export const Pixel = React.forwardRef<PixelProps>(
  (props, ref) => {
    //@ts-expect-error tes
    const { setPixelRef, x, y } = props;

    const test = React.createRef<HTMLSpanElement>();

    React.useMemo(() => {
      setPixelRef(x, y, test);
    }, [x, y, setPixelRef, test]);

    return <span ref={test}></span>;
  }
);
