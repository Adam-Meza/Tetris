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
      title={''}
      isDismissible={false}
    >
      <ModalContent>
        <div className='modal-wrapper'>
          <h2>GAME PAUSED</h2>
          <button
            className='modal-button'
            onClick={() => {
              setPause(false);
            }}
          >
            !!!!! PLAY !!!!!
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default GamePauseModal;
