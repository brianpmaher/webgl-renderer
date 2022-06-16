import { vec3, vec4 } from 'gl-matrix';
import { createCamera, setupOrbitalControls, updateOrbitalControls } from '../camera';
import { createCubeGeometry } from '../geometries/cube-geometry';
import { createBasicMaterial } from '../materials/basic-material';
import { createMesh } from '../mesh';
import { createRenderer, renderScene } from '../renderer';
import { addMesh, createScene } from '../scene';
import { createTimer, tick } from '../timer';

export async function createThreeBasicCubesScene(canvasSelector: string): Promise<void> {
  const renderer = await createRenderer(canvasSelector);
  const camera = createCamera(renderer);
  setupOrbitalControls(renderer, camera);
  vec3.set(camera.transform.position, 0, 0, -15);
  const scene = createScene();

  const cubeGeometry = createCubeGeometry(renderer);
  const redBasicMaterial = createBasicMaterial(renderer, vec4.fromValues(1.0, 0.0, 0.0, 1.0));
  const cubeMesh1 = createMesh(cubeGeometry, redBasicMaterial);
  vec3.set(cubeMesh1.transform.position, 2, -1, 0);
  const cubeRotation1 = cubeMesh1.transform.rotation;
  addMesh(scene, cubeMesh1);

  const blueBasicMaterial = createBasicMaterial(renderer, vec4.fromValues(0.0, 0.0, 1.0, 1.0));
  const cubeMesh2 = createMesh(cubeGeometry, blueBasicMaterial);
  vec3.set(cubeMesh2.transform.position, -2, -1, 0);
  const cubeRotation2 = cubeMesh2.transform.rotation;
  addMesh(scene, cubeMesh2);

  const greenBasicMaterial = createBasicMaterial(renderer, vec4.fromValues(0.0, 1.0, 0.0, 1.0));
  const cubeMesh3 = createMesh(cubeGeometry, greenBasicMaterial);
  vec3.set(cubeMesh3.transform.position, 0, 2, 0);
  const cubeRotation3 = cubeMesh3.transform.rotation;
  addMesh(scene, cubeMesh3);

  const deltaRotation = vec3.create();

  const timer = createTimer();
  (function renderLoop(now: number = 0) {
    requestAnimationFrame(renderLoop);
    const delta = tick(timer, now);
    vec3.set(deltaRotation, delta, 1.5 * delta, 0);
    vec3.add(cubeRotation1, cubeRotation1, deltaRotation);
    vec3.scale(deltaRotation, deltaRotation, -1);
    vec3.add(cubeRotation2, cubeRotation2, deltaRotation);
    vec3.set(deltaRotation, 0, delta, 1.5 * delta);
    vec3.add(cubeRotation3, cubeRotation3, deltaRotation);
    renderScene(renderer, camera, scene);
    updateOrbitalControls(camera);
  })();
}
