import { PixelType } from './Pixel';
import { getLetter } from '../components/Play/GameBoard/utilities';
import type {
  PutPropsType,
  DeleteArgsType,
  MoveArgs,
  Direction,
  Coord,
} from './GameManagerTypes';

export class GameManager {
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint: React.MutableRefObject<Coord>;

  constructor(
    pixelRefs: React.MutableRefObject<
      (PixelType | null)[][]
    >,
    focalPoint: React.MutableRefObject<Coord>
  ) {
    this.pixelRefs = pixelRefs;
    this.focalPoint = focalPoint;
  }

  put(args: PutPropsType): void {
    const { piece, focalPoint, conditional, onAfter } =
      args;
    const { shape } = piece;

    if (
      conditional &&
      !conditional({ ...args, pixelRefs: this.pixelRefs })
    ) {
      return;
    }

    const width = shape[0].length;
    const height = shape.length;

    const [x, y] = focalPoint;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (shape[i][j]) {
          const coordinates = [x + j, y + i];
          this.addPixel(
            piece.id,
            piece.className,
            coordinates
          );
        }
      }
    }

    onAfter?.({
      piece: piece,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
  }

  delete(args: DeleteArgsType): void {
    const { piece, focalPoint, conditional, onAfter } =
      args;
    const { shape, className } = piece;

    if (conditional && !conditional(args)) return;

    const width = shape[0].length;
    const height = shape.length;

    const [x, y] = focalPoint;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (shape[i][j]) {
          const targetX = x + j;
          const targetY = y + i;
          const pixel =
            this.pixelRefs.current[targetY][targetX];

          if (pixel) this.removePixel(pixel, className);
        }
      }
    }

    onAfter?.({
      piece: piece,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
  }

  addPixel(
    id: string | undefined,
    className: string,
    coordinates: number[]
  ): void {
    const [x, y] = coordinates;
    const dataRef = this.pixelRefs.current[y][
      x
    ] as PixelType;

    const spanRef = dataRef.html;

    if (!spanRef?.current) return;

    spanRef.current?.classList.add(className);
    dataRef.id = id;
  }

  removePixel(pixel: PixelType, className: string): void {
    const spanRef = pixel.html;

    if (!spanRef?.current) return;

    spanRef.current.classList.remove(className);
    pixel.id = undefined;
  }

  playerMove(args: MoveArgs): void {
    const {
      piece,
      direction,
      distance,
      conditional,
      onAfter,
    } = args;

    const [x, y] = this.focalPoint.current;
    const [targetX, targetY] = this.offsetCoord(
      [x, y],
      direction,
      distance
    );

    if (
      (conditional && !conditional(args)) ||
      this.isOutOfBounds([targetX, targetY])
    )
      return;

    this.delete({
      piece: piece,
      focalPoint: [x, y],
    });

    this.focalPoint.current = [targetX, targetY];

    this.put({
      piece: piece,
      focalPoint: [targetX, targetY],
    });

    onAfter?.({
      piece: piece,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
  }

  move(args: MoveArgs): void {
    const {
      piece,
      direction,
      distance,
      conditional,
      onAfter,
    } = args;

    const [x, y] = this.focalPoint.current;

    if (conditional && !conditional(args)) return;

    this.delete({
      piece: piece,
      focalPoint: [x, y],
    });

    const [targetX, targetY] = this.offsetCoord(
      [x, y],
      direction,
      distance
    );

    this.put({
      piece: piece,
      focalPoint: [targetX, targetY],
    });

    onAfter?.({
      piece: piece,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
  }

  clearBoard(): void {
    const height = this.pixelRefs.current.length;
    const width = this.pixelRefs.current[0].length;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const pixel = this.pixelRefs.current[i][j];

        if (pixel?.id) {
          const className = `${getLetter(pixel.id)}-block`; // THIS IS A DANGER THIS IS NOT UNIVERSAL!!!!
          this.removePixel(pixel, className);
        }
      }
    }
  }

  offsetCoord(
    [x, y]: Coord,
    direction: Direction,
    distance: number
  ): Coord {
    switch (direction) {
      case 'down':
        return [x, y + distance];
      case 'left':
        return [x - distance, y];
      case 'right':
        return [x + distance, y];
      case 'up':
        return [x, y - distance];
      case 'same':
        return [x, y];
    }
  }

  isOutOfBounds(coordinates: Coord) {
    const [x, y] = coordinates;
    return (
      y < 0 ||
      y > this.pixelRefs.current.length ||
      x < 0 ||
      x > this.pixelRefs.current[0].length
    );
  }
}

//   createEvent(args: PutPropsType): CustomEventType {
//     const { piece, focalPoint, conditional, onAfter } =
//       args;
//   }

//   findNieghbors(focalPoint: number[]): PixelType[][] {
//     // take focal point
//     // look at the row above it
//     // through all three of those into an array
//     //
//   }
// }
// returns any ;
// const move(piece: PieceType, start: , ending: , )
// const conditional = () => {}

// }
