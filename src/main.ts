import { setupCanvas2d } from './canvas';
import './style.css';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('No root to bind');
}

root.innerHTML = `
  <div>
    <div class="card">
      <canvas id="canvas-2d" />
    </div>
  </div>
`;

const canvas2d: HTMLCanvasElement | null = document.querySelector('#canvas-2d');

if (!canvas2d) {
  throw new Error('No root to bind');
}

setupCanvas2d(canvas2d);
