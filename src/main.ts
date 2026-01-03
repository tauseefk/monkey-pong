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

let angle = 0;
const dt = 2 / FPS;

function draw() {
  angle = (angle + (Math.PI * dt) / 2) % (2 * Math.PI);
  const modelTransformMatrix = Mat4x4.fromTransformXZ(
    { dx: 0, dy: 0, dz: 4.0 },
    angle,
  );

  drawCanvasWebGPU(modelTransformMatrix, dt);

  setTimeout(draw, MILLIS_PER_FRAME);
}

draw();
