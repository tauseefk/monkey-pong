import { ID_RENDER_MODE_GROUP } from './constants';
import { RenderMode } from './types';

const URL_PARAM_RENDER_MODE = 'rendermode';

function getInitialModeFromURL(): RenderMode {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get(URL_PARAM_RENDER_MODE);

  if (mode === RenderMode.Canvas2D) {
    return RenderMode.Canvas2D;
  }
  return RenderMode.WebGPU;
}

function updateURLParam(mode: RenderMode) {
  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAM_RENDER_MODE, mode);
  window.history.replaceState({}, '', url);
}

let currentMode = getInitialModeFromURL();

export function getRenderMode(): RenderMode {
  return currentMode;
}

export function setupUI(
  canvas2d: HTMLCanvasElement,
  canvasWebGPU: HTMLCanvasElement,
) {
  const group = document.getElementById(ID_RENDER_MODE_GROUP) as HTMLDivElement;
  const buttons = group.querySelectorAll('button');

  function updateUI() {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.mode === currentMode;
      btn.classList.toggle('active', isActive);
    });

    const isCanvas2D = currentMode === RenderMode.Canvas2D;
    canvas2d.parentElement?.classList.toggle('hidden', !isCanvas2D);
    canvasWebGPU.parentElement?.classList.toggle('hidden', isCanvas2D);
  }

  function handleClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    const mode = target.dataset.mode as RenderMode;
    if (mode && mode !== currentMode) {
      currentMode = mode;
      updateURLParam(currentMode);
      updateUI();
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', handleClick);
  });

  updateUI();
}
