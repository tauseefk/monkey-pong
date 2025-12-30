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

export type Shape = {
  vertices: Point3D[];
  faces: number[][];
};
