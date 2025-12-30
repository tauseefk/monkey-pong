import type { Point3D } from './types';

/**
 * 4x4 transformation matrix stored in row-major order.
 *
 */
export class Mat4x4 {
  private mat: number[];

  private constructor() {
    // biome-ignore format: matrix layout
    this.mat = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  static fromRotationXZ(angle: number) {
    const m = new Mat4x4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    // biome-ignore format: matrix layout
    m.mat = [
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1,
    ];
    return m;
  }

  /**
   * Multiply a `Point3D` with the matrix.
   */
  multiplyPoint(point: Point3D): Point3D {
    const { x, y, z } = point;
    const m = this.mat;

    // row-major access: m[row * 4 + col]
    return {
      x: m[0]! * x + m[1]! * y + m[2]! * z + m[3]!,
      y: m[4]! * x + m[5]! * y + m[6]! * z + m[7]!,
      z: m[8]! * x + m[9]! * y + m[10]! * z + m[11]!,
    };
  }
}
