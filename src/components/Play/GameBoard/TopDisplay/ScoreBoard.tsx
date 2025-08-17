import { useAtomValue } from 'jotai';
import React from 'react';
import { scoreAtom } from '../../../../atoms';

const ScoreBoard = () => {
  const score = useAtomValue(scoreAtom);

  return (
    <span className='score-board-wrapper'>
      <span>score</span>
      <span>{score}</span>
    </span>
  );
};

export default ScoreBoard;
