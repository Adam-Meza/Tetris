export type TetrominoType = {
  shape:
    | [string[], (string | null)[]]
    | (string | null)[][];
  letter: string;
  id?: string;
};

const t_block: TetrominoType = {
  letter: 't',
  shape: [
    ['t', 't', 't'],
    [null, 't', null],
  ],
};

const o_block: TetrominoType = {
  letter: 'o',
  shape: [
    ['o', 'o'],
    ['o', 'o'],
  ],
};

const j_block: TetrominoType = {
  letter: 'j',
  shape: [
    [null, 'j'],
    [null, 'j'],
    ['j', 'j'],
  ],
};

const l_block: TetrominoType = {
  letter: 'l',
  shape: [
    ['l', null],
    ['l', null],
    ['l', 'l'],
  ],
};

const i_block: TetrominoType = {
  letter: 'i',
  shape: [['i'], ['i'], ['i'], ['i']],
};

const s_block: TetrominoType = {
  letter: 's',
  shape: [
    [null, 's', 's'],
    ['s', 's', null],
  ],
};

const z_block: TetrominoType = {
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
