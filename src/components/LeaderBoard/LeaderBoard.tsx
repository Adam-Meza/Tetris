import React from 'react';
import { ScoreCard } from './ScoreCard';

export const LeaderBoard = () => {
  const scores = [
    2234234, 3524542, 4425245, 522342, 523423423, 234324,
    9999999999, 1,
  ];
  const cards = scores
    .sort()
    .reverse()
    .map((score) => <ScoreCard score={score} />);

  return (
    <div className='leader-board'>
      <h2>HIGH SCORES</h2>
      <div className='scorecard-wrapper'>{cards}</div>
    </div>
  );
};
