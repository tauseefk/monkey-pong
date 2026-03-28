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
