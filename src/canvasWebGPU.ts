import { ColorsRGB } from './colors';
import { CANVAS_SIZE } from './constants';
import { Mat4x4 } from './mat4x4';
import { VERTICES_PER_SQUARE } from './tunnel/square';
import { TunnelState } from './tunnel/tunnel';
import { DEFAULT_TUNNEL_CONFIG } from './tunnel/tunnelConfig';
import type { Shape } from './types';
import { expandFacesToLines } from './webGPU/expandFaces';
import { initGPUContext } from './webGPU/gpuContext';
import { beginFrame, WireframeRenderer } from './webGPU/wireframe';

export async function setupCanvasWebGPU(
  element: HTMLCanvasElement,
  shape: Shape,
) {
  element.width = CANVAS_SIZE;
  element.height = CANVAS_SIZE;

  const gpuContext = await initGPUContext(element);

  const lineVertices = expandFacesToLines(shape);
  const vertexCount = lineVertices.length / 3;

  const suzanneRenderer = WireframeRenderer.init(vertexCount, gpuContext);
  suzanneRenderer.setVertices(lineVertices, vertexCount);

  // Tunnel setup
  const tunnelConfig = DEFAULT_TUNNEL_CONFIG;
  const tunnel = new TunnelState(tunnelConfig);
  const maxTunnelVertices = 100 * VERTICES_PER_SQUARE;
  const tunnelRenderer = WireframeRenderer.init(maxTunnelVertices, gpuContext);

  const draw = (transformMatrix: Mat4x4, dt: number) => {
    tunnel.update(dt);
    const tunnelVertices = tunnel.computeVertices();
    tunnelRenderer.setVertices(tunnelVertices, tunnelVertices.length / 3);

    const frame = beginFrame(gpuContext.device, gpuContext.context);
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
