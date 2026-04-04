import type { Dimensions } from './types';

export const COLOR = '#519872';
export const CLEAR_COLOR = '#585464';
export const CANVAS_SIZE = 800;

export const SCREEN_DIMENSIONS: Dimensions = {
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
};

export const FPS = 60;
export const MILLIS_PER_FRAME = 1000 / FPS;

export const ID_WEBGPU_TARGET = 'canvas-webgpu';
