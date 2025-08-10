import type { PixelType } from './Pixel';

export const addOrRemovePixel = (
  pixels: React.MutableRefObject<(PixelType | null)[][]>,
  setPixel: (pixel: PixelType) => void,
  x: number,
  y: number,
  action: 'add' | 'remove',
  letter?: string,
  id?: string
) => {
  const dataRef = pixels.current[y][x];

  const spanRef = dataRef?.el;

  if (!spanRef) return false;

  if (action === 'add') {
    spanRef.classList.add(`${letter}-block`);
    setPixel({
      x,
      y,
      id: id,
      el: spanRef,
    });
  } else if (action === 'remove') {
    spanRef.classList.remove(`${letter}-block`);
    setPixel({
      x,
      y,
      id: undefined,
      el: null,
    });
  }
};
