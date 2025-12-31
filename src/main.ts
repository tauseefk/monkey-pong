import { setupCanvas2d } from './canvas2d';
import { setupCanvasWebGPU } from './canvasWebGPU';
import {
  FPS,
  ID_CANVAS_2D_TARGET,
  ID_WEBGPU_TARGET,
  MILLIS_PER_FRAME,
} from './constants';
import { CUBE } from './cube';
import SUZANNE from './suzanne.json';
import { Mat4x4 } from './mat4x4';
import './style.css';
import { RenderMode } from './types';
import { getRenderMode, setupUI } from './ui';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('No root to bind');
}

root.innerHTML = `
  <div class="card">
    <div>
      <canvas id="canvas-2d" />
    </div>
    <div>
      <canvas id="canvas-webgpu" />
    </div>
    <div id="render-mode-group" role="group" aria-label="Render mode">
      <button data-mode="canvas-2d">Canvas2D</button>
      <button data-mode="canvas-webgpu">WebGPU</button>
    </div>
  </div>
`;

const canvas2d: HTMLCanvasElement | null = document.getElementById(
  ID_CANVAS_2D_TARGET,
) as HTMLCanvasElement;

if (!canvas2d) {
  throw new Error('No element to bind');
}

const drawCanvas2d = setupCanvas2d(canvas2d, SUZANNE);

const canvasWebGPU: HTMLCanvasElement | null = document.getElementById(
  ID_WEBGPU_TARGET,
) as HTMLCanvasElement;

if (!canvasWebGPU) {
  throw new Error('No element to bind');
}

const drawCanvasWebGPU = await setupCanvasWebGPU(canvasWebGPU, SUZANNE);

setupUI(canvas2d, canvasWebGPU);

/////////////
// DRAWING //
/////////////

let angle = 0;
const dt = 1 / FPS;

function draw() {
  angle += (Math.PI * dt) / 2;
  const transformMatrix = Mat4x4.fromTransformXZ(
    { dx: 0, dy: 0, dz: 2.0 },
    angle,
  );

  if (getRenderMode() === RenderMode.Canvas2D) {
    drawCanvas2d(transformMatrix);
  } else {
    drawCanvasWebGPU(transformMatrix);
  }

  setTimeout(draw, MILLIS_PER_FRAME);
}

draw();
