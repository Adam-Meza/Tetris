import * as ReactRouter from 'react-router-dom';
import * as Jotai from 'jotai';
import { currentPlayerAtom } from '../../atoms';

export const Header = () => {
  const nav = ReactRouter.useNavigate();
  const currentPlayer = Jotai.useAtomValue(
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
        <button onClick={() => nav('/about')}>ABOUT</button>
        <button
          onClick={() => {
            if (currentPlayer.userName !== 'GUEST')
              localStorage.clear();

            nav('/log-in');
          }}
        >
          {currentPlayer.userName === 'GUEST'
            ? 'LOG IN'
            : 'LOG OUT'}
        </button>
        {/* <button>about</button> */}
      </nav>
    </header>
  );
};
