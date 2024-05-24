import { blocks } from './block';

export class Tetromino {
  shape:
    | [string[], (string | null)[]]
    | (string | null)[][];
  id?: string;
  letter: string;

  constructor() {
    const block = this.pickRandomPiece();
    this.shape = block.shape;
    this.id = block.id;
    this.letter = block.letter;
  }

  pickRandomPiece(): {
    shape:
      | [string[], (string | null)[]]
      | (string | null)[][];
    id: string;
    letter: string;
  } {
    const block =
      blocks[Math.floor(Math.random() * blocks.length)];
    return {
      id: block.letter + Date.now(),
      shape: block.shape,
      letter: block.letter,
    };
  }
}
