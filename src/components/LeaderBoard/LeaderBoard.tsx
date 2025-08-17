import React from 'react';
import { ScoreCard } from './ScoreCard';
import { getAll } from '../../api';
import { gamesAtom } from '../../atoms';
import * as Jotai from 'jotai';

export const LeaderBoard = () => {
  const [games, setGames] = Jotai.useAtom(gamesAtom);
  const [cards, setCards] = React.useState([]);

  const getNotes = () => {
    getAll()
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setGames(data);

        const scoreCards = data
          .sort()
          .reverse()
          .map((game: any, i: number) => {
            const { owner, line_count, score } = game;

            const medals = ['gold', 'silver', 'bronze'];

            return (
              <ScoreCard
                key={i}
                score={score}
                lineCount={line_count}
                name={owner.username}
                medal={i < 3 ? medals[i] : ''}
              />
            );
          })
          .slice(0, 10);

        setCards(scoreCards);
      })
      .catch((error) => alert(error));
  };

  React.useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className='leader-board'>
      <h2>HIGH SCORES</h2>
      <div className='scorecard-wrapper'>{cards}</div>
    </div>
  );
};
