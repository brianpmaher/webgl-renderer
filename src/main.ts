import { vec4 } from 'gl-matrix';
import { createCamera } from './camera';
import { createCubeGeometry } from './geometries/cube-geometry';
import { createBasicMaterial } from './materials/basic-material';
import { createMesh } from './mesh';
import { createRenderer, renderScene } from './renderer';
import { addMesh as addToScene, createScene } from './scene';

async function main(): Promise<void> {
  const renderer = await createRenderer('#gl-canvas');
  const camera = createCamera(renderer);
  const scene = createScene();

  const cubeGeometry = createCubeGeometry(renderer);
  const basicMaterial = createBasicMaterial(renderer, vec4.fromValues(1.0, 0.0, 0.0, 1.0));
  const basicCubeMesh = createMesh(cubeGeometry, basicMaterial);
  addToScene(scene, basicCubeMesh);

  // TODO: Figure out how to rotate the cube

  let then = Date.now();
  (function renderLoop() {
    requestAnimationFrame(renderLoop);

    const now = Date.now();
    const delta = (now - then) * 0.001;
    then = now;

    renderScene(renderer, camera, scene);
  })();
}

main();
