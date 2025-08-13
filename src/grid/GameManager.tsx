import { PixelType } from './Pixel';
import { getLetter } from '../utilities';
import { TetrominoType } from '../components/Tetromino/Tetromino';

export class GameManager {
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint: React.MutableRefObject<number[]>;

  constructor(
    pixelRefs: React.MutableRefObject<
      (PixelType | null)[][]
    >,
    focalPoint: React.MutableRefObject<number[]>
  ) {
    this.pixelRefs = pixelRefs;
    this.focalPoint = focalPoint;
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

  delete(args: PutPropsType) {
    const { piece, focalPoint } = args;
    const { shape, className } = piece;

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
  }

  private addPixel(
    piece: PieceType,
    coordinates: number[]
  ) {
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

  private removePixel(pixel: PixelType, className: string) {
    const spanRef = pixel.html;

    if (!spanRef?.current) return false;
    spanRef.current.classList.remove(className);
    pixel.id = undefined;
  }

  playerMove(args: MoveArgsType) {
    const {
      piece,
      direction,
      distance,
      conditional,
      callback,
    } = args;
    const [x, y] = this.focalPoint.current;

    if (conditional && !conditional(direction)) return;

    this.delete({
      piece: piece,
      focalPoint: [x, y],
    });

    const [targetX, targetY] = this.makeNewCoordinates(
      x,
      y,
      direction,
      distance
    );

    this.focalPoint.current = [targetX, targetY];

    this.put({
      piece: piece,
      focalPoint: [targetX, targetY],
    });

    if (callback) {
      callback({
        piece: piece,
        pixelRefs: this.pixelRefs,
        focalPoint: this.focalPoint,
      });
    }
  }

  move(args: PutPropsType) {}

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

  makeNewCoordinates(
    x: number,
    y: number,
    direction: Direction,
    distance: number
  ) {
    let newX = x;
    let newY = y;

    switch (direction) {
      case 'down':
        newY += distance;
        break;
      case 'left':
        newX -= distance;
        break;
      case 'right':
        newX += distance;
        break;
      case 'up':
        newY -= distance;
    }

    return [newX, newY];
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

export type DeleteArgsType = {
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
  piece: PieceType;
  direction?: Direction;
};

export type PieceType = {
  shape: (string | null)[][];
  id: string | undefined;
  className: string;
  letter?: string;
};

export type MoveArgsType = {
  piece: PieceType | TetrominoType;
  direction: Direction;
  distance: number;
  focalPoint?: React.MutableRefObject<number[]>;
  conditional?: (args: any) => boolean;
  callback?: (args: CallBackArgs, customArgs?: any) => any;
};

export type CallBackArgs = {
  piece: PieceType;
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint: React.MutableRefObject<number[]>;
};

export type Direction =
  | 'down'
  | 'left'
  | 'right'
  | 'same'
  | 'up';
