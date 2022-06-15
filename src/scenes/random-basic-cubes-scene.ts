import { vec3, vec4 } from 'gl-matrix';
import { Camera, createCamera } from '../camera';
import { createCubeGeometry } from '../geometries/cube-geometry';
import { createBasicMaterial } from '../materials/basic-material';
import { createMesh } from '../mesh';
import { createRenderer, Renderer, renderScene } from '../renderer';
import { addMesh, createScene, Scene } from '../scene';

export async function createRandomBasicCubesScene(canvasSelector: string): Promise<void> {
  const renderer = await createRenderer(canvasSelector);
  const camera = createCamera(renderer);
  const scene = createScene();

  setup(renderer, camera, scene);

  renderScene(renderer, camera, scene);
}

function setup(renderer: Renderer, _camera: Camera, scene: Scene): void {
  const cubeGeometry = createCubeGeometry(renderer);

  for (let i = 0; i < 100; i++) {
    const redBasicMaterial = createBasicMaterial(
      renderer,
      vec4.fromValues(Math.random(), Math.random(), Math.random(), Math.random())
    );
    const cubeMesh1 = createMesh(cubeGeometry, redBasicMaterial);
    vec3.set(
      cubeMesh1.transform.position,
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      Math.random() * 5
    );
    addMesh(scene, cubeMesh1);
  }
}
