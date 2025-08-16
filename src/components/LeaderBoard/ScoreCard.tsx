import React from 'react';

interface ScoreBoardProps {
  score: number;
  // player: PlayerType;
  medal?: string;
}

export const ScoreCard: React.FC<ScoreBoardProps> = (
  props
) => {
  const { score, medal } = props;

  return (
    <div
      className={medal ? `scorecard ${medal}` : 'scorecard'}
    >
      <span>test</span>
      <span>{score}</span>
      <span>line count: 80</span>
    </div>
  );
};
