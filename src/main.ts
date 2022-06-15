import { createCanvas } from './canvas';
import { createThreeBasicCubesScene } from './scenes/three-basic-cubes-scene';

// TODO: Add camera controls
// TODO: Add local normal shader
// TODO: Add world normal shader
// TODO: Add wireframe shader
// TODO: Load GLTF model
// TODO: Move each playground into its own HTML file to make switching between each more simple
async function main(): Promise<void> {
  createCanvas('gl-canvas', document.body);
  createThreeBasicCubesScene('#gl-canvas');
}

main();
