import React from 'react';
import api, { getAll, register } from '../../api';
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
  gamesAtom,
  lineCountAtom,
  scoreAtom,
} from '../../atoms';
import { FormInput } from './FormInput';

export const Register = () => {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmation, setConfirmation] =
    React.useState('');
  const [errorMessage, setError] = React.useState('');
  // SHOULD WE HAVE A LOADING COMPONENT????
  //   const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const setCurrentPlayer = Jotai.useSetAtom(
    currentPlayerAtom
  );
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const nav = ReactRouter.useNavigate();
  const score = Jotai.useAtomValue(scoreAtom);
  const count = Jotai.useAtomValue(lineCountAtom);
  const setGames = Jotai.useSetAtom(gamesAtom);

  const handleChecks = () => {
    if (0 < userName.length && userName.length < 3) {
      setError('USERNAME MUST BE AT LEAST 3 LETTERS');
      return false;
    } else if (userName.length > 8) {
      setError('USERNAME MUST BE LESS THAN 8 LETTERS');
      return false;
    } else if (
      password &&
      confirmation &&
      password !== confirmation
    ) {
      setError('PASSWORDS MUST MATCH');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const handleSubimt = async (e: React.FormEvent) => {
    // setLoading(true);
    e.preventDefault();

    if (handleChecks()) {
      try {
        const post = await register(userName, password);
        nav('/log-in');

        if (score > 0) {
          try {
            const res = await api.post(
              '/tetris_api/games/',
              {
                score: score,
                line_count: count,
              }
            );

            if (res.status === 201) {
              const data = await getAll().then(
                (res) => res.data
              );

              setGames(data);

              // better ways to handle than alert!!
            } else alert('failed to make ');

            //
          } catch (error) {
            alert(error);
          }
        }

        setCurrentPlayer({
          userName: userName,
        });

        setGameOver(false);
        setIsOpen(false);
      } catch (error) {
        alert(error);
      }
    }
  };

  const resetModal = () => {
    setUserName('');
    setPassword('');
    setConfirmation('');
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={''}
      onClose={() => resetModal()}
      isDismissible={false}
    >
      <ModalContent>
        <form
          onChange={handleChecks}
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
          <span className='modal-error'>
            {errorMessage ? errorMessage : null}
          </span>
          <button className='modal-button'>REGISTER</button>
          <a href='/'> back to main</a>
        </form>
      </ModalContent>
    </Modal>
  );
};
