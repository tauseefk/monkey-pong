import { setupCanvas2d } from './canvas2d';
import { setupCanvasWebGPU } from './canvasWebGPU';
import { FPS, MILLIS_PER_FRAME } from './constants';
import { CUBE } from './cube';
import { Mat4x4 } from './mat4x4';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('No root to bind');
}

root.innerHTML = `
  <div>
    <div class="card">
      <div>
        <canvas id="canvas-2d" />
      </div>
      <div>
        <canvas id="canvas-webgpu" />
      </div>
    </div>
  </div>
`;

const canvas2d: HTMLCanvasElement | null = document.querySelector('#canvas-2d');

if (!canvas2d) {
  throw new Error('No element to bind');
}

const drawCanvas2d = setupCanvas2d(canvas2d, CUBE);

const canvasWebGPU: HTMLCanvasElement | null =
  document.querySelector('#canvas-webgpu');

if (!canvasWebGPU) {
  throw new Error('No element to bind');
}

const drawCanvasWebGPU = await setupCanvasWebGPU(canvasWebGPU, CUBE);

/////////////
// DRAWING //
/////////////

const RenderMode = {
  Canvas2D: 'canvas2d',
  WebGPU: 'webgpu',
} as const;

const renderMode = RenderMode.Canvas2D;

let angle = 0;
const dt = 1 / FPS;

function draw() {
  angle += (Math.PI * dt) / 2;
  const transformMatrix = Mat4x4.fromTransformXZ(
    { dx: 0, dy: 0, dz: 2.0 },
    angle,
  );

  if (renderMode === RenderMode.Canvas2D) {
    canvasWebGPU?.classList.add('hidden');
    canvas2d?.classList.remove('hidden');
    drawCanvas2d(transformMatrix);
  } else {
    canvas2d?.classList.add('hidden');
    canvasWebGPU?.classList.remove('hidden');
    drawCanvasWebGPU(transformMatrix);
  }

  setTimeout(draw, MILLIS_PER_FRAME);
}

draw();
