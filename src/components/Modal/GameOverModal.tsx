import * as React from 'react';
import * as Jotai from 'jotai';
import * as ReactRouter from 'react-router-dom';
import api from '../../api';
import { getAll } from '../../api';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import {
  currentPlayerAtom,
  gameOverAtom,
  gamesAtom,
  scoreAtom,
  lineCountAtom,
} from '../../atoms';

interface GameOverModalProps {
  startNewGame: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = (
  props
) => {
  const { startNewGame } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [gameOver, setGameOver] =
    Jotai.useAtom(gameOverAtom);
  const setGames = Jotai.useSetAtom(gamesAtom);
  const score = Jotai.useAtomValue(scoreAtom);
  const count = Jotai.useAtomValue(lineCountAtom);
  const currentPlayer = Jotai.useAtomValue(
    currentPlayerAtom
  );

  React.useEffect(() => {
    if (gameOver) handleSubimt();
  });

  const nav = ReactRouter.useNavigate();

  // if there's no player we offer to make one
  // we form the new game no matter what
  /*
   */

  const newGame = {
    score: score,
    line_count: count,
  };

  const getNotes = () => {
    console.log('running fetch in leaderboard');

    getAll()
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        setGames(data);
      })
      .catch((error) => alert(error));
  };

  const handleSubimt = async () => {
    try {
      api
        .post('/tetris_api/games/', newGame)
        .then((res) => {
          if (res.status === 201) alert('Game  Created!');
          else alert('failed to make ');
        });
    } catch (error) {
      alert(error);
      getNotes();
    }
  };

  return (
    <Modal
      isOpen={gameOver}
      title={''}
      isDismissible={false}
    >
      <ModalContent>
        <div className='modal-wrapper'>
          <h2>GAME OVER!</h2>
          <span>{score}</span>
          <span>line count: {count}</span>

          <button
            className='modal-button'
            onClick={() => {
              startNewGame();
            }}
          >
            Play Again?
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default GameOverModal;
