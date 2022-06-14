import { Mesh } from './mesh';

export interface Scene {
  meshes: Mesh[];
}

export function createScene(): Scene {
  return {
    meshes: [],
  };
}

export function addMesh(scene: Scene, mesh: Mesh) {
  scene.meshes.push(mesh);
}
