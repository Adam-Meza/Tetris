type ControlPanelProps = {
  makeNewTetromino: () => void;
  pauseGame: () => void;
  consoleLogData: () => void;
};

export const ControlPanel = (props: ControlPanelProps) => {
  const { makeNewTetromino, pauseGame, consoleLogData } =
    props;

  return (
    <div className='button-container'>
      <button
        onClick={() => {
          makeNewTetromino();
        }}
      >
        Place Block
      </button>

      <button
        onClick={() => {
          consoleLogData();
        }}
      >
        console log stuff
      </button>
      <button onClick={() => pauseGame()}>pause</button>
    </div>
  );
};
