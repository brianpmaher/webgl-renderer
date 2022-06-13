import { RenderStateComponent, ShaderMapComponent } from '../components';
import { System, World } from '../ecs';
import BasicShader from '../shaders/basic/BasicShader';

export default class RenderSystem extends System {
  public Init(world: World): void {
    const canvas = this._InitCanvas();
    const gl = this._InitGl(canvas);

    world.AddComponent(new RenderStateComponent(canvas, gl));

    const basicShader = new BasicShader();

    basicShader.Compile(gl);

    world.AddComponent(
      new ShaderMapComponent({
        [basicShader.name]: basicShader,
      })
    );
  }

  public Run(world: World): void {
    const { gl } = world.components.renderState as RenderStateComponent;

    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private _InitCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    document.body.appendChild(canvas);
    return canvas;
  }

  private _InitGl(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    const gl = canvas.getContext('webgl2')!;
    if (gl === null) throw new Error('Unable to get WebGL2 render context!');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    return gl;
  }
}
