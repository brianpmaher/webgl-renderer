import { mat4 } from 'gl-matrix';
import { Camera } from '../camera';
import { bindAttribBuffer, Material } from '../material';
import { Mesh } from '../mesh';
import { Renderer } from '../renderer';
import { NormalShader, NORMAL_SHADER_NAME } from '../shaders/normal/normal-shader';
import { updateTransformMatrix } from '../transform';

export interface NormalMaterial extends Material {
  shader: NormalShader;
  mvpMatrix: mat4;
}

export function createNormalMaterial(renderer: Renderer): NormalMaterial {
  const shader = renderer.shaders[NORMAL_SHADER_NAME] as NormalShader;
  const material = {
    shader,
    bindBuffers: (renderer: Renderer, camera: Camera, mesh: Mesh) =>
      bindBuffers(renderer, camera, mesh),
    mvpMatrix: mat4.create(),
  };

  return material;
}

function bindBuffers(renderer: Renderer, camera: Camera, mesh: Mesh): void {
  const { gl } = renderer;
  const material = mesh.material as NormalMaterial;
  const { geometry, transform } = mesh;
  const { mvpMatrix } = material;
  const shader = material.shader as NormalShader;
  const { viewMatrix, projectionMatrix } = camera;
  const { modelMatrix } = transform;

  bindAttribBuffer(gl, geometry.positionBuffer, shader.attribLocations.vertexPosition, gl.FLOAT, 3);
  bindAttribBuffer(gl, geometry.normalBuffer, shader.attribLocations.vertexNormal, gl.FLOAT, 3);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);

  updateTransformMatrix(transform);
  mat4.mul(mvpMatrix, viewMatrix, modelMatrix);
  mat4.mul(mvpMatrix, projectionMatrix, mvpMatrix);
  gl.uniformMatrix4fv(material.shader.uniformLocations.modelViewProjection, false, mvpMatrix);
}
