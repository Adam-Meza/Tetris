type ControlPanelProps = {
  makeNewTetromino: () => void;
  setGameOverState: (state: boolean) => void;
  consoleLogData: () => void;
};

export const ControlPanel = (props: ControlPanelProps) => {
  const {
    makeNewTetromino,
    setGameOverState,
    consoleLogData,
  } = props;

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
      <button onClick={() => setGameOverState(false)}>
        start
      </button>
      <button onClick={() => setGameOverState(true)}>
        pause
      </button>
    </div>
  );
};
