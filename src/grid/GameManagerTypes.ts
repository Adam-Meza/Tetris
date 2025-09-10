/**
 * Runtime shape stored in the `pixelRefs` matrix.
 *
 * `GameManager` mutates these entries imperatively to paint/erase blocks
 * without triggering React re-renders of the entire grid.
 */
export type PixelType = {
  /**
   * Column index (0-based).
   */
  x: number;
  /**
   * Row index (0-based).
   */
  y: number;
  /**
   * Identifier of the occupying piece, if any.
   *
   * Used to determine ownership and collisions. `undefined` means empty cell.
   */
  id?: string | undefined;
  /**
   * Optional class name associated with the current occupant.
   *
   * Usually redundant because `GameManager` toggles classes on the DOM node,
   * but may be useful as a cached value for debugging/logic.
   */
  baseClass?: string;
  /**
   *
   *
   */
  baseID?: string;
  /**
   * Ref to the underlying `<span>` element for imperative class toggling.
   *
   * `GameManager.addPixel/removePixel` rely on this to mutate the DOM.
   */
  html?: React.RefObject<HTMLSpanElement>;
};

/**
 * Immutable grid coordinate tuple `[x, y]`.
 * Used to access various verticies in `PixelRefs`.
 * `x` = column (0-based), `y` = row (0-based).
 */
export type Coord = readonly [number, number];

/**
 * Cardinal movement directions supported by `GameManager`.
 */
export type Direction =
  | 'down'
  | 'left'
  | 'right'
  | 'same'
  | 'up';

/**
 * Immutable 2D matrix representing a `piece.shape`.
 *
 * - `string | number` = filled cell
 * - `null` = empty cell
 */
export type ShapeMatrix = ReadonlyArray<
  ReadonlyArray<(string | number) | null>
>;

/**
 * Common args contract shared by all action operations.
 *
 * Every action method accepts a piece and a focal point, and provides two optional callback parameters:
 *
 * - `conditional` — guard hook to decide if the action should run - returns undefined.
 * - `onAfter` — callback fired after the action completes
 *
 * Note: `conditional` and `onAfter` receive a `CallbackPayload`
 * at runtime, which provides all relevent data.
 */
type BasicActionArgs = {
  /**
   * Piece to act upon (paint/move/delete).
   */
  piece: PieceType;
  /**
   * Origin coordinate for the operation (top-left of the piece).
   */
  focalPoint: Coord;
  /**
   * Optional guard hook. Return `false` to abort the action.
   * Receives the full runtime payload for context.
   */
  conditional?: (args: any) => boolean;
  /**
   * Optional callback invoked after the action completes.
   * Receives the full runtime payload for side effects (e.g., scoring).
   */
  onAfter?: (args: CallbackPayload) => void;
};

/**
 * Arguments for `GameManager.put` (place a piece).
 */
export type PutPropsType = BasicActionArgs;

/**
 * Arguments for `GameManager.delete` (erase a piece).
 */
export type DeleteArgsType = BasicActionArgs;

// type CustomEventType = {
//   dataModel: React.MutableRefObject<(PixelType | null)[][]>;
//   neighbors: PixelType[][];
//   piece: PieceType;
//   direction?: Direction;
// };

/**
 * Runtime description of a placeable piece.
 */
export type PieceType = {
  /**
   * 2D occupancy grid describing the shape.
   */
  shape: ShapeMatrix;
  /**
   * Unique identifier for this piece instance (used for ownership/collision).
   */
  id: string | undefined;
  /**
   * CSS class applied when painting pixels for this piece.
   */
  className: string;
  /**
   * Optional mnemonic/label (e.g., `"T"`, `"L"`) for UI/class derivation.
   */
  letter?: string;
};

/**
 * Arguments for `GameManager.move` and `GameManager.playerMove`.
 * Extends the base action args with movement details.
 */
export type MoveArgs = BasicActionArgs & {
  /**
   * Direction to move the piece.
   */
  direction: Direction;
  /**
   * Number of grid cells to move.
   */
  distance: number;
};

/**
 * Payload object passed to `conditional` and `onAfter`
 * for every action operation.
 */
export type CallbackPayload = {
  /**
   * The piece being acted upon.
   */
  piece: PieceType;
  /**
   * Live 2D matrix of pixel refs backed by the `Grid`.
   */
  pixelRefs: React.MutableRefObject<(PixelType | null)[][]>;
  /**
   * Mutable focal point ref used as the piece's origin.
   */
  focalPoint: React.MutableRefObject<Coord> | Coord;
  /**
   * Direction involved in the action (if applicable, e.g., move).
   */
  direction?: Direction;
};

export type PlayerMoveArgs = {};
