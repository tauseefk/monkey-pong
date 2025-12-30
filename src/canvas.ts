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
import { project, screen } from './projection';
import type { Shape } from './types';

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
    const transformMatrix = Mat4x4.fromTransformXZ(
      { dx: 0, dy: 0, dz: 2.0 },
      angle,
    );
    context2d.beginPath();

    for (const face of shape.faces) {
      for (let idx = 0; idx < face.length; idx++) {
        const from = shape.vertices[face[idx]];
        const to = shape.vertices[face[(idx + 1) % face.length]];

        const projectedFrom = screen(
          project(transformMatrix.multiplyPoint(from)),
          SCREEN_DIMENSIONS,
        );
        const projectedTo = screen(
          project(transformMatrix.multiplyPoint(to)),
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
