import * as Jotai from 'jotai';
import { lineCountAtom } from '../../../atoms';

export const LineCount = () => {
  const lineCount = Jotai.useAtomValue(lineCountAtom);
  return (
    <div className='line-count-wrapper'>
      <span>Line Count:</span>
      <span> {lineCount}</span>
    </div>
  );
};
