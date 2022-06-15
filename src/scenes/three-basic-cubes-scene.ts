import { vec3, vec4 } from 'gl-matrix';
import { Camera, createCamera } from '../camera';
import { createCubeGeometry } from '../geometries/cube-geometry';
import { createBasicMaterial } from '../materials/basic-material';
import { createMesh } from '../mesh';
import { createRenderer, Renderer, renderScene } from '../renderer';
import { addMesh, createScene, Scene } from '../scene';
import { createTimer, tick } from '../timer';

export interface ThreeBasicCubeSceneData {
  deltaRotation: vec3;
  cubeRotation1: vec3;
  cubeRotation2: vec3;
  cubeRotation3: vec3;
}

export async function createThreeBasicCubesScene(canvasSelector: string): Promise<void> {
  const renderer = await createRenderer(canvasSelector);
  const camera = createCamera(renderer);
  const scene = createScene();

  const sceneData = setup(renderer, camera, scene);

  const timer = createTimer();
  (function renderLoop(now: number = 0) {
    requestAnimationFrame(renderLoop);
    const delta = tick(timer, now);
    run(sceneData, delta);
    renderScene(renderer, camera, scene);
  })();
}

function setup(renderer: Renderer, _camera: Camera, scene: Scene): ThreeBasicCubeSceneData {
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

  return {
    deltaRotation,
    cubeRotation1,
    cubeRotation2,
    cubeRotation3,
  };
}

function run(data: ThreeBasicCubeSceneData, delta: number): void {
  const { deltaRotation, cubeRotation1, cubeRotation2, cubeRotation3 } = data;
  vec3.set(deltaRotation, delta, 1.5 * delta, 0);
  vec3.add(cubeRotation1, cubeRotation1, deltaRotation);
  vec3.scale(deltaRotation, deltaRotation, -1);
  vec3.add(cubeRotation2, cubeRotation2, deltaRotation);
  vec3.set(deltaRotation, 0, delta, 1.5 * delta);
  vec3.add(cubeRotation3, cubeRotation3, deltaRotation);
}
