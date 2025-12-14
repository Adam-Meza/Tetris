import type {
  PutPropsType,
  DeleteArgsType,
  MoveArgs,
  Direction,
  Coord,
  ShapeMatrix,
  PixelType,
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
    const { shape } = piece;

    if (
      conditional &&
      !conditional({ ...args, pixelRefs: this.pixelRefs })
    )
      return;

    const pWidth = shape[0].length;
    const pHeight = shape.length;

    const [x, y] = focalPoint;

    for (let i = 0; i < pHeight; i++) {
      for (let j = 0; j < pWidth; j++) {
        if (shape[i][j]) {
          const targetX = x + j;
          const targetY = y + i;
          const pixel =
            this.pixelRefs.current[targetY][targetX];

          if (pixel) this.clearPixel(pixel);
        }
      }
    }

    onAfter?.({
      piece: piece,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
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
      ...args,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
  }

  move(args: MoveArgs): void {
    const {
      piece,
      direction,
      distance,
      focalPoint,
      conditional,
      onAfter,
    } = args;

    const [x, y] = focalPoint;

    if (
      conditional &&
      !conditional({ ...args, pixelRefs: this.pixelRefs })
    )
      return;

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
      ...args,
      pixelRefs: this.pixelRefs,
      focalPoint: this.focalPoint,
    });
  }

  rotate(args: PutPropsType): void {
    const { piece, focalPoint, conditional, onAfter } =
      args;
    const { shape } = piece;

    const rotateShapeClockwise = (shape: ShapeMatrix) => {
      const transposedShape = shape[0]
        .map((_, colIndex) =>
          shape.map((row) => row[colIndex])
        )
        .map((row) => row.reverse());

      return transposedShape;
    };

    const rotated = {
      ...piece,
      shape: rotateShapeClockwise(shape),
    };

    if (
      conditional &&
      !conditional({
        piece: rotated,
        focalPoint,
        pixelRefs: this.pixelRefs,
      })
    )
      return;

    const tetrominoLength = rotated.shape[0].length;

    if (
      this.isOutOfBounds([
        tetrominoLength + focalPoint[0],
        focalPoint[1],
      ])
    )
      return;

    this.delete({
      piece: piece,
      focalPoint: focalPoint,
    });

    this.put({ piece: rotated, focalPoint: focalPoint });

    onAfter?.({
      piece: rotated,
      focalPoint: this.focalPoint,
      pixelRefs: this.pixelRefs,
    });
  }

  clearBoard(): void {
    const height = this.pixelRefs.current.length;
    const width = this.pixelRefs.current[0].length;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const pixel = this.pixelRefs.current[i][j];

        if (pixel?.id) {
          this.clearPixel(pixel);
        }
      }
    }
  }

  private addPixel(
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

  private clearPixel(pixel: PixelType): void {
    const spanRef = pixel.html;

    if (!spanRef?.current) return;

    const classList =
      spanRef.current?.classList.value.split(' ');

    const baseClassList = pixel.baseClass?.split(' ');

    if (classList && baseClassList) {
      for (let i = 0; i < classList.length; i++) {
        if (!baseClassList.includes(classList[i])) {
          spanRef.current.classList.remove(classList[i]);
          pixel.id = pixel.baseID;
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
        return [x, y + distance] as Coord;
      case 'left':
        return [x - distance, y] as Coord;
      case 'right':
        return [x + distance, y] as Coord;
      case 'up':
        return [x, y - distance] as Coord;
      case 'same':
        return [x, y] as Coord;
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
