import type { PixelType } from './Pixel';
import { getLetter } from '../utilities';

export const addOrRemovePixel = (
  pixels: React.MutableRefObject<(PixelType | null)[][]>,
  coordinates: [number, number],
  action: 'add' | 'remove',
  className: string,
  id?: string
) => {
  const [x, y] = coordinates;
  const dataRef = pixels.current[y][x] as PixelType;
  const spanRef = dataRef.html;

  if (!spanRef?.current) return false;

  if (action === 'add') {
    spanRef.current?.classList.add(className);
    dataRef.id = id;
  } else if (action === 'remove') {
    spanRef.current.classList.remove(className);
    dataRef.id = undefined;
  }
};

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
