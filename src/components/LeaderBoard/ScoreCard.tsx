import React from 'react';

interface ScoreBoardProps {
  score: number;
  // player: PlayerType;
}

export const ScoreCard: React.FC<ScoreBoardProps> = (
  props
) => {
  const { score } = props;

  return (
    <div className='scorecard'>
      <span>test</span>
      <span>{score}</span>
    </div>
  );
};
