import { initShaderProgram, Shader } from '../../shader';

export const BASIC_SHADER_NAME = 'basic';

export interface BasicShader extends Shader {
  attribLocations: {
    vertexPosition: number;
  };
  uniformLocations: {
    modelViewProjection: WebGLUniformLocation;
    color: WebGLUniformLocation;
  };
}

export async function loadBasicShader(gl: WebGL2RenderingContext): Promise<BasicShader> {
  const program = await initShaderProgram(gl, BASIC_SHADER_NAME);

  return {
    program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, 'vertexPosition'),
    },
    uniformLocations: {
      modelViewProjection: gl.getUniformLocation(program, 'modelViewProjection')!,
      color: gl.getUniformLocation(program, 'color')!,
    },
  };
}
