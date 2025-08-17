import React from 'react';
import { ScoreCard } from './ScoreCard';
import { getAll } from '../../api';
import { gamesAtom } from '../../atoms';
import * as Jotai from 'jotai';

type GameType = {
  line_count: number;
  score: number;
  owner: {
    ownener_id: string;
  };
};

export const LeaderBoard = () => {
  const [games, setGames] = Jotai.useAtom(gamesAtom);
  const [cards, setCards] = React.useState([]);

  const getGames = () => {
    getAll()
      .then((res) => res.data)
      .then((data) => {
        setGames(data);
      })
      .catch((error) => {
        console.log('stemmed from getGames in LeaderBoard');
        alert(error);
      });
  };

  React.useEffect(() => {
    getGames();
  }, []);

  React.useEffect(() => {
    const scoreCards = games
      .sort((a: GameType, b: GameType) => a.score - b.score)
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
  }, [games]);

  return (
    <div className='leader-board'>
      <h2>HIGH SCORES</h2>
      <div className='scorecard-wrapper'>{cards}</div>
    </div>
  );
};
