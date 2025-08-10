import type { PixelType } from './Pixel';
import { getLetter } from '../utilities';

export const addOrRemovePixel = (
  pixels: React.MutableRefObject<(PixelType | null)[][]>,
  setPixel: (pixel: PixelType) => void,
  x: number,
  y: number,
  action: 'add' | 'remove',
  letter?: string,
  id?: string
) => {
  if (action === 'add') console.log(id);
  const dataRef = pixels.current[y][x];

  const spanRef = dataRef?.html?.current;

  if (!spanRef) return false;

  if (action === 'add') {
    spanRef.classList.add(`${letter}-block`);
    setPixel({
      x,
      y,
      id,
    });
  } else if (action === 'remove') {
    spanRef.classList.remove(`${letter}-block`);
    setPixel({
      x,
      y,
      id: undefined,
    });
  }
};

export const clearBoard = (
  refs: React.MutableRefObject<(PixelType | null)[][]>,
  setRefs: (refs: PixelType) => void
) => {
  const height = refs.current.length;
  const width = refs.current[0].length;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const id = refs.current[i][j]?.id;

      if (id) {
        console.log('we got here');
        const letter = getLetter(id);
        addOrRemovePixel(
          refs,
          setRefs,
          j,
          i,
          'remove',
          letter,
          id
        );
      }
    }
  }
};
