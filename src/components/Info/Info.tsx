import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

type InfoProps = {
  startNewGame: () => void;
};

const Info = ({ startNewGame }: InfoProps) => {
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
      <p>
        this is a tetris app made by adam meza <br></br>
        This app was practice in DOM manipulation, using
        React, SCSS and after my internship i wanted to stay
        sharp and apply the things i learned i built this
        iwas a way of praxtiving react specifallyt best
        practices in syntax and functionality i wanted to
        praxctice the useRef which proved ti be intergal
        duirng my time at bentley. write more consice code
        with scss iterator funcitons and selectors.
        <br></br>
        {/* ive always wanted to make games so antoher big part
        was figuringout a system for moving game pieces
        across a digital grid. i wanted to reduce */}
      </p>{' '}
      <>
        {' '}
        <div className='link-wrapper'>
          <a href='https://www.linkedin.com/in/adam-meza'>
            <FaLinkedin />
          </a>
          <span>Portfolio</span>
          <a href='https://www.github.com/adam-meza/tetris'>
            <FaGithub />
          </a>
        </div>
      </>
      <button
        onClick={() => {
          startNewGame();
        }}
      >
        New Game
      </button>
    </div>
  );
};

export default Info;
