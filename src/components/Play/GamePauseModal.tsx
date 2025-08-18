import React from 'react';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import { gamePauseAtom } from '../../atoms';
import * as Jotai from 'jotai';

const GamePauseModal = () => {
  const [gamePause, setPause] =
    Jotai.useAtom(gamePauseAtom);

  return (
    <Modal
      isOpen={gamePause}
      title={'Game Paused'}
      isDismissible={false}
    >
      <ModalContent>
        <button
          className='modal-button'
          onClick={() => {
            setPause(false);
          }}
        >
          !!!PLAY!!!
        </button>
      </ModalContent>
    </Modal>
  );
};

export default GamePauseModal;
