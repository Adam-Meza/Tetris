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
      title={'Modal'}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquip
        ex ea commodo consequat.
      </ModalContent>
      <ModalButtonBar>
        <button
          className='new-game-button'
          onClick={() => {
            startNewGame();
            setIsOpen(false);
          }}
        >
          Primary
        </button>
      </ModalButtonBar>
    </Modal>
  );
};
