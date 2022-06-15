import { mat4, vec3 } from 'gl-matrix';
import { Geometry } from './geometry';
import { Material } from './material';
import { Transform } from './transform';

export interface Mesh {
  geometry: Geometry;
  material: Material;
  transform: Transform;
}

export function createMesh(geometry: Geometry, material: Material): Mesh {
  return {
    geometry,
    material,
    transform: {
      modelMatrix: mat4.create(),
      position: vec3.fromValues(0, 0, 0),
      rotation: vec3.create(),
      scale: vec3.fromValues(1, 1, 1),
    },
  };
}
