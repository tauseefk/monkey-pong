import { ID_CANVAS_2D_TARGET, ID_WEBGPU_TARGET } from './constants';

export type Dimensions = {
  width: number;
  height: number;
};

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface Point4D extends Point3D {
  w: number;
}

export type Shape = {
  vertices: Point3D[];
  faces: number[][];
};

export type Translation = {
  dx: number;
  dy: number;
  dz: number;
};

export const RenderMode = {
  Canvas2D: ID_CANVAS_2D_TARGET,
  WebGPU: ID_WEBGPU_TARGET,
} as const;

export type RenderMode = (typeof RenderMode)[keyof typeof RenderMode];
