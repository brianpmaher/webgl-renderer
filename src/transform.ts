import { mat4, vec3 } from 'gl-matrix';

export interface Transform {
  modelMatrix: mat4;
  position: vec3;
  rotation: vec3;
  scale: vec3;
}

export function updateTransformMatrix(transform: Transform) {
  const { modelMatrix, position, rotation, scale } = transform;
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix, modelMatrix, position);
  mat4.rotateX(modelMatrix, modelMatrix, rotation[0]);
  mat4.rotateY(modelMatrix, modelMatrix, rotation[1]);
  mat4.rotateZ(modelMatrix, modelMatrix, rotation[2]);
  mat4.scale(modelMatrix, modelMatrix, scale);
}
