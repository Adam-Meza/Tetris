// import React from 'react';
// import { Grid } from '../../grid/Grid';
// import { TetrominoType } from '../Tetromino/Tetromino';
// import { PixelType } from '../../grid/Pixel';
// import {
//   randomTetromino,
//   Direction,
//   rotateShapeClockwise,
//   getLetter,
//   makeNewCoordinates,
// } from '../../utilities';
// import * as Jotai from 'jotai';
// import {
//   currentTetrominoAtom,
//   nextTetrominoAtom,
// } from '../../atoms';
// import {
//   makeRefMatrix,
//   addOrRemovePixel,
//   clearBoard,
// } from '../../grid/utilities';

// /**
//  * Tetris GameBoard Component -
//  * Handles almost all the logic for game play including:
//  * moving, placing, and deleting Tetrominos.
//  */
// export const SideArt = () => {
//   // console.log('Gameboard Render');
//   const BOARD_WIDTH = 20;
//   const BOARD_HEIGHT = 40;
//   const [blockStyle, setBlockStyle] = React.useState('l');

//   const [currentTetromino, setTetromino] = Jotai.useAtom(
//     currentTetrominoAtom
//   );

//   const [next, setNext] = Jotai.useAtom(nextTetrominoAtom);

//   /**
//    * Focal point determining the coordinates on the Grid that pieces are placed/oriented with.
//    */
//   const focalPointRef = React.useRef<[number, number]>([
//     3, 0,
//   ]);

//   /**
//    * Mutable ref object that will be used as the point of truth for game state logic.
//    */
//   const pixelRefs = React.useRef<(PixelType | null)[][]>(
//     makeRefMatrix(BOARD_HEIGHT, BOARD_WIDTH)
//   );

//   // const pixelRefs = buildRefs()

//   /**
//    * Sets the individual pixel ref objects and is responsible for effecting change on the DOM.
//    */

//   const setPixelRef = (pixel: PixelType) => {
//     const { x, y } = pixel;
//     if (
//       y >= 0 &&
//       y < BOARD_HEIGHT &&
//       x >= 0 &&
//       x < BOARD_WIDTH
//     ) {
//       pixelRefs.current[y][x] = pixel;
//     }
//   };

//   // CONVERT THIS TO UPDATE OBJECT
//   // BE ABLE TO TAKE IN AN OBJECT
//   // AND A FOCAL POINT
//   // and move that objec to the focal point
//   const updateCurrentTetromino = (
//     action: 'add' | 'remove',
//     tetromino = currentTetromino
//   ) => {
//     tetromino.shape?.forEach(
//       (row: (string | null)[], rowIndex: number) => {
//         row.forEach(
//           (cell: string | null, colIndex: number) => {
//             // some parts of the shape will be null,
//             // this ensures we are only updating
//             // DOM and data model for filled squares
//             if (cell) {
//               const x = focalPointRef.current[0] + colIndex;
//               const y = focalPointRef.current[1] + rowIndex;

//               const { id } = tetromino;
//               const className = `${blockStyle}-block`;

//               addOrRemovePixel(
//                 pixelRefs,
//                 [x, y],
//                 action,
//                 className,
//                 id
//               );
//             }
//           }
//         );
//       }
//     );

//     if (!isMovePossible('down', tetromino))
//       handleBlockLanding();
//   };

//   // this might be hard to abstract out as different games have different needs
//   const isMovePossible = (
//     direction: Direction,
//     tetromino = currentTetromino,
//     focalPoint = focalPointRef
//   ): boolean => {
//     const tetrominoHeight = tetromino.shape.length;
//     const tetrominoWidth = tetromino.shape[0].length;

//     for (let i = 0; i < tetrominoHeight; i++) {
//       for (let j = 0; j < tetrominoWidth; j++) {
//         const x = j + focalPoint.current[0];
//         const y = i + focalPoint.current[1];
//         const [targetX, targetY] = makeNewCoordinates(
//           x,
//           y,
//           direction
//         );

//         if (
//           targetX >= BOARD_WIDTH ||
//           targetY >= BOARD_HEIGHT
//         )
//           return false;

//         const currentSquare = pixelRefs.current[y][x];

