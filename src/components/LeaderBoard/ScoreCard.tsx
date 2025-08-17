import React from 'react';

interface ScoreBoardProps {
  score: number;
  name: string;
  lineCount: number;
  medal?: string;
}

export const ScoreCard: React.FC<ScoreBoardProps> = (
  props
) => {
  const { score, name, lineCount, medal } = props;

  return (
    <div
      className={medal ? `scorecard ${medal}` : 'scorecard'}
    >
      <span>{name}</span>
      <span>{score}</span>
      <span>line count: {lineCount}</span>
    </div>
  );
};
