import React from 'react';
import api, { login } from '../../api';
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

//@ts-ignore
export const LogInForm = ({ method }) => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const setPlayer = Jotai.useSetAtom(currentPlayerAtom);
  const nav = ReactRouter.useNavigate();

  const handleSubimt = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await login(userName, password);

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      //   setPlayer({
      //     username: userName,
      //   });

      setGameOver(false);
      setIsOpen(false);
      nav('/play');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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
          className='log-in-form'
        >
          <span>Log In</span>
          USERNAME
          <input
            autoComplete='false'
            name='username'
            className='form-input'
            type='text'
            value={userName}
            //@ts-ignore
            onChange={(e: KeyboardEvent<Element>) =>
              setUserName(e.target.value)
            }
          />
          PASSWORD
          <input
            autoComplete='off'
            name='password'
            className='form-input'
            type='password'
            value={password}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement>
            ) => setPassword(e.target.value)}
          />
          <button className='modal-button'>LOG IN</button>
        </form>
      </ModalContent>
    </Modal>
  );
};
