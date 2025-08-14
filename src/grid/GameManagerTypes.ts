import { PixelType } from './Pixel';

export type Coord = readonly [number, number];

export type Direction =
  | 'down'
  | 'left'
  | 'right'
  | 'same'
  | 'up';

export type ShapeMatrix = ReadonlyArray<
  ReadonlyArray<string | null>
>;

type BasicActionArgs = {
  piece: PieceType;
  focalPoint: Coord;
  conditional?: (args: any) => boolean;
  onAfter?: (args: CallbackPayload) => any;
};

export type PutPropsType = BasicActionArgs;

export type DeleteArgsType = BasicActionArgs;

// type CustomEventType = {
//   dataModel: React.MutableRefObject<(PixelType | null)[][]>;
//   neighbors: PixelType[][];
//   piece: PieceType;
//   direction?: Direction;
// };

export type PieceType = {
  shape: ShapeMatrix;
  id: string | undefined;
  className: string;
  letter?: string;
};

export type MoveArgs = BasicActionArgs & {
  direction: Direction;
  distance: number;
};

export type CallbackPayload = {
  piece: PieceType;
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  focalPoint: React.MutableRefObject<Coord>;
};
