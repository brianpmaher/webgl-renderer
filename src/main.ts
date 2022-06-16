import { createCanvas } from './canvas';
import { createNormalCubeScene } from './scenes/normal-material-scene';

async function main(): Promise<void> {
  createCanvas('gl-canvas', document.body);
  createNormalCubeScene('#gl-canvas');
}

main();
