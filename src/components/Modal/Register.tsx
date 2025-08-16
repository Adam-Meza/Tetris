import React from 'react';
import api, { register } from '../../api';
import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../constants';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import { gameOverAtom } from '../../atoms';

//@ts-ignore
export const Register = ({ method }) => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] =
    React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const nav = ReactRouter.useNavigate();

  const route = 'tetris_api/user/register';

  const handleSubimt = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (password === confirmation) {
      try {
        const res = await register(userName, password);

        console.log(res);

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(
          REFRESH_TOKEN,
          res.data.refresh
        );
        setGameOver(false);
        setIsOpen(false);
        nav('/play');
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('they dont match');
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
          <input
            autoComplete='false'
            name='password-confirmation'
            className='form-input'
            type='text'
            value={confirmation}
            //@ts-ignore
            onChange={(e: KeyboardEvent<Element>) =>
              setConfirmation(e.target.value)
            }
            onSubmit={handleSubimt}
          />
          <button
            className='modal-button'
            onClick={handleSubimt}
          >
            REGISTER
          </button>
        </form>
      </ModalContent>
    </Modal>
  );
};
