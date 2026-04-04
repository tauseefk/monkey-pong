import { ColorsRGB } from './colors';
import { CANVAS_SIZE } from './constants';
import { Mat4x4 } from './mat4x4';
import { VERTICES_PER_SQUARE } from './tunnel/square';
import { TunnelState } from './tunnel/tunnel';
import { DEFAULT_TUNNEL_CONFIG } from './tunnel/tunnelConfig';
import type { IndexedShape } from './types';
import { initGPUContext } from './webGPU/gpuContext';
import { SolidRenderer } from './webGPU/solid';
import { beginFrame, WireframeRenderer } from './webGPU/wireframe';

export async function setupCanvasWebGPU(
  element: HTMLCanvasElement,
  shape: IndexedShape,
) {
  element.width = CANVAS_SIZE;
  element.height = CANVAS_SIZE;

  const gpuContext = await initGPUContext(element);

  const suzanneRenderer = SolidRenderer.init(shape, gpuContext);

  // Tunnel setup
  const tunnelConfig = DEFAULT_TUNNEL_CONFIG;
  const tunnel = new TunnelState(tunnelConfig);
  const maxTunnelVertices = 100 * VERTICES_PER_SQUARE;
  const tunnelRenderer = WireframeRenderer.init(maxTunnelVertices, gpuContext);

  const draw = (transformMatrix: Mat4x4, dt: number, ramp: number) => {
    tunnel.update(dt * ramp);
    const tunnelVertices = tunnel.computeVertices();
    tunnelRenderer.setVertices(tunnelVertices, tunnelVertices.length / 3);

    const frame = beginFrame(gpuContext);
    tunnelRenderer.draw(frame.passEncoder, {
      matrix: Mat4x4.identity(),
      color: ColorsRGB.Snow,
    });
    suzanneRenderer.draw(frame.passEncoder, {
      matrix: transformMatrix,
      color: ColorsRGB.PowderBlue,
    });
    frame.finish();
  };

  return draw;
}
