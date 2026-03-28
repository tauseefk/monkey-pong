import type { Shader } from './shaders/types';

type CreatePipelineOptions = {
  /** optional label to attach to the pipeline */
  label?: string;
  /** blend existing content */
  blend?: boolean;
  /** primitive topology (default: 'triangle-list') */
  topology?: GPUPrimitiveTopology;
  /** vertex format (default: 'float32x2') */
  vertexFormat?: 'float32x2' | 'float32x3';
  /** custom vertex buffer layouts (overrides vertexFormat if provided) */
  vertexBufferLayouts?: GPUVertexBufferLayout[];
  /** face culling mode (default: 'none') */
  cullMode?: GPUCullMode;
  /** front face winding (default: 'ccw') */
  frontFace?: GPUFrontFace;
  /** depth stencil format for depth testing */
  depthFormat?: GPUTextureFormat;
};

/**
 * Create a render pipeline
 */
export function createPipeline(
  device: GPUDevice,
  vertexShader: Shader,
  fragmentShader: Shader,
  {
    label = 'rendering_pipeline',
    blend,
    topology = 'triangle-list',
    vertexFormat = 'float32x2',
    vertexBufferLayouts,
    cullMode = 'none',
    frontFace = 'ccw',
    depthFormat,
  }: CreatePipelineOptions,
) {
  const floatCount = vertexFormat === 'float32x3' ? 3 : 2;

  const defaultBufferLayout: GPUVertexBufferLayout[] = [
    {
      arrayStride: floatCount * 4,
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: vertexFormat,
        },
      ],
    },
  ];

  const pipeline = device.createRenderPipeline({
    label,
    vertex: {
      module: device.createShaderModule({
        label: 'vertex_shader',
        code: vertexShader.code,
      }),
      entryPoint: vertexShader.entryPoint,
      buffers: vertexBufferLayouts ?? defaultBufferLayout,
    },
    fragment: {
      module: device.createShaderModule({
        label: 'fragment_shader',
        code: fragmentShader.code,
      }),
      entryPoint: fragmentShader.entryPoint,
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
          ...(blend
            ? {
                blend: {
                  color: {
                    srcFactor: 'src-alpha',
                    dstFactor: 'one-minus-src-alpha',
                    operation: 'add',
                  },
                  alpha: {
                    srcFactor: 'one',
                    dstFactor: 'one-minus-src-alpha',
                    operation: 'add',
                  },
                },
              }
            : {}),
        },
      ],
    },
    primitive: {
      topology,
      cullMode,
      frontFace,
    },
    ...(depthFormat
      ? {
          depthStencil: {
            format: depthFormat,
            depthWriteEnabled: true,
            depthCompare: 'less',
          },
        }
      : {}),
    multisample: { count: 4 },
    layout: 'auto',
  });

  return pipeline;
}
