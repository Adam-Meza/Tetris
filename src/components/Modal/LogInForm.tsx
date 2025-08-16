import React from 'react';
import api, { login } from '../../api';
import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../constants';
import {
  Modal,
  ModalContent,
  ModalButtonBar,
} from '@itwin/itwinui-react';
import { gameOverAtom } from '../../atoms';

//@ts-ignore
export const LogInForm = ({ method }) => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const nav = ReactRouter.useNavigate();

  const route = 'tetris_api/token/';

  const handleSubimt = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await login(userName, password);
      console.log(res.data);

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
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
            autoComplete='false'
            name='password'
            className='form-input'
            type='text'
            value={password}
            //@ts-ignore
            onChange={(e: KeyboardEvent<Element>) =>
              setPassword(e.target.value)
            }
            onSubmit={handleSubimt}
          />
          <button
            className='modal-button'
            onClick={handleSubimt}
          >
            LOG IN
          </button>
        </form>
      </ModalContent>
    </Modal>
  );
};
