export let GL: WebGL2RenderingContext;

export function initGl(): void {
  const canvas = createCanvas();
  GL = canvas.getContext('webgl2')!;
  if (GL === null) throw new Error('Unable to get WebGL2 rendering context from canvas.');
}

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.style.height = '100%';
  canvas.style.width = '100%';
  document.body.appendChild(canvas);
  return canvas;
}
