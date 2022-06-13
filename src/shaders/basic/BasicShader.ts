import { mat4 } from 'gl-matrix';
import GeometryComponent from '../../components/GeometryComponent';
import { Shader } from '../../renderer';
import { AttribLocationMap, UniformLocationMap } from '../../renderer/Shader';

export default class BasicShader extends Shader {
  public readonly name: string = 'basic';
  public program!: WebGLProgram;
  public attribLocations!: AttribLocationMap;
  public uniformLocations!: UniformLocationMap;

  public async Compile(gl: WebGL2RenderingContext): Promise<void> {
    const program = await this._CompileProgram(gl, 'basic');
    this.program = program;

    this.attribLocations = {
      vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    };

    this.uniformLocations = {
      modelViewProjectionMatrix: this._GetUniformLocation(
        gl,
        program,
        'uModelViewProjectionMatrix'
      ),
      color: this._GetUniformLocation(gl, program, 'uColor'),
    };
  }

  public Bind(
    gl: WebGL2RenderingContext,
    geometry: GeometryComponent,
    modelViewMatrix: mat4,
    projectionMatrix: mat4
  ): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
    gl.vertexAttribPointer(
      this.attribLocations.vertexPosition,
      geometry.numVertexComponents,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);

    gl.useProgram(this.program);

    gl.uniformMatrix4fv(this.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(this.uniformLocations.projectionMatrix, false, projectionMatrix);
  }
}
