import { Entity, System } from '../ecs';

export default class RenderSystem extends System {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

  constructor() {
    super();

    this.canvas = this.setupCanvas();
    this.gl = this.canvas.getContext('webgl2')!;
    if (this.gl === null) throw new Error('Unable to get WebGL2 render context!');
  }

  run(_entities: Entity[]): void {
    const { gl } = this;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private setupCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    document.body.appendChild(canvas);
    return canvas;
  }
}
