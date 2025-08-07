import React from 'react';

const Info = () => {
  return (
    <div className='info-wrapper'>
      <h1>
        <span>T</span>
        <span>E</span>
        <span>T</span>
        <span>R</span>
        <span>I</span>
        <span>S</span>
        <span>!</span>
      </h1>
      <p>this is a tetris app made by adam meza</p>{' '}
      <>
        {' '}
        <span>If youd like to know more:</span>
        <div>
          <span>linkedIn</span>
          <span>Portfolio</span>
          <span>Repository</span>
        </div>
      </>
    </div>
  );
};

export default Info;
