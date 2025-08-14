import * as React from 'react';
import {
  Modal,
  ModalContent,
  ModalButtonBar,
} from '@itwin/itwinui-react';

type ModalProps = {
  startNewGame: () => void;
};
export const GameModal = ({ startNewGame }: ModalProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

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
            startNewGame();
            setIsOpen(false);
          }}
        >
          Lets Play
        </button>
      </ModalButtonBar>
    </Modal>
  );
};
