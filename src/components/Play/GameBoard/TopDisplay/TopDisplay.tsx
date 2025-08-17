import ScoreBoard from './ScoreBoard';
import { NextTetromino } from '../NextTetromino/NextTetromino';
import { currentPlayerAtom } from '../../../../atoms';
import { LineCount } from './LineCount';
import * as Jotai from 'jotai';

const TopDisplay = () => {
  const currentPlayer = Jotai.useAtomValue(
    currentPlayerAtom
  );
  return (
    <div className='top-display'>
      <span className='player-title'>
        PLAYER: {currentPlayer.userName}
      </span>
      <ScoreBoard />
      <div className='top-display-bottom-wrapper'>
        <LineCount />
        <NextTetromino />
      </div>
    </div>
  );
};

export default TopDisplay;
