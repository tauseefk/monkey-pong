const COLOR = '#519872';
const CLEAR_COLOR = '#585464';
const CANVAS_SIZE = 800;
const POINT_SIZE = 10;

type Dimensions = {
  width: number;
  height: number;
};

const SCREEN_DIMENSIONS: Dimensions = {
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
};

interface Point2D {
  x: number;
  y: number;
}

interface Point3D extends Point2D {
  z: number;
}

/**
 * Project the 3D point onto the XY-plane
 */
export const project = ({ x, y, z }: Point3D): Point2D => {
  return { x: x / z, y: y / z };
};

/**
 * Convert NDC coordinates to screen space coordinates
 *
 * [-1, -1] -> [1, 1]
 * [ 0,  0] -> [w, h]
 */
export const screen = (
  { x, y }: Point2D,
  screenDimensions: Dimensions,
): Point2D => {
  return {
    x: ((x + 1) / 2) * screenDimensions.width,
    y: (1 - (y + 1) / 2) * screenDimensions.height,
  };
};

const POINTS: Point3D[] = [
  { x: -0.5, y: 0.5, z: 1.0 },
  { x: 0.5, y: 0.5, z: 1.0 },
  { x: 0.5, y: -0.5, z: 1.0 },
  { x: -0.5, y: -0.5, z: 1.0 },
  { x: -0.5, y: 0.5, z: 2.0 },
  { x: 0.5, y: 0.5, z: 2.0 },
  { x: 0.5, y: -0.5, z: 2.0 },
  { x: -0.5, y: -0.5, z: 2.0 },
];

export function setupCanvas2d(element: HTMLCanvasElement) {
  const init = () => {
    element.width = CANVAS_SIZE;
    element.height = CANVAS_SIZE;

    const context2d = element.getContext('2d');
    if (!context2d) {
      throw new Error('Failed to get drawing context');
    }

    context2d.fillStyle = CLEAR_COLOR;
    context2d.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    context2d.fillStyle = COLOR;

    for (const point of POINTS) {
      const p = screen(project(point), SCREEN_DIMENSIONS);
      context2d.rect(p.x, p.y, POINT_SIZE, POINT_SIZE);
    }

    context2d.fill();
  };

  init();
}
