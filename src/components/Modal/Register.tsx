import React from 'react';
import api, { getAll, register } from '../../api';
import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
// import {
//   ACCESS_TOKEN,
//   REFRESH_TOKEN,
// } from '../../constants';
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
  const [username, setUsername] = React.useState('');
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
    if (0 < username.length && username.length < 3) {
      setError('USERnAME MUST BE AT LEAST 3 LETTERS');
      return false;
    } else if (username.length > 8) {
      setError('USERnAME MUST BE LESS THAN 8 LETTERS');
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
        const post = await api.post(
          'tetris_api/user/register/',
          { username, password }
        );

        console.log(post);
        setCurrentPlayer({
          userName: username,
        });

        nav('/log-in');

        setGameOver(false);
        setIsOpen(false);
      } catch (error) {
        alert(error);
      }
    }
  };

  const resetModal = () => {
    setUsername('');
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
            setter={setUsername}
            value={username}
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
