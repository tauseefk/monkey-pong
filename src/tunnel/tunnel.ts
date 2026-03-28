import { Mat4x4 } from '../mat4x4';
import {
  QUAD_EDGE_INDICES,
  QUAD_VERTICES,
  type TunnelSquare,
  VERTICES_PER_SQUARE,
} from './square';
import type { TunnelConfig } from './tunnelConfig';

const MAX_TILT = (2 * Math.PI) / 180;

function randomTilt(): number {
  return (Math.random() * 2 - 1) * MAX_TILT;
}

export class TunnelState {
  private config: TunnelConfig;
  private squares: TunnelSquare[];
  private outputBuffer: Float32Array<ArrayBuffer>;

  constructor(config: TunnelConfig) {
    this.config = config;
    this.squares = [];
    this.outputBuffer = new Float32Array(0);
    this.initSquares();
  }

  private initSquares(): void {
    const { squareCount, zNear, zFar } = this.config;
    const spacing = (zFar - zNear) / squareCount;

    this.squares = [];
    for (let i = 0; i < squareCount; i++) {
      this.squares.push({
        z: zNear + (i + 1) * (spacing / 2),
        rotX: randomTilt(),
        rotY: randomTilt(),
        rotZ: randomTilt(),
      });
    }

    // 3 floats per vertex, VERTICES_PER_SQUARE vertices per square
    this.outputBuffer = new Float32Array(squareCount * VERTICES_PER_SQUARE * 3);
  }

  update(dt: number): void {
    const { speed, zNear, zFar } = this.config;

    for (const sq of this.squares) {
      sq.z -= speed * dt;
      if (sq.z < zNear) {
        sq.z = zFar;
        sq.rotX = randomTilt();
        sq.rotY = randomTilt();
        sq.rotZ = randomTilt();
      }
    }
  }

  computeVertices(): Float32Array<ArrayBuffer> {
    const { squareSize, zNear, zFar } = this.config;
    const zRange = zFar - zNear;
    const out = this.outputBuffer;
    let offset = 0;

    for (const sq of this.squares) {
      // t=1 at zFar (full tilt), t=0 at zNear (no tilt)
      const t = (sq.z - zNear) / zRange;
      const rotMatrix = Mat4x4.rotation([
        sq.rotX * t,
        sq.rotY * t,
        sq.rotZ * t,
      ]);

      // Transform quad vertices: rotate, translate to z, perspective project
      const projected: { x: number; y: number }[] = [];
      for (const localVert of QUAD_VERTICES) {
        const scaled = {
          x: localVert.x * squareSize,
          y: localVert.y * squareSize,
          z: localVert.z,
        };
        const rotated = rotMatrix.multiplyPoint(scaled);
        const worldZ = rotated.z + sq.z;
        projected.push({ x: rotated.x / worldZ, y: rotated.y / worldZ });
      }

      // Write edge vertices into output buffer
      for (const edgeIdx of QUAD_EDGE_INDICES) {
        const p = projected[edgeIdx]!;
        out[offset++] = p.x;
        out[offset++] = p.y;
        out[offset++] = 1.0; // z=1.0 so shader's x/z is a no-op
      }
    }

    return out;
  }

  setSquareCount(count: number): void {
    this.config.squareCount = count;
    this.initSquares();
  }
}
