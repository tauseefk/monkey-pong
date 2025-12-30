import {
  CANVAS_SIZE,
  CLEAR_COLOR,
  COLOR,
  FPS,
  MILLIS_PER_FRAME,
  SCREEN_DIMENSIONS,
} from './constants';
import { CUBE } from './cube';
import { Mat4x4 } from './mat4x4';
import type { Dimensions, Point2D, Point3D, Shape } from './types';

/**
 * Project the 3D point onto the XY-plane
 */
export const project = ({ x, y, z }: Point3D): Point2D => {
  return { x: x / z, y: y / z };
};

/**
 * Convert NDC coordinates to screen space coordinates
 *
 * [-1, -1] -> [1, 1]
 * [ 0,  0] -> [w, h]
 */
export const screen = (
  { x, y }: Point2D,
  screenDimensions: Dimensions,
): Point2D => {
  return {
    x: ((x + 1) / 2) * screenDimensions.width,
    y: (1 - (y + 1) / 2) * screenDimensions.height,
  };
};

const rotate_xz = ({ x, y, z }: Point3D, angle: number) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
};

const translate = ({ x, y, z }: Point3D, dz: number) => {
  return { x, y, z: z + dz };
};

export function setupCanvas2d(element: HTMLCanvasElement) {
  element.width = CANVAS_SIZE;
  element.height = CANVAS_SIZE;

  const context2d = element.getContext('2d');

  if (!context2d) {
    throw new Error('Failed to get drawing context');
  }

  let angle = 0;
  const dt = 1 / FPS;

  const clear = () => {
    context2d.fillStyle = CLEAR_COLOR;
    context2d.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };

  const draw = (shape: Shape) => {
    clear();

    context2d.strokeStyle = COLOR;
    context2d.lineWidth = 2;

    angle += (Math.PI * dt) / 2;
    const rotationMatrix = Mat4x4.fromRotationXZ(angle);
    context2d.beginPath();

    for (const face of shape.faces) {
      for (let idx = 0; idx < face.length; idx++) {
        const from = shape.vertices[face[idx]];
        const to = shape.vertices[face[(idx + 1) % face.length]];

        const projectedFrom = screen(
          project(translate(rotationMatrix.multiplyPoint(from), 2.0)),
          SCREEN_DIMENSIONS,
        );
        const projectedTo = screen(
          project(translate(rotationMatrix.multiplyPoint(to), 2.0)),
          SCREEN_DIMENSIONS,
        );

        context2d.moveTo(projectedFrom.x, projectedFrom.y);
        context2d.lineTo(projectedTo.x, projectedTo.y);
      }
    }
    context2d.stroke();

    setTimeout(() => draw(shape), MILLIS_PER_FRAME);
  };

  draw(CUBE);
}
