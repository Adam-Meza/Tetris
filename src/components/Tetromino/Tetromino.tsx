import { PieceType } from '../../grid/GameManager';

type TetrominoPrimative = {
  shape: (string | null)[][];
  letter: string;
};

export type TetrominoType = PieceType & {
  shape: (string | null)[][];
  className: string;
};

const t_block: TetrominoPrimative = {
  letter: 't',
  shape: [
    ['t', 't', 't'],
    [null, 't', null],
  ],
};

const o_block: TetrominoPrimative = {
  letter: 'o',
  shape: [
    ['o', 'o'],
    ['o', 'o'],
  ],
};

const j_block: TetrominoPrimative = {
  letter: 'j',
  shape: [
    [null, 'j'],
    [null, 'j'],
    ['j', 'j'],
  ],
};

const l_block: TetrominoPrimative = {
  letter: 'l',
  shape: [
    ['l', null],
    ['l', null],
    ['l', 'l'],
  ],
};

const i_block: TetrominoPrimative = {
  letter: 'i',
  shape: [['i'], ['i'], ['i'], ['i']],
};

const s_block: TetrominoPrimative = {
  letter: 's',
  shape: [
    [null, 's', 's'],
    ['s', 's', null],
  ],
};

const z_block: TetrominoPrimative = {
  letter: 'z',
  shape: [
    ['z', 'z', null],
    [null, 'z', 'z'],
  ],
};

export const blocks = [
  t_block,
  z_block,
  o_block,
  j_block,
  l_block,
  s_block,
  z_block,
  i_block,
];
