import { initShaderProgram, Shader } from '../../shader';

export const NORMAL_SHADER_NAME = 'normal';

export interface NormalShader extends Shader {
  attribLocations: {
    vertexPosition: number;
    vertexNormal: number;
  };
  uniformLocations: {
    modelViewProjection: WebGLUniformLocation;
  };
}

export async function loadNormalShader(gl: WebGL2RenderingContext): Promise<NormalShader> {
  const program = await initShaderProgram(gl, NORMAL_SHADER_NAME);

  return {
    program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, 'vertexPosition'),
      vertexNormal: gl.getAttribLocation(program, 'vertexNormal'),
    },
    uniformLocations: {
      modelViewProjection: gl.getUniformLocation(program, 'modelViewProjection')!,
    },
  };
}
