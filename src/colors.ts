import { hexToRgb } from './webGPU/hexToRgb';

export const Colors = {
  Periwinkle: '#B7C0EE',
  Banana: '#FFF275',
  Sage: '#519872',
  PowderBlue: '#AEC5EB',
  Charcoal: '#474350',
  Ash: '#585464',
  Snow: '#F9F4F5',
} as const;

export const ColorsRGB = {
  Periwinkle: hexToRgb(Colors.Periwinkle),
  Banana: hexToRgb(Colors.Banana),
  Sage: hexToRgb(Colors.Sage),
  PowderBlue: hexToRgb(Colors.PowderBlue),
  Charcoal: hexToRgb(Colors.Charcoal),
  Ash: hexToRgb(Colors.Ash),
  Snow: hexToRgb(Colors.Snow),
} as const;

export type Color = (typeof Colors)[keyof typeof Colors];
export type ColorRGB = (typeof ColorsRGB)[keyof typeof ColorsRGB];
