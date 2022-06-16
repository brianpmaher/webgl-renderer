import { vec3, vec4 } from 'gl-matrix';
import { createCamera } from '../camera';
import { createCubeGeometry } from '../geometries/cube-geometry';
import { createNormalMaterial } from '../materials/normal-material';
import { createMesh } from '../mesh';
import { createRenderer, renderScene } from '../renderer';
import { addMesh, createScene } from '../scene';
import { createTimer, tick } from '../timer';

export async function createNormalCubeScene(canvasSelector: string) {
  const renderer = await createRenderer(canvasSelector, vec4.fromValues(1.0, 1.0, 1.0, 1.0));
  const camera = createCamera(renderer);
  vec3.set(camera.transform.position, 0, 0, -15);
  const scene = createScene();

  const cubeGeometry = createCubeGeometry(renderer);
  const normalMaterial = createNormalMaterial(renderer);
  const cubeMesh = createMesh(cubeGeometry, normalMaterial);
  vec3.set(cubeMesh.transform.position, 2, -1, 0);
  const cubeRotation = cubeMesh.transform.rotation;
  addMesh(scene, cubeMesh);

  const deltaRotation = vec3.create();

  const timer = createTimer();
  (function renderLoop(now: number = 0) {
    requestAnimationFrame(renderLoop);
    const delta = tick(timer, now);
    vec3.set(deltaRotation, delta, 1.5 * delta, 0);
    vec3.add(cubeRotation, cubeRotation, deltaRotation);
    renderScene(renderer, camera, scene);
  })();
}
