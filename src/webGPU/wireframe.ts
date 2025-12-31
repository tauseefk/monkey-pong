import { CLEAR_COLOR, COLOR } from '../constants';
import type { Mat4x4 } from '../mat4x4';
import type { Point4D, Shape } from '../types';
import { expandFacesToLines } from './expandFaces';
import type { GPUContext } from './gpuContext';
import { createPipeline } from './gpuUtils';
import { fragmentShader, vertexShader } from './shaders/wireframe';
import { hexToRgb } from './utils';

export type WireframeRenderParams = {
  matrix: Mat4x4;
  color?: Point4D;
};

type WireframeGPUConfig = {
  device: GPUDevice;
  context: GPUCanvasContext;
  pipeline: GPURenderPipeline;
  vertexBuffer: GPUBuffer;
  vertexUniformBuffer: GPUBuffer;
  fragmentUniformBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  vertexCount: number;
};

const CLEAR_COLOR_RGB = hexToRgb(CLEAR_COLOR);
const LINE_COLOR_RGB = hexToRgb(COLOR);

export class WireframeRenderer {
  private config: WireframeGPUConfig;

  private constructor(config: WireframeGPUConfig) {
    this.config = config;
  }

  static init(shape: Shape, gpuContext: GPUContext): WireframeRenderer {
    const { device, context } = gpuContext;

    // Create pipeline with line-list topology and 3D vertices
    const pipeline = createPipeline(
      device,
      { entryPoint: 'vs_main', code: vertexShader },
      { entryPoint: 'fs_main', code: fragmentShader },
      {
        label: 'wireframe_pipeline',
        topology: 'line-list',
        vertexFormat: 'float32x3',
      },
    );

    // Expand faces to line vertices
    const lineVertices = expandFacesToLines(shape);
    const vertexCount = lineVertices.length / 3;

    // Create vertex buffer
    const vertexBuffer = device.createBuffer({
      label: 'wireframe_vertex_buffer',
      size: lineVertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(vertexBuffer, 0, lineVertices);

    // Create uniform buffers
    // Vertex uniform: mat4x4 (64 bytes)
    const vertexUniformBuffer = device.createBuffer({
      label: 'wireframe_vertex_uniform',
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Fragment uniform: vec4 color (16 bytes)
    const fragmentUniformBuffer = device.createBuffer({
      label: 'wireframe_fragment_uniform',
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create bind group
    const bindGroup = device.createBindGroup({
      label: 'wireframe_bind_group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: vertexUniformBuffer } },
        { binding: 1, resource: { buffer: fragmentUniformBuffer } },
      ],
    });

    return new WireframeRenderer({
      device,
      context,
      pipeline,
      vertexBuffer,
      vertexUniformBuffer,
      fragmentUniformBuffer,
      bindGroup,
      vertexCount,
    });
  }

  render({ matrix, color }: WireframeRenderParams): void {
    const {
      device,
      context,
      pipeline,
      vertexBuffer,
      vertexUniformBuffer,
      fragmentUniformBuffer,
      bindGroup,
      vertexCount,
    } = this.config;

    device.queue.writeBuffer(vertexUniformBuffer, 0, matrix.toFloat32Array());

    const colorArray = color
      ? new Float32Array([color.x, color.y, color.z, color.w])
      : new Float32Array(LINE_COLOR_RGB);
    device.queue.writeBuffer(fragmentUniformBuffer, 0, colorArray);

    const commandEncoder = device.createCommandEncoder({
      label: 'wireframe_command_encoder',
    });

    const canvasTexture = context.getCurrentTexture();
    const canvasView = canvasTexture.createView();

    const renderPass = commandEncoder.beginRenderPass({
      label: 'wireframe_render_pass',
      colorAttachments: [
        {
          view: canvasView,
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: {
            r: CLEAR_COLOR_RGB[0],
            g: CLEAR_COLOR_RGB[1],
            b: CLEAR_COLOR_RGB[2],
            a: CLEAR_COLOR_RGB[3],
          },
        },
      ],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(vertexCount);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }
}
