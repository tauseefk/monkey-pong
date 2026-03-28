import { setupCanvasWebGPU } from './canvasWebGPU';
import { FPS, ID_WEBGPU_TARGET, MILLIS_PER_FRAME } from './constants';
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

const BOUNDS = 1.8;
const ROTATION_AXIS = { x: 0, y: -1, z: 0 };

let vx = 2.8;
let vy = 2.0;
let dx = 0;
let dy = 0;
let angle = 0;
const dt = 2 / FPS;

function draw() {
  angle = (angle + (Math.PI * dt) / 2) % (2 * Math.PI);
  dx += vx * dt;
  dy += vy * dt;

  if (dx > BOUNDS || dx < -BOUNDS) {
    vx = -vx;
  }
  if (dy > BOUNDS || dy < -BOUNDS) {
    vy = -vy;
  }

  const modelTransformMatrix = Mat4x4.fromTransform(
    { dx: 0, dy: 0, dz: 4.0 },
    { axis: ROTATION_AXIS, angle },
  );

  drawCanvasWebGPU(modelTransformMatrix, dt);

  setTimeout(draw, MILLIS_PER_FRAME);
}

draw();
