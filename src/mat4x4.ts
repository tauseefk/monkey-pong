/** biome-ignore-all lint/style/noNonNullAssertion: array indexing is okay here */

import type { Point3D, Translation } from './types';

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

  static perspective(
    fovY: number,
    aspect: number,
    near: number,
    far: number,
  ): Mat4x4 {
    const m = new Mat4x4();
    const f = 1.0 / Math.tan(fovY / 2);
    const nf = 1.0 / (far - near);

    // biome-ignore format: matrix layout
    m.mat = [
      f / aspect, 0,          0,                0,
      0,          f,          0,                0,
      0,          0,     far * nf,  -near * far * nf,
      0,          0,          1,                0,
    ];
    return m;
  }

  static identity(): Mat4x4 {
    return new Mat4x4();
  }

  static rotation(angles: [number, number, number] = [0, 0, 0]): Mat4x4 {
    const [rx, ry, rz] = angles;

    const cx = Math.cos(rx);
    const sx = Math.sin(rx);
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    const cz = Math.cos(rz);
    const sz = Math.sin(rz);

    // Rz * Ry * Rx composed directly
    const m = new Mat4x4();
    // biome-ignore format: matrix layout
    m.mat = [
      cz * cy,  cz * sy * sx - sz * cx,  cz * sy * cx + sz * sx,  0,
      sz * cy,  sz * sy * sx + cz * cx,  sz * sy * cx - cz * sx,  0,
          -sy,                 cy * sx,                 cy * cx,  0,
            0,                       0,                       0,  1,
    ];
    return m;
  }

  static translation(dx: number, dy: number, dz: number): Mat4x4 {
    const m = new Mat4x4();
    // biome-ignore format: matrix layout
    m.mat = [
      1, 0, 0, dx,
      0, 1, 0, dy,
      0, 0, 1, dz,
      0, 0, 0,  1,
    ];
    return m;
  }

  static fromTransform(
    { dx, dy, dz }: Translation,
    { axis, angle }: { axis: Point3D; angle: number },
  ): Mat4x4 {
    const m = new Mat4x4();
    const { x, y, z } = axis;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;

    // Rodrigues' rotation formula + translation, row-major
    // biome-ignore format: matrix layout
    m.mat = [
      t*x*x +   c, t*x*y  - s*z, t*x*z + s*y, dx,
      t*x*y + s*z, t*y*y  +   c, t*y*z - s*x, dy,
      t*x*z - s*y, t*y*z  + s*x, t*z*z +   c, dz,
                0,            0,           0,  1,
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

  /**
   * Multiply this matrix with another Mat4x4.
   * Returns a new Mat4x4: this * other
   */
  multiply(other: Mat4x4): Mat4x4 {
    const result = new Mat4x4();
    const a = this.mat;
    const b = other.mat;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result.mat[row * 4 + col] =
          a[row * 4 + 0]! * b[0 * 4 + col]! +
          a[row * 4 + 1]! * b[1 * 4 + col]! +
          a[row * 4 + 2]! * b[2 * 4 + col]! +
          a[row * 4 + 3]! * b[3 * 4 + col]!;
      }
    }

    return result;
  }

  /**
   * Returns the matrix in column-major order.
   */
  toFloat32Array(): Float32Array<ArrayBuffer> {
    const m = this.mat;
    // biome-ignore format: matrix layout
    return Float32Array.from([
      m[0]!, m[4]!, m[8]!,  m[12]!,
      m[1]!, m[5]!, m[9]!,  m[13]!,
      m[2]!, m[6]!, m[10]!, m[14]!,
      m[3]!, m[7]!, m[11]!, m[15]!,
    ]);
  }
}
