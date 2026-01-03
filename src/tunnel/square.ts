import type { Point3D } from '../types';

export type TunnelSquare = {
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
};

export const QUAD_VERTICES: Point3D[] = [
  { x: -1, y: -1, z: 0 },
  { x: 1, y: -1, z: 0 },
  { x: 1, y: 1, z: 0 },
  { x: -1, y: 1, z: 0 },
];

// Line-list edges: [0,1], [1,2], [2,3], [3,0] → 8 vertices per square
export const QUAD_EDGE_INDICES = [0, 1, 1, 2, 2, 3, 3, 0];

export const VERTICES_PER_SQUARE = QUAD_EDGE_INDICES.length;
