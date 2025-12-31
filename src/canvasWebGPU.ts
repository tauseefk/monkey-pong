import { CANVAS_SIZE } from './constants';
import type { Mat4x4 } from './mat4x4';
import type { Shape } from './types';
import { initGPUContext } from './webGPU/gpuContext';
import { WireframeRenderer } from './webGPU/wireframe';

export async function setupCanvasWebGPU(
  element: HTMLCanvasElement,
  shape: Shape,
) {
  element.width = CANVAS_SIZE;
  element.height = CANVAS_SIZE;

  const gpuContext = await initGPUContext(element);
  const wireframeRenderer = WireframeRenderer.init(shape, gpuContext);

  const draw = (transformMatrix: Mat4x4) => {
    wireframeRenderer.render({ matrix: transformMatrix });
  };

  return draw;
}
