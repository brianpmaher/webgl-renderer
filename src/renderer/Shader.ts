import { mat4 } from 'gl-matrix';
import GeometryComponent from '../components/GeometryComponent';
import { httpGetText } from '../utils/http';

export interface ShaderMap {
  [shaderName: string]: Shader;
}

export interface AttribLocationMap {
  [name: string]: number;
}

export interface UniformLocationMap {
  [name: string]: WebGLUniformLocation;
}

export default abstract class Shader {
  public abstract readonly name: string;
  public abstract readonly program: WebGLProgram;
  public abstract readonly attribLocations: AttribLocationMap;
  public abstract readonly uniformLocations: UniformLocationMap;

  public abstract Compile(gl: WebGL2RenderingContext): Promise<void>;

  public abstract Bind(
    gl: WebGL2RenderingContext,
    geometry: GeometryComponent,
    modelViewMatrix: mat4,
    projectionMatrix: mat4
  ): void;

  protected async _CompileProgram(
    gl: WebGL2RenderingContext,
    fileBase: string
  ): Promise<WebGLProgram> {
    const { _CompileShader } = this;

    const [vertSource, fragSource] = await Promise.all([
      httpGetText(`src/shaders/${fileBase}/${fileBase}.vert.glsl`),
      httpGetText(`src/shaders/${fileBase}/${fileBase}.frag.glsl`),
    ]);

    const vertShader = _CompileShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragShader = _CompileShader(gl, gl.FRAGMENT_SHADER, fragSource);

    const program = gl.createProgram()!;

    if (program === null) throw new Error('Failed to create shader program');

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = new Error(`Failed linking shader: ${gl.getProgramInfoLog(program)}`);
      gl.deleteProgram(program);
      throw error;
    }

    return program;
  }

  protected _GetUniformLocation(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string
  ): WebGLUniformLocation {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`Unable to get uniform location for ${name}`);
    return location;
  }

  private _CompileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;

    if (shader === null) throw new Error('Failed to crete shader');

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = new Error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      throw error;
    }

    return shader;
  }
}
