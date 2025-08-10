import { Grid } from '../../grid/Grid';
import React from 'react';
import type { PixelType } from '../../grid/Pixel';

export const NextTetromino = () => {
  const pixelRefs = React.useRef<{
    [key: string]: PixelType;
  }>({});

  const setPixelRef = (pixel: PixelType) => {
    const key = `${pixel.x}-${pixel.y}`;

    if (!pixelRefs.current[key])
      pixelRefs.current[key] = pixel;
    else
      pixelRefs.current[key] = {
        ...pixelRefs.current[key],
        ...pixel,
      };
  };

  return (
    <div className='next-tetromino-wrapper grid-wrapper'>
      <Grid
        width={7}
        height={5}
        setPixelRef={setPixelRef}
        baseClass='tetromino'
      ></Grid>
    </div>
  );
};
