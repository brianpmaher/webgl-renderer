import { vec4 } from 'gl-matrix';
import { Geometry } from '../geometry';
import { bindAttribBuffer, Material } from '../material';
import { Renderer } from '../renderer';
import { BasicShader, BASIC_SHADER_NAME } from '../shaders/basic/basic-shader';

export interface BasicMaterial extends Material {
  shader: BasicShader;
  color: vec4;
}

export function createBasicMaterial(renderer: Renderer, color: vec4): BasicMaterial {
  const shader = renderer.shaders[BASIC_SHADER_NAME] as BasicShader;
  const material = {
    shader,
    bindBuffers: (geometry: Geometry) => bindBasicMaterial(renderer.gl, material, geometry),
    color,
  };

  return material;
}

function bindBasicMaterial(gl: WebGL2RenderingContext, material: Material, geometry: Geometry) {
  const shader = material.shader as BasicShader;

  bindAttribBuffer(gl, geometry.positionBuffer, shader.attribLocations.vertexPosition, gl.FLOAT, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);
}
