import { useAtom } from 'jotai';
import { gameOverAtom, scoreAtom } from '../../atoms';
import { useAtomValue } from 'jotai';

type ControlPanelProps = {
  setGameOver: (state: boolean) => void;
  consoleLogData: () => void;
};

export const ControlPanel = (props: ControlPanelProps) => {
  const { setGameOver, consoleLogData } = props;

  const gameOver = useAtomValue(gameOverAtom);
  const score = useAtomValue(scoreAtom);

  return (
    <div className='button-container'>
      {
        <button
          onClick={() => {
            consoleLogData();
          }}
        >
          console log stuff
        </button>
      }
      <button onClick={() => setGameOver(!gameOver)}>
        {gameOver ? 'start' : 'pause'}
      </button>
    </div>
  );
};
