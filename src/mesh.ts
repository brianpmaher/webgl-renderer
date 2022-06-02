import { Geometry } from './geometry';
import { Material } from './material';

export interface Mesh {
  geometry: Geometry;
  material: Material;
}

export function createMesh(geometry: Geometry, material: Material): Mesh {
  return {
    geometry,
    material,
  };
}

export function drawMesh(mesh: Mesh): void {}
