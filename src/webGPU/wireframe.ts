import type { ColorRGB } from '../colors';
import { CLEAR_COLOR, COLOR } from '../constants';
import type { Mat4x4 } from '../mat4x4';
import type { GPUContext } from './gpuContext';
import { createPipeline } from './gpuUtils';
import { hexToRgb } from './hexToRgb';
import { fragmentShader, vertexShader } from './shaders/wireframe';

export type WireframeRenderParams = {
  matrix: Mat4x4;
  color?: ColorRGB;
};

type WireframeGPUConfig = {
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  vertexBuffer: GPUBuffer;
  vertexUniformBuffer: GPUBuffer;
  fragmentUniformBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  vertexCount: number;
};

export type Frame = {
  passEncoder: GPURenderPassEncoder;
  finish(): void;
};

const CLEAR_COLOR_RGB = hexToRgb(CLEAR_COLOR);
const LINE_COLOR_RGB = hexToRgb(COLOR);

export function beginFrame(gpuContext: GPUContext): Frame {
  const { device, context, msaaTexture, depthTexture } = gpuContext;
  const commandEncoder = device.createCommandEncoder({
    label: 'wireframe_command_encoder',
  });

  const canvasTexture = context.getCurrentTexture();
  const msaaView = msaaTexture.createView();
  const resolveTarget = canvasTexture.createView();

  const passEncoder = commandEncoder.beginRenderPass({
    label: 'wireframe_render_pass',
    colorAttachments: [
      {
        view: msaaView,
        resolveTarget,
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
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
      depthClearValue: 1.0,
    },
  });

  return {
    passEncoder,
    finish() {
      passEncoder.end();
      device.queue.submit([commandEncoder.finish()]);
    },
  };
}

export class WireframeRenderer {
  private config: WireframeGPUConfig;

  private constructor(config: WireframeGPUConfig) {
    this.config = config;
  }

  static init(
    vertexCapacity: number,
    gpuContext: GPUContext,
  ): WireframeRenderer {
    const { device } = gpuContext;

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

    // 3 floats per vertex, 4 bytes per float
    const bufferSize = vertexCapacity * 3 * 4;

    const vertexBuffer = device.createBuffer({
      label: 'wireframe_vertex_buffer',
      size: bufferSize,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const vertexUniformBuffer = device.createBuffer({
      label: 'wireframe_vertex_uniform',
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const fragmentUniformBuffer = device.createBuffer({
      label: 'wireframe_fragment_uniform',
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

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
      pipeline,
      vertexBuffer,
      vertexUniformBuffer,
      fragmentUniformBuffer,
      bindGroup,
      vertexCount: 0,
    });
  }

  setVertices(data: Float32Array<ArrayBuffer>, vertexCount: number): void {
    this.config.device.queue.writeBuffer(this.config.vertexBuffer, 0, data);
    this.config.vertexCount = vertexCount;
  }

  draw(
    pass: GPURenderPassEncoder,
    { matrix, color }: WireframeRenderParams,
  ): void {
    const {
      device,
      pipeline,
      vertexBuffer,
      vertexUniformBuffer,
      fragmentUniformBuffer,
      bindGroup,
      vertexCount,
    } = this.config;

    if (vertexCount === 0) return;

    device.queue.writeBuffer(vertexUniformBuffer, 0, matrix.toFloat32Array());

    const colorArray = color
      ? Float32Array.from(color)
      : Float32Array.from(LINE_COLOR_RGB);
    device.queue.writeBuffer(fragmentUniformBuffer, 0, colorArray);

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(vertexCount);
  }
}
