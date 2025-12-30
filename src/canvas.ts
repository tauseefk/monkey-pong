const COLOR = '#519872';
const CLEAR_COLOR = '#585464';
const CANVAS_SIZE = 800;

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
    context2d.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    context2d.fill();
  };

  init();
}
