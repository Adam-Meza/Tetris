import ScoreBoard from './ScoreBoard';
import { NextTetromino } from '../NextTetromino/NextTetromino';

import { LineCount } from './LineCount';

const TopDisplay = () => {
  return (
    <div className='top-display'>
      <span className='player-title'> PLAYER: "test"</span>
      <ScoreBoard />
      <div className='top-display-bottom-wrapper'>
        <LineCount />
        <NextTetromino />
      </div>
    </div>
  );
};

export default TopDisplay;
