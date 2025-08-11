import { PixelType } from './Pixel';

class GameManager {
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint: React.MutableRefObject<[number, number]>;

  constructor(
    pixelRefs: React.MutableRefObject<
      (PixelType | null)[][]
    >,
    focalPoint: React.MutableRefObject<[number, number]>
  ) {
    this.pixelRefs = pixelRefs;
    this.focalPoint = focalPoint;
  }
}
