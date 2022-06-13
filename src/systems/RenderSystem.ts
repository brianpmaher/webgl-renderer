import { mat4 } from 'gl-matrix';
import { RenderStateComponent, ShaderMapComponent } from '../components';
import { GEOMETRY_BUFFERED } from '../components/GeometryBufferedComponent';
import GeometryComponent, { GEOMETRY } from '../components/GeometryComponent';
import MaterialComponent, { MATERIAL } from '../components/MaterialComponent';
import { MATERIAL_LOADED } from '../components/MaterialLoadedComponent';
import { Entity, System, World } from '../ecs';
import BasicShader from '../shaders/basic/BasicShader';

export default class RenderSystem extends System {
  private readonly _renderableEntities: Entity[] = [];
  private readonly _renderableEntitiesQuery: string[] = [
    GEOMETRY,
    GEOMETRY_BUFFERED,
    MATERIAL,
    MATERIAL_LOADED,
  ];

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // TODO: MOVE INTO CAMERA
    const fov = Math.PI / 2;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    // TODO: Add Mat4 class
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

    const entities = world.QueryAll(this._renderableEntitiesQuery, this._renderableEntities);
    const numEntities = entities.length;

    for (let i = 0; i < numEntities; i++) {
      const { components } = entities[i];
      const material = components[MATERIAL] as MaterialComponent;
      const geometry = components[GEOMETRY] as GeometryComponent;

      // TODO: Move these matrix calcs into Shader#Bind
      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

      material.shader!.Bind(gl, geometry, modelViewMatrix, projectionMatrix);

      gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }
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
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    return gl;
  }
}
