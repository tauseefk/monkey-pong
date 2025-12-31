import type { Dimensions } from './types';

export const COLOR = '#519872';
export const CLEAR_COLOR = '#585464';
export const CANVAS_SIZE = 800;

export const SCREEN_DIMENSIONS: Dimensions = {
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
};

export const FPS = 60;
export const MILLIS_PER_FRAME = FPS / 1000;

export const ID_CANVAS_2D_TARGET = 'canvas-2d';
export const ID_WEBGPU_TARGET = 'canvas-webgpu';
export const ID_RENDER_MODE_GROUP = 'render-mode-group';
