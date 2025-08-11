import type { PixelType } from './Pixel';
import { getLetter } from '../utilities';

export const addOrRemovePixel = (
  pixels: React.MutableRefObject<(PixelType | null)[][]>,
  coordinates: [number, number],
  action: 'add' | 'remove',
  letter?: string,
  id?: string
) => {
  const [x, y] = coordinates;
  const dataRef = pixels.current[y][x] as PixelType;

  const spanRef = dataRef.html;

  if (!spanRef?.current) return false;

  if (action === 'add') {
    spanRef.current.classList.add(`${letter}-block`);
    dataRef.id = id;
  } else if (action === 'remove') {
    spanRef.current.classList.remove(`${letter}-block`);
    dataRef.id = undefined;
  }
};

export const clearBoard = (
  refs: React.MutableRefObject<(PixelType | null)[][]>
) => {
  const height = refs.current.length;
  const width = refs.current[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const id = refs.current[i][j]?.id;

      if (id) {
        const letter = getLetter(id);
        addOrRemovePixel(
          refs,
          [j, i],
          'remove',
          letter,
          id
        );
      }
    }
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
