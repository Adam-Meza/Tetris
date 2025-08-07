import { useAtom } from 'jotai';
import { gameOverAtom, scoreAtom } from '../../atoms';
import { useAtomValue } from 'jotai';

type ControlPanelProps = {
  startNewGame: () => void;
  setGameOverState: (state: boolean) => void;
  consoleLogData: () => void;
};

export const ControlPanel = (props: ControlPanelProps) => {
  const { startNewGame, setGameOverState, consoleLogData } =
    props;

  const gameOver = useAtomValue(gameOverAtom);
  const score = useAtomValue(scoreAtom);

  return (
    <div className='button-container'>
      <button
        onClick={() => {
          startNewGame();
        }}
      >
        New Game
      </button>

      {/* <button
        onClick={() => {
          consoleLogData();
        }}
      >
        console log stuff
      </button> */}
      <button onClick={() => setGameOverState(!gameOver)}>
        {gameOver ? 'start' : 'pause'}
      </button>

      {score}
    </div>
  );
};
