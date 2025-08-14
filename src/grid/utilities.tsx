import type { PixelType } from './Pixel';
import type { Coord } from './GameManagerTypes';

export const makeRefMatrix = ([width, height]: Coord) =>
  Array.from({ length: height }, () =>
    Array.from(
      { length: width },
      () => null as PixelType | null
    )
  );
