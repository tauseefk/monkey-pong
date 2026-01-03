export type TunnelConfig = {
  squareCount: number;
  zNear: number;
  zFar: number;
  speed: number;
  squareSize: number;
};

export const DEFAULT_TUNNEL_CONFIG: TunnelConfig = {
  squareCount: 4,
  zNear: 0.3,
  zFar: 40.0,
  speed: 2.0,
  squareSize: 1.0,
};
