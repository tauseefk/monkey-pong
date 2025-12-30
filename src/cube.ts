import type { Shape } from './types';

export const CUBE: Shape = {
  vertices: [
    // front face
    { x: -0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    { x: -0.5, y: -0.5, z: -0.5 },
    // back face
    { x: -0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: -0.5, z: 0.5 },
  ],
  faces: [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ],
};
