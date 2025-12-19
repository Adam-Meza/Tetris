# Tetris

An experiement in React optimization and creating a framework that could be used for all 8-bit arcade games. Designed and built by Adam Meza.

Primarily built in React with Typescript, the frontend also uses SCSS for styling, Vite for bundling, Jotai for global state management, Axios to connect to the backend (which is built using Python/Django and uses JWT tokens for authorization) and uses several smaller dependencies for various tasks.

This application is deployed by Vercel at:

---

## GameManager Class + Grid + Pixel

## Overview

The backbone of this application (and the main focus of the experiment) is the GameManager class which represents the first iteration of a customizable React Based system (?) that could _theoretically_ be reusable for all 8-bit Pixel Games. Typical work flow is:

1. Set a focal point as a `[x : number, y : number]` ref. This will typically be used to orient the Player as they move through the Grid. _ Note the Grid pixels are held as a 2D array so the coordinates are isomorphic to the natural ordering of Array indexes. _ i.e. first row, second colomun = [1, 0] \*

`const focalPointRef = React.useRef<Coord>([3, 0]);`

2. Set a mutable ref object that will be used as the point of truth for game state logic. This will return a ref where the `ref.current` is a two by two array of Pixel objects.

```
import { makeRefMatrix } from '../../../grid/utilities';

const BOARD_WIDTH = 20;
    const BOARD_HEIGHT = 30

const pixelRefs = React.useRef<(PixelType | null)[][]>(
    makeRefMatrix([BOARD_WIDTH, BOARD_HEIGHT])
);

```

3. Intiialize a GameManager Class with your pixel refs and focal point ref.

```
const gm = React.useMemo(
    () => new GameManager(pixelRefs, focalPointRef),
    []
);
```

/\*\*

- Sets the individual pixel ref objects and is responsible for effecting change on the DOM.
  \*/
  const setPixelRef = (pixel: PixelType) => {
  const { x, y } = pixel;
  pixelRefs.current[y][x] = pixel;
  };
