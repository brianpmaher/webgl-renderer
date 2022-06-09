import { Geometry } from './geometry';
import { Material } from './material';

export interface Mesh {
  geometry: Geometry;
  material: Material;
}
