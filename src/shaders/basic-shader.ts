import { Shader } from '../shader';

export interface BasicShader extends Shader {
  attribLocations: {
    vertexPosition: number;
  };
  uniformLocations: {
    modelViewProjection: WebGLUniformLocation;
    color: WebGLUniformLocation;
  };
}

export const basicVertexShader = `
attribute vec4 vertexPosition;
uniform mat4 modelViewProjection;

void main() {
  gl_Position = modelViewProjection * vertexPosition;
}
`;

export const basicFragmentShader = `
uniform vec4 color;

void main() {
  gl_FragColor = color;
}
`;
