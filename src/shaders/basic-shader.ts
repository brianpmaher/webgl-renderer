import { initShaderProgram, Shader } from '../shader';

export interface BasicShader extends Shader {
  attribLocations: {
    vertexPosition: number;
  };
  uniformLocations: {
    modelViewProjection: WebGLUniformLocation;
    color: WebGLUniformLocation;
  };
}

const vertSource = `
attribute vec4 vertexPosition;
uniform mat4 modelViewProjection;

void main() {
  gl_Position = modelViewProjection * vertexPosition;
}
`;

const fragSource = `
uniform lowp vec4 color;

void main() {
  gl_FragColor = color;
}
`;

export function loadBasicShader(gl: WebGL2RenderingContext): BasicShader {
  const program = initShaderProgram(gl, vertSource, fragSource);

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
