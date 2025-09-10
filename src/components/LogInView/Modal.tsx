import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import { Modal } from '@itwin/itwinui-react';
import { gameOverAtom, gamesAtom } from '../../atoms';
import { Loading } from '../Loading/Loading';
import { getAll } from '../../api';

export const GameModal = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const setGames = Jotai.useSetAtom(gamesAtom);
  const setGameOver = Jotai.useSetAtom(gameOverAtom);
  const nav = ReactRouter.useNavigate();

  const getGames = async () => {
    try {
      const res = await getAll();
      setGames(res.data);
      setLoading(false);
    } catch {}
  };

  React.useEffect(() => {
    localStorage.clear();
    getGames();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      title={''}
      onClose={() => setIsOpen(false)}
      isDismissible={false}
    >
      {loading && <Loading />}
      {!loading && (
        <div className='modal-wrapper'>
          <span>!!!TETRIS!!!</span>
          <button
            className='modal-button'
            onClick={() => {
              nav('/log-in');
              setGameOver(false);
              setIsOpen(false);
            }}
          >
            Log In
          </button>
          or
          <button
            className='modal-button'
            onClick={() => {
              nav('/register');
            }}
          >
            REGISTER
          </button>
          or
          <button
            className='modal-button'
            onClick={() => {
              nav('/play');
              setGameOver(false);
              setIsOpen(false);
            }}
          >
            Play as Guest
          </button>
        </div>
      )}
    </Modal>
  );
};
