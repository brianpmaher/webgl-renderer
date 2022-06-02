import { Geometry } from './geometry';
import { Shader } from './shader';

export interface Material {
  shader: Shader;
  bindBuffers: (geometry: Geometry) => void;
}

export function bindAttribBuffer(
  gl: WebGL2RenderingContext,
  buffer: WebGLBuffer,
  bufferLocation: number,
  type: GLenum,
  numComponents: number
): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(bufferLocation, numComponents, type, false, 0, 0);
  gl.enableVertexAttribArray(bufferLocation);
}
