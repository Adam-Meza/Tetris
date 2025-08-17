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
  endGame: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = (
  props
) => {
  const { startNewGame, endGame } = props;
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
    if (gameOver && score > 0) handleSubimt();
  }, [gameOver]);

  const nav = ReactRouter.useNavigate();

  const handleSubimt = async () => {
    try {
      api
        .post('/tetris_api/games/', {
          score: score,
          line_count: count,
        })
        .then((res) => {
          if (res.status === 201) {
            getAll()
              .then((res) => res.data)
              .then((data) => {
                setGames(data);
              });
          } else alert('failed to make ');
        });
    } catch (error) {
      alert(error);
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
          {currentPlayer.userName === 'GUEST' ? (
            <>
              <button
                className='modal-button'
                onClick={() => nav('/log-in')}
              >
                LOG IN TO SAVE GAME
              </button>
              <span>or</span>
            </>
          ) : null}
          <button
            className='modal-button'
            onClick={() => {
              endGame();
              startNewGame();
            }}
          >
            ???PLAY AGAIN???
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default GameOverModal;
