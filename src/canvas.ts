export function createCanvas(
  id: string,
  parent: HTMLElement,
  heightStyle: string = '100%',
  widthStyle: string = '100%'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;

  canvas.id = id;
  canvas.style.height = heightStyle;
  canvas.style.width = widthStyle;

  parent.appendChild(canvas);

  return canvas;
}
