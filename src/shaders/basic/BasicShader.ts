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
}
