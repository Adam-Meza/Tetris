import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalButtonBar,
} from '@itwin/itwinui-react';
import * as Jotai from 'jotai';
import { gameOverAtom } from '../../atoms';
import * as ReactRouter from 'react-router-dom';

export const GameModal = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const nav = ReactRouter.useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      title={''}
      onClose={() => setIsOpen(false)}
      isDismissible={false}
    >
      <ModalContent>
        <div id='modal'>
          <h2>!!!TETRIS!!!</h2>
          You know it!
          <br />
          You LOVE it!
        </div>
      </ModalContent>
      <ModalButtonBar>
        <button
          className='new-game-button'
          onClick={() => {
            nav('/play');
            setGameOver(false);
            setIsOpen(false);
          }}
        >
          Lets Play
        </button>
      </ModalButtonBar>
    </Modal>
  );
};
