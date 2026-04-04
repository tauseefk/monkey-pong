import type { ColorRGB } from '../colors';
import { CANVAS_SIZE } from '../constants';
import { Mat4x4 } from '../mat4x4';
import type { IndexedShape } from '../types';
import { expandFacesToTriangles } from './expandFaces';
import { DEPTH_FORMAT, type GPUContext } from './gpuContext';
import { createPipeline } from './gpuUtils';
import { solidFragmentShader, solidVertexShader } from './shaders/solid';

export type SolidRenderParams = {
  matrix: Mat4x4;
  color?: ColorRGB;
};

type SolidGPUConfig = {
  device: GPUDevice;
  pipeline: GPURenderPipeline;
  vertexBuffer: GPUBuffer;
  vertexUniformBuffer: GPUBuffer;
  fragmentUniformBuffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  vertexCount: number;
  projectionMatrix: Mat4x4;
};

const LIGHT_DIRECTION = (() => {
  const x = 1.0,
    y = 1.0,
    z = -1.0;
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len];
})();

export class SolidRenderer {
  private config: SolidGPUConfig;

  private constructor(config: SolidGPUConfig) {
    this.config = config;
  }

  static init(
    shape: IndexedShape,
    gpuContext: GPUContext,
  ): SolidRenderer {
    const { device } = gpuContext;

    const vertexBufferLayouts: GPUVertexBufferLayout[] = [
      {
        arrayStride: 6 * 4, // 6 floats × 4 bytes
        attributes: [
          {
            shaderLocation: 0, // position
            offset: 0,
            format: 'float32x3',
          },
          {
            shaderLocation: 1, // normal
            offset: 3 * 4,
            format: 'float32x3',
          },
        ],
      },
    ];

    const pipeline = createPipeline(
      device,
      { entryPoint: 'vs_main', code: solidVertexShader },
      { entryPoint: 'fs_main', code: solidFragmentShader },
      {
        label: 'solid_pipeline',
        topology: 'triangle-list',
        vertexBufferLayouts,
        cullMode: 'back',
        depthFormat: DEPTH_FORMAT,
      },
    );

    const triangleVertices = expandFacesToTriangles(shape);
    const vertexCount = triangleVertices.length / 6;

    const vertexBuffer = device.createBuffer({
      label: 'solid_vertex_buffer',
      size: triangleVertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, triangleVertices);

    // MVP matrix (64 bytes) + model matrix (64 bytes)
    const vertexUniformBuffer = device.createBuffer({
      label: 'solid_vertex_uniform',
      size: 128,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // color vec4 (16 bytes) + lightDirection vec3 (12 bytes) + padding (4 bytes)
    const fragmentUniformBuffer = device.createBuffer({
      label: 'solid_fragment_uniform',
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroup = device.createBindGroup({
      label: 'solid_bind_group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: vertexUniformBuffer } },
        { binding: 1, resource: { buffer: fragmentUniformBuffer } },
      ],
    });

    const projectionMatrix = Mat4x4.perspective(
      Math.PI / 2,
      CANVAS_SIZE / CANVAS_SIZE,
      0.1,
      100,
    );

    return new SolidRenderer({
      device,
      pipeline,
      vertexBuffer,
      vertexUniformBuffer,
      fragmentUniformBuffer,
      bindGroup,
      vertexCount,
      projectionMatrix,
    });
  }

  draw(
    pass: GPURenderPassEncoder,
    { matrix, color }: SolidRenderParams,
  ): void {
    const {
      device,
      pipeline,
      vertexBuffer,
      vertexUniformBuffer,
      fragmentUniformBuffer,
      bindGroup,
      vertexCount,
      projectionMatrix,
    } = this.config;

    const mvpMatrix = projectionMatrix.multiply(matrix);

    device.queue.writeBuffer(vertexUniformBuffer, 0, mvpMatrix.toFloat32Array());
    device.queue.writeBuffer(vertexUniformBuffer, 64, matrix.toFloat32Array());

    const colorArray = color ? Float32Array.from(color) : new Float32Array([1, 1, 1, 1]);
    const fragUniformData = new Float32Array([
      ...colorArray,
      ...LIGHT_DIRECTION,
      0, // padding
    ]);
    device.queue.writeBuffer(fragmentUniformBuffer, 0, fragUniformData);

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(vertexCount);
  }
}
