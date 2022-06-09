import { Shader } from './shader';

export interface Material {
  shader: Shader;
}

export interface SimpleTextureMaterial extends Material {
  texture: WebGLTexture;
}

// export function createSimpleTextureMaterial(
//   gl: WebGL2RenderingContext,
//   texture: WebGLTexture
// ): Promise<SimpleTextureMaterial> {
//   const shader = await loadShader(gl, 'simple-texture');

//   return {
//     shader,
//     texture,
//   };
// }
