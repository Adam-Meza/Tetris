import * as React from 'react';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import * as Jotai from 'jotai';
import { gameOverAtom, scoreAtom } from '../../atoms';
import * as ReactRouter from 'react-router-dom';

const GameOverModal = (props) => {
  const { startNewGame } = props;
  const [isOpen, setIsOpen] = React.useState(true);
  const [gameOver, setGameOver] =
    Jotai.useAtom(gameOverAtom);
  const score = Jotai.useAtomValue(scoreAtom);

  const nav = ReactRouter.useNavigate();

  // if there's no player we offer to make one
  // we form the new game no matter what
  /*
  
  const newGame = {
    player: {
        id: string,
        name: string,
    },
    score: number,
    lineCount: number,
  }
  */
  return (
    <Modal
      isOpen={gameOver}
      title={''}
      isDismissible={false}
      onClose={() => {}}
    >
      <ModalContent>
        <div className='modal-wrapper'>
          <h2>GAME OVER!</h2>
          <span>you scored</span>
          <span>{score}</span>

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
