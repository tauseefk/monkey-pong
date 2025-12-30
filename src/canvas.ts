const COLOR = '#519872';
const CLEAR_COLOR = '#585464';
const CANVAS_SIZE = 800;

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
  // front face
  { x: -0.5, y: 0.5, z: -0.5 },
  { x: 0.5, y: 0.5, z: -0.5 },
  { x: 0.5, y: -0.5, z: -0.5 },
  { x: -0.5, y: -0.5, z: -0.5 },
  // back face
  { x: -0.5, y: 0.5, z: 0.5 },
  { x: 0.5, y: 0.5, z: 0.5 },
  { x: 0.5, y: -0.5, z: 0.5 },
  { x: -0.5, y: -0.5, z: 0.5 },
];

const FACES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

const FPS = 60;
const MILLIS_PER_FRAME = 1000;

const rotate_xz = ({ x, y, z }: Point3D, angle: number) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
};

const translate = ({ x, y, z }: Point3D, dz: number) => {
  return { x, y, z: z + dz };
};

export function setupCanvas2d(element: HTMLCanvasElement) {
  element.width = CANVAS_SIZE;
  element.height = CANVAS_SIZE;

  const context2d = element.getContext('2d');

  if (!context2d) {
    throw new Error('Failed to get drawing context');
  }

  let angle = 0;
  const dt = 1 / FPS;

  const clear = () => {
    context2d.fillStyle = CLEAR_COLOR;
    context2d.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };

  const draw = () => {
    clear();

    context2d.strokeStyle = COLOR;
    context2d.lineWidth = 2;

    angle += (Math.PI * dt) / 2;
    context2d.beginPath();

    for (const face of FACES) {
      for (let idx = 0; idx < face.length; idx++) {
        const from = POINTS[face[idx]];
        const to = POINTS[face[(idx + 1) % face.length]];

        const projectedFrom = screen(
          project(translate(rotate_xz(from, angle), 2.0)),
          SCREEN_DIMENSIONS,
        );
        const projectedTo = screen(
          project(translate(rotate_xz(to, angle), 2.0)),
          SCREEN_DIMENSIONS,
        );

        context2d.moveTo(projectedFrom.x, projectedFrom.y);
        context2d.lineTo(projectedTo.x, projectedTo.y);
      }
    }
    context2d.stroke();

    setTimeout(draw, FPS / MILLIS_PER_FRAME);
  };

  draw();
}
