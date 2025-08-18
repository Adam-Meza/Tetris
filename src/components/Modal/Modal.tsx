import * as React from 'react';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import * as Jotai from 'jotai';
import { gameOverAtom, scoreAtom } from '../../atoms';
import * as ReactRouter from 'react-router-dom';

export const GameModal = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const score = Jotai.useAtomValue(scoreAtom);
  const nav = ReactRouter.useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      title={''}
      onClose={() => setIsOpen(false)}
      isDismissible={false}
    >
      <div className='modal-wrapper'>
        <ModalContent>
          <span>!!!TETRIS!!!</span>
        </ModalContent>
        <button
          className='modal-button'
          onClick={() => {
            nav('/log-in');
            setGameOver(false);
            setIsOpen(false);
          }}
        >
          Log In
        </button>
        or
        <button
          className='modal-button'
          onClick={() => {
            nav('/register');
            if (score > 0) {
            }
          }}
        >
          REGISTER
        </button>
        or
        <button
          className='modal-button'
          onClick={() => {
            nav('/play');
            setGameOver(false);
            setIsOpen(false);
          }}
        >
          Play as Guest
        </button>
      </div>
    </Modal>
  );
};
