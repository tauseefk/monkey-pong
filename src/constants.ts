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

export const SUZANNE_SCALE = 0.5;
export const SUZANNE_SPEED = { x: 1.8, y: 1.4 };
export const SUZANNE_BOUNDS = 0.78;
export const SUZANNE_INITIAL_Z = 4.0;
export const SUZANNE_ROTATION_AXIS = { x: 0, y: -1, z: 0 };
export const RAMP_DELAY = 2.0;
export const RAMP_DURATION = 5.0;

export const ID_WEBGPU_TARGET = 'canvas-webgpu';
