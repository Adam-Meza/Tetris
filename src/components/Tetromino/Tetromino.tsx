export interface TetrominoType {
  shape:
    | [string[], (string | null)[]]
    | (string | null)[][];
  id: string;
}

const t_block: TetrominoType = {
  id: 't',
  shape: [
    ['t', 't', 't'],
    [null, 't', null],
  ],
};

const o_block = {
  id: 'o',
  shape: [
    ['o', 'o'],
    ['o', 'o'],
  ],
};

const l_block = {
  id: 'l',
  shape: [
    [null, 'l'],
    [null, 'l'],
    ['l', 'l'],
  ],
};

const j_block = {
  id: 'j',
  shape: [
    ['l', null],
    ['l', null],
    ['l', 'l'],
  ],
};

const i_block = {
  id: 'i',
  shape: [['i'], ['i'], ['i'], ['i']],
};

const s_block = {
  id: 's',
  shape: [
    [null, 's', 's'],
    ['s', 's', null],
  ],
};

const z_block = {
  id: 'z',
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
