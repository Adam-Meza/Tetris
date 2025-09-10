import React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import api, { login, getAll } from '../../api';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../constants';
import { Modal, ModalContent } from '@itwin/itwinui-react';
import {
  currentPlayerAtom,
  gameOverAtom,
  gamesAtom,
  lineCountAtom,
  scoreAtom,
} from '../../atoms';
import { FormInput } from './FormInput';
import { Loading } from '../Loading/Loading';

export const LogInForm = () => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const score = Jotai.useAtomValue(scoreAtom);
  const count = Jotai.useAtomValue(lineCountAtom);
  const setGames = Jotai.useSetAtom(gamesAtom);

  const [isOpen, setIsOpen] = React.useState(true);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const setPlayer = Jotai.useSetAtom(currentPlayerAtom);
  const nav = ReactRouter.useNavigate();

  const [errorMessage, setError] = React.useState('');

  const handleChecks = () => {
    if (!userName) {
      setError('PLEASE ENTER USERNAME');
      return false;
    } else if (!password) {
      setError('PLEASE ENTER PASSWORD');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const handleSubimt = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!handleChecks()) return;

    try {
      const res = await login(userName, password);

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      setPlayer({
        userName: userName,
      });

      if (score > 0) {
        try {
          const res = await api.post('/tetris_api/games/', {
            score: score,
            line_count: count,
          });

          if (res.status === 201) {
            const data = await getAll().then(
              (res) => res.data
            );

            setGames(data);
          } else alert('failed to make ');
        } catch (error) {
          alert(error);
        }
      }

      setLoading(false);
      setGameOver(false);
      setIsOpen(false);
      nav('/play');
    } catch (error) {
      setError('INVALID USERNAME/PASSWORD');
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
        {loading && <Loading />}
        {!loading && (
          <form
            onSubmit={handleSubimt}
            className='log-in-form'
          >
            <span>Log In</span>
            USERNAME
            <FormInput
              name='username'
              value={userName}
              setter={setUserName}
            />
            PASSWORD
            <FormInput
              name='password'
              value={password}
              setter={setPassword}
            />
            <span className='modal-error'>
              {errorMessage ? errorMessage : null}{' '}
            </span>
            <button className='modal-button'>LOG IN</button>
            <a href='/'> back to main</a>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
