import type { PixelType } from './Pixel';

export const makeRefMatrix = (
  height: number,
  width: number
) =>
  Array.from({ length: height }, () =>
    Array.from(
      { length: width },
      () => null as PixelType | null
    )
  );
