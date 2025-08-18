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
        const res = await register(userName, password);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(
          REFRESH_TOKEN,
          res.data.refresh
        );

        // This handles the "Log In To save Game Data" use case
        // if there is a score..
        if (score > 0) {
          // we try to post it
          try {
            api
              .post('/tetris_api/games/', {
                score: score,
                line_count: count,
              })
              .then((res) => {
                // if it works we update the board. we do this other places? maybe we can combine them...
                if (res.status === 201) {
                  getAll()
                    .then((res) => res.data)
                    .then((data) => {
                      setGames(data);
                    });
                  // better ways to handle than alert
                } else alert('failed to make ');
              });
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
        nav('/play');
      } catch (error) {
        alert(error);
      }
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
          <span className='password-error'>
            {errorMessage ? errorMessage : null}
          </span>
          <button className='modal-button'>REGISTER</button>
        </form>
      </ModalContent>
    </Modal>
  );
};
