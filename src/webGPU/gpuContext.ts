export const MSAA_SAMPLE_COUNT = 4;

export const DEPTH_FORMAT: GPUTextureFormat = 'depth24plus';

export type GPUContext = {
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
  msaaTexture: GPUTexture;
  depthTexture: GPUTexture;
};

export async function initGPUContext(
  canvas: HTMLCanvasElement,
): Promise<GPUContext> {
  if (!navigator.gpu) {
    throw new Error("Your browser doesn't support WebGPU");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('No GPU adapter found');
  }

  const device = await adapter.requestDevice({ label: 'shared_device' });
  const context = canvas.getContext('webgpu');

  if (!context || !(context instanceof GPUCanvasContext)) {
    throw new Error('Failed to get WebGPU context');
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const msaaTexture = device.createTexture({
    label: 'msaa_texture',
    size: [canvas.width, canvas.height],
    sampleCount: MSAA_SAMPLE_COUNT,
    format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const depthTexture = device.createTexture({
    label: 'depth_texture',
    size: [canvas.width, canvas.height],
    sampleCount: MSAA_SAMPLE_COUNT,
    format: DEPTH_FORMAT,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  return { device, context, format, msaaTexture, depthTexture };
}
