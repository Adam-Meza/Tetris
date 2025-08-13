import { PixelType } from './Pixel';

type BasicArgsType = {
  piece: PieceType;
  focalPoint: number[];
  conditional?: (args: any) => boolean;
  callback?: (args: CallBackArgs) => any;
};

export type PutPropsType = BasicArgsType;

export type DeleteArgsType = BasicArgsType;

// type CustomEventType = {
//   dataModel: React.MutableRefObject<(PixelType | null)[][]>;
//   neighbors: PixelType[][];
//   piece: PieceType;
//   direction?: Direction;
// };

export type PieceType = {
  shape: (string | null)[][];
  id: string | undefined;
  className: string;
  letter?: string;
};

export type MoveArgsType = BasicArgsType & {
  direction: Direction;
  distance: number;
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
