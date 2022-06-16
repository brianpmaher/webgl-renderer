import { createCanvas } from './canvas';
import { createThreeBasicCubesScene } from './scenes/three-basic-cubes-scene';

async function main(): Promise<void> {
  createCanvas('gl-canvas', document.body);
  createThreeBasicCubesScene('#gl-canvas');
}

main();
