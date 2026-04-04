import { setupCanvasWebGPU } from './canvasWebGPU';
import {
  FPS,
  ID_WEBGPU_TARGET,
  MILLIS_PER_FRAME,
  RAMP_DELAY,
  RAMP_DURATION,
  SUZANNE_BOUNDS,
  SUZANNE_INITIAL_Z,
  SUZANNE_ROTATION_AXIS,
  SUZANNE_SPEED,
} from './constants';
import { Mat4x4 } from './mat4x4';
import SUZANNE from './suzanne.json';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('No root to bind');
}

root.innerHTML = `
  <div class="card">
    <div>
      <canvas id="canvas-webgpu" />
    </div>
  </div>
`;

const canvasWebGPU: HTMLCanvasElement | null = document.getElementById(
  ID_WEBGPU_TARGET,
) as HTMLCanvasElement;

if (!canvasWebGPU) {
  throw new Error('No element to bind');
}

const drawCanvasWebGPU = await setupCanvasWebGPU(canvasWebGPU, SUZANNE);

/////////////
// DRAWING //
/////////////

let vx = SUZANNE_SPEED.x;
let vy = SUZANNE_SPEED.y;
let dx = 0;
let dy = 0;
let dz = SUZANNE_INITIAL_Z;
let zPhase = 0;
let angle = Math.PI;
let elapsed = 0;
const dt = 2 / FPS;

function draw() {
  elapsed += dt;
  const ramp = Math.min(Math.max(elapsed - RAMP_DELAY, 0) / RAMP_DURATION, 1.0);

  angle = (angle + (Math.PI * dt * ramp) / 2) % (2 * Math.PI);
  zPhase = (zPhase + dt * 0.3 * ramp) % (2 * Math.PI);
  dx += vx * dt * ramp;
  dy += vy * dt * ramp;
  dz = SUZANNE_INITIAL_Z + Math.sin(zPhase) * 2.0;

  if (dx > SUZANNE_BOUNDS || dx < -SUZANNE_BOUNDS) {
    vx = -vx;
  }
  if (dy > SUZANNE_BOUNDS || dy < -SUZANNE_BOUNDS) {
    vy = -vy;
  }

  const modelTransformMatrix = Mat4x4.fromTransform(
    { dx, dy, dz },
    { axis: SUZANNE_ROTATION_AXIS, angle },
  );

  drawCanvasWebGPU(modelTransformMatrix, dt, ramp);

  setTimeout(draw, MILLIS_PER_FRAME);
}

draw();
