import React from 'react';
import api, { register } from '../../api';
import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../constants';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import {
  currentPlayerAtom,
  gameOverAtom,
} from '../../atoms';
import { FormInput } from './FormInput';

export const Register = () => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] =
    React.useState('');
  // SHOULD WE HAVE A LOADING COMPONENT????
  const [passwordMatch, setMatch] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const setCurrentPlayer = Jotai.useSetAtom(
    currentPlayerAtom
  );
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const nav = ReactRouter.useNavigate();

  const handleSubimt = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (password === confirmation) {
      setMatch(true);

      try {
        const res = await register(userName, password);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(
          REFRESH_TOKEN,
          res.data.refresh
        );

        setCurrentPlayer({
          userName: userName,
        });

        setGameOver(false);
        setIsOpen(false);
        nav('/play');
      } catch (error) {
        alert(error);
      }
    } else {
      setMatch(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={''}
      onClose={() => setIsOpen(false)}
      isDismissible={false}
    >
      <ModalContent>
        <form
          onSubmit={handleSubimt}
          className='register-form'
        >
          <span>REGISTER</span>
          USERNAME
          <FormInput
            name='username'
            setter={setUserName}
            value={userName}
          />
          PASSWORD
          <FormInput
            name='password'
            setter={setPassword}
            value={password}
          />
          <FormInput
            name='password-confirmation'
            setter={setConfirmation}
            value={confirmation}
          />
          <span className='password-error'>
            {passwordMatch ? null : 'Passwords Dont Match!'}
          </span>
          <button className='modal-button'>REGISTER</button>
        </form>
      </ModalContent>
    </Modal>
  );
};
