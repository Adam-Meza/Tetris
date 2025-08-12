import React from 'react';
import ScoreBoard from './ScoreBoard';
import { NextTetromino } from '../NextTetromino/NextTetromino';
import { lineCountAtom } from '../../atoms';
import { useAtomValue } from 'jotai';

const TopDisplay = () => {
  const lineCount = useAtomValue(lineCountAtom);
  return (
    <div className='top-display'>
      <ScoreBoard />
      <div className='top-display-bottom-wrapper'>
        <div className='line-count-wrapper'>
          <span>Line Count:</span>
          <span> {lineCount}</span>
        </div>
        <NextTetromino />
      </div>
    </div>
  );
};

export default TopDisplay;
