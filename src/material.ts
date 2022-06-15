import { mat4, vec3 } from 'gl-matrix';
import { Camera } from './camera';
import { Mesh } from './mesh';
import { Renderer } from './renderer';
import { Shader } from './shader';

export interface Transform {
  modelMatrix: mat4;
  translation: vec3;
  rotation: vec3;
  scale: vec3;
}

export interface Material {
  shader: Shader;
  bindBuffers: (renderer: Renderer, camera: Camera, mesh: Mesh) => void;
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
