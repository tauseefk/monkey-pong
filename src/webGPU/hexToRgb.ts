export const hexToRgb = (hex: string): [number, number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || [
    '#',
    'ff',
    'd7',
    '00',
  ];

  return [
    parseInt(result[1], 16) / 256,
    parseInt(result[2], 16) / 256,
    parseInt(result[3], 16) / 256,
    1.0,
  ];
};
