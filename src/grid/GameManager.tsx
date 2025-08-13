import { PixelType } from './Pixel';
import { getLetter } from '../utilities';

export class GameManager {
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint:
    | React.MutableRefObject<[number, number]>
    | undefined;

  constructor(
    pixelRefs: React.MutableRefObject<
      (PixelType | null)[][]
    >,
    focalPoint?:
      | React.MutableRefObject<[number, number]>
      | undefined
  ) {
    this.pixelRefs = pixelRefs;
    this.focalPoint = focalPoint || undefined;
  }

  put(args: PutPropsType): any {
    const { piece, focalPoint } = args;
    const { shape } = piece;

    const width = shape[0].length;
    const height = shape.length;

    const [x, y] = focalPoint;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (shape[i][j]) {
          const coordinates = [x + j, y + i];
          this.addPixel(piece, coordinates);
        }
      }
    }
  }

  addPixel(piece: PieceType, coordinates: number[]) {
    const { className, id } = piece;
    const [x, y] = coordinates;
    const dataRef = this.pixelRefs.current[y][
      x
    ] as PixelType;

    const spanRef = dataRef.html;

    if (!spanRef?.current) return false;

    spanRef.current?.classList.add(className);
    dataRef.id = id;
  }

  removePixel(pixel: PixelType, className: string) {
    const spanRef = pixel.html;

    if (!spanRef?.current) return false;
    spanRef.current.classList.remove(className);
    pixel.id = undefined;
  }

  clearBoard() {
    const height = this.pixelRefs.current.length;
    const width = this.pixelRefs.current[0].length;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const pixel = this.pixelRefs.current[i][j];

        if (pixel?.id) {
          const className = `${getLetter(pixel.id)}-block`;
          this.removePixel(pixel, className);
        }
      }
    }
  }
}

//   createEvent(args: PutPropsType): CustomEventType {
//     const { piece, focalPoint, conditional, callback } =
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

export type PutPropsType = {
  piece: PieceType;
  focalPoint: number[];
  conditional?: () => boolean; // ran before method. method will only run if the conditional returns true
  callback?: (customEvent: CustomEventType) => any;
  // return value of method comes from their
};

type CustomEventType = {
  dataModel: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint: PixelType;
  neighbors: PixelType[][];
};

export type PieceType = {
  shape: (string | null)[][];
  id: string | undefined;
  className: string;
  letter?: string;
};