//         const nextSquare =
//           pixelRefs.current[targetY][targetX];

//         if (
//           !runCheck(currentSquare, nextSquare, tetromino)
//         ) {
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const runCheck = (
//     currentSquare: PixelType | null,
//     nextSquare: PixelType | null,
//     tetromino: TetrominoType
//   ) => {
//     if (!nextSquare) return false;
//     // The following code will only check if the nextSqaure is occupied
//     if (nextSquare.id) {
//       if (
//         //first we check if the current square is occupied
//         // i.e. parts of each tetromino will have blank spaces
//         // that do not carry and ID
//         // if thats true, we make sure the
//         (currentSquare?.id === tetromino.id &&
//           nextSquare.id !== currentSquare?.id) ||
//         // given that the nextSquare has an id,
//         // if the tetromino in question is not the current
//         // then we check if nextSquare is occupied by anooter piece
//         // based on the given tetromino NOT the current pixelRef
//         (tetromino !== currentTetromino &&
//           nextSquare.id !== tetromino.id)
//       )
//         return false;
//     }

//     // if none of the falsifying conditions are met
//     // move is possible, return true
//     return true;
//   };

//   const moveTetromino = (direction: Direction) => {
//     if (!currentTetromino) return;
//     let [x, y] = focalPointRef.current;

//     if (isMovePossible(direction)) {
//       [x, y] = makeNewCoordinates(x, y, direction);

//       updateCurrentTetromino('remove');
//       focalPointRef.current = [x, y];
//       updateCurrentTetromino('add');
//     }
//   };

//   const handleBlockLanding = () => {
//     makeNewTetromino();
//   };

//   const makeNewTetromino = () => {
//     const tetromino = randomTetromino();

//     setNext(tetromino);
//     setTetromino(next);

//     // could be place();
//     focalPointRef.current = [3, 0];
//     updateCurrentTetromino('add', next);
//   };

//   // could be GameManager.rotate();
//   const rotateTetromino = () => {
//     const rotated = {
//       ...currentTetromino,
//       shape: rotateShapeClockwise(currentTetromino.shape),
//     };

//     const tetrominoLength = rotated.shape[0].length;

//     if (
//       tetrominoLength + focalPointRef.current[0] <=
//         BOARD_WIDTH &&
//       isMovePossible('same', rotated)
//     ) {
//       // this can be changed to movePiece(refs, object, focalpoint, {direction: })

//       //??/
//       updateCurrentTetromino('remove');
//       setTetromino(rotated);
//       updateCurrentTetromino('add', rotated);
//     }
//   };

//   const handleKeyPress = (
//     e: React.KeyboardEvent<HTMLElement>
//   ) => {
//     const { key, repeat } = e;
//     const [x, y] = focalPointRef.current;

//     let direction;

//     if (repeat && x === 3 && y === 0) return;

//     switch (key) {
//       case 'ArrowDown':
//       case 'ArrowLeft':
//       case 'ArrowRight':
//       case 'ArrowUp':
//         direction = key
//           .replace('Arrow', '')
//           .toLowerCase() as Direction;
//         moveTetromino(direction);
//         return;
//       case 'Shift':
//         rotateTetromino();
//         return;
//       case 'Enter':
//         startNewGame();
//         return;

//       case 's':
//       case 'l':
//       case 'z':
//       case 'o':
//       case 'i':
//       case 't':
//       case 'j':
//         setBlockStyle(key);
//         return;
//     }
//   };

//   const startNewGame = () => {
//     clearBoard(pixelRefs);
//     makeNewTetromino();
//     console.log('we started a new game');
//   };

//   return (
//     <main
//       tabIndex={0}
//       onKeyDown={(event) => handleKeyPress(event)}
//     >
//       <section className='gameboard-wrapper'>
//         <div className='grid-wrapper' id='sideart'>
//           <Grid
//             setPixelRef={setPixelRef}
//             width={BOARD_WIDTH}
//             height={BOARD_HEIGHT}
//             baseClass={'tetromino'}
//           />
//         </div>
//       </section>
//       j = blue <br />
//       l = red <br />
//       o = yellow <br />
//       i = light blue <br />
//       t = purple <br />
//       s = green <br />
//       z = pink <br />
//     </main>
//   );
// };
