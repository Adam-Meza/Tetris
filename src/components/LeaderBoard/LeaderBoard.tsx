import React from 'react';
import { ScoreCard } from './ScoreCard';
import { getAll } from '../../api';

export const LeaderBoard = () => {
  const [games, setGames] = React.useState([]);
  const [content, setContent] = React.useState('');

  const getNotes = () => {
    getAll()
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setGames(data);
      })
      .catch((error) => alert(error));
  };

  React.useEffect(() => {
    getNotes();
  }, []);

  const scores = [
    2234234, 3524542, 4425245, 522342, 523423423, 234324,
    9999999999, 1, 345, 345346,
  ];

  const cards = scores
    .sort()
    .reverse()
    .map((score, i) => {
      const medals = ['gold', 'silver', 'bronze'];

      return (
        <ScoreCard
          key={i}
          score={score}
          medal={i < 3 ? medals[i] : ''}
        />
      );
    });

  return (
    <div className='leader-board'>
      <h2>HIGH SCORES</h2>
      <div className='scorecard-wrapper'>{cards}</div>
    </div>
  );
};
