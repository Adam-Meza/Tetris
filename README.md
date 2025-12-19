# Tetris

An experiement in React optimization and creating a framework that could be used for all 8-bit arcade games. Designed and built by Adam Meza.

Primarily built in React with Typescript, the frontend also uses [SCSS](https://sass-lang.com/), [Vite](https://vite.dev/), [Jotai](https://jotai.org/), [Axios](https://axios-http.com/) to connect to the backend (which is built using [Python/Django](https://www.djangoproject.com/) and uses [JWT](https://auth0.com/docs/secure/tokens/json-web-tokens) tokens for authorization) and uses several smaller dependencies for various tasks.

This application is deployed by Vercel at:

---

## GameManager Class + Grid + Pixel
>[!NOTE]
> This is the first iteration of what I imagine will be an ongoing project. If you are a React/frontend developer interested in giving feedback or contributing to this project, please contact me via [LinkedIn](https://linkedin.com/in/adam-meza). 

## Overview

The backbone of this application (and the main focus of the experiment) is the `GameManager` class which represents the first iteration of a customizable React Based system (?) that could _theoretically_ be reusable for all 8-bit Pixel Games.

### Set Up

Set up your `Grid` component and `GameManager` class with the following steps: 

1. Set a focal point as a `[x : number, y : number]` ref. This will typically be used to orient the Player as they move through the Grid. _ Note the `Grid` pixel refs are held as a 2D array so the coordinates are isomorphic to the natural ordering of array indexes. _ i.e. first row, second colomun = [1, 0] \*

`const focalPointRef = React.useRef<Coord>([3, 0]);`

2. Set a mutable ref object that will be used as the point of truth for game state logic. This will return a ref where the `ref.current` is a two by two array of `Pixel` objects.

```
import { makeRefMatrix } from '../../../grid/utilities';

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 30;

const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix([BOARD_WIDTH, BOARD_HEIGHT])
);

```

3. Intiialize a `GameManager` Class with your pixel refs and focal point ref.

```
import { GameManager } from '../../../grid/GameManager';

const gm = React.useMemo(
    () => new GameManager(pixelRefs, focalPointRef), []
);
```

4. Decalre a `setPixelRef` function which will be used to manipulate the `PixelRefs`:

```
const setPixelRef = (pixel: PixelType) => {
    const { x, y } = pixel;
    pixelRefs.current[y][x] = pixel;
};
```

5. Import the `Grid` Component and pass along the necessary props:

```
import { Grid } from '../../../grid/Grid';

return (
    <div className='grid-wrapper' id='your-id-here'>
        <Grid
            setPixelRef={setPixelRef}
            dimensions={[BOARD_WIDTH, BOARD_HEIGHT]}
            baseClass={'tetromino'}
        />
    </div>
);

```

> [!WARNING]
> The Grid component is designed such that they are placed in a `div` of the `grid-wrapper` class. This wrapper simply needs to have the _correct aspect ratio_, all other styling logic will be handled inside of `grid.scss`. This ensures that the `Pixel` components will be the correct size for the given `grid-wrapper` element.

### Basic Usage

The `GameManager` class exposes a number of methods for manipulating objects (charecters?) and pixels. Namely `put`, `delete`, `move`, `playerMove`, `rotate`, and `clearBoard`.

---

`put`, `delete`, `move`, `playerMove` all follow a similar work flow. 
```
const piece = {
    shape: [["A", null], // piece.shape must be a 2D array of either (string or number) or null type
            ["A", "A"]],
    id: "piece_123", // optional, can be null
    classname: "piece-class
}

const conditional (arguement: any) => {
/*

This function MUST return a boolean value. It will determine whether or not the desired
action runs. This can be extremely useful when preventing common errors. It can take in
one aguement of any type so any data you want to base the contional on must be bundled. 

*/
}


const onAfter (args: CallbackPayload) => {
/*

This function will be ran if the aciton is ran (note it will *not* run if there is
a conditional check that fails). It will have access to the `CallbackPayLoad` object,
which contains data about the action and the resulting board state. 

*/
}

gm.put({
  piece: piece,
  focalPoint: [0,0],
  conditional: conditional,
  onAfter: onAfter,
});

```
