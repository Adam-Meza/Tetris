import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import { currentPlayerAtom } from '../../atoms';

export const Header = () => {
  const nav = ReactRouter.useNavigate();
  const location = ReactRouter.useLocation();

  const [currentPlayer, setCurrentPlayer] = Jotai.useAtom(
    currentPlayerAtom
  );

  return (
    <header id='header'>
      <h1>
        <span>T</span>
        <span>E</span>
        <span>T</span>
        <span>R</span>
        <span>I</span>
        <span>S</span>
        <span>!</span>
      </h1>

      <nav className='nav button-container'>
        {location.pathname.includes('play') ? (
          <button onClick={() => nav('/about')}>
            ABOUT
          </button>
        ) : (
          <button onClick={() => nav('/play')}>PLAY</button>
        )}

        <button
          onClick={() => {
            if (currentPlayer.userName !== 'GUEST')
              localStorage.clear();

            setCurrentPlayer({
              userName: 'GUEST',
            });
            nav('/');
          }}
        >
          {currentPlayer.userName === 'GUEST'
            ? 'LOG IN'
            : 'LOG OUT'}
        </button>
      </nav>
    </header>
  );
};
