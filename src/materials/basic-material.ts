import { mat4, vec4 } from 'gl-matrix';
import { Camera } from '../camera';
import { bindAttribBuffer, Material } from '../material';
import { Mesh } from '../mesh';
import { Renderer } from '../renderer';
import { BasicShader, BASIC_SHADER_NAME } from '../shaders/basic/basic-shader';
import { updateTransformMatrix } from '../transform';

export interface BasicMaterial extends Material {
  shader: BasicShader;
  color: vec4;
  mvpMatrix: mat4;
}

export function createBasicMaterial(renderer: Renderer, color: vec4): BasicMaterial {
  const shader = renderer.shaders[BASIC_SHADER_NAME] as BasicShader;
  const material = {
    shader,
    bindBuffers: (renderer: Renderer, camera: Camera, mesh: Mesh) =>
      bindBuffers(renderer, camera, mesh),
    color,
    mvpMatrix: mat4.create(),
  };

  return material;
}

function bindBuffers(renderer: Renderer, camera: Camera, mesh: Mesh): void {
  const { gl } = renderer;
  const material = mesh.material as BasicMaterial;
  const { geometry, transform } = mesh;
  const { mvpMatrix } = material;
  const shader = material.shader as BasicShader;
  const { viewMatrix, projectionMatrix } = camera;
  const { modelMatrix } = transform;

  bindAttribBuffer(gl, geometry.positionBuffer, shader.attribLocations.vertexPosition, gl.FLOAT, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);

  updateTransformMatrix(transform);
  mat4.mul(mvpMatrix, viewMatrix, modelMatrix);
  mat4.mul(mvpMatrix, projectionMatrix, mvpMatrix);
  gl.uniformMatrix4fv(material.shader.uniformLocations.modelViewProjection, false, mvpMatrix);
  gl.uniform4fv(material.shader.uniformLocations.color, (material as BasicMaterial).color);
}
