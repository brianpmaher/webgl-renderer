import { createRandomBasicCubesScene } from './scenes/random-basic-cubes-scene';
import { createThreeBasicCubesScene } from './scenes/three-basic-cubes-scene';

async function main(): Promise<void> {
  createThreeBasicCubesScene('#gl-canvas');
  createRandomBasicCubesScene('#gl-canvas-2');
}

main();
