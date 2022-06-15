import { mat4, vec3 } from 'gl-matrix';
import { PI_OVER_FOUR } from './math';
import { Renderer } from './renderer';
import { Transform } from './transform';

export interface Camera {
  fov: number;
  aspect: number;
  zNear: number;
  zFar: number;
  projectionMatrix: mat4;
  viewMatrix: mat4;
  transform: Omit<Transform, 'modelMatrix' | 'scale'>;
}

export function createCamera(renderer: Renderer): Camera {
  const { gl } = renderer;

  return {
    fov: PI_OVER_FOUR,
    aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
    zNear: 0.1,
    zFar: 100.0,
    projectionMatrix: mat4.create(),
    viewMatrix: mat4.create(),
    transform: {
      position: vec3.create(),
      rotation: vec3.create(),
    },
  };
}

export function updateAspectRatio(camera: Camera, canvas: HTMLCanvasElement): void {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
}

export function updateProjectionMatrix(camera: Camera): void {
  mat4.perspective(camera.projectionMatrix, camera.fov, camera.aspect, camera.zNear, camera.zFar);
}

export function updateViewMatrix(camera: Camera): void {
  const { viewMatrix } = camera;
  mat4.identity(viewMatrix);
  mat4.translate(viewMatrix, viewMatrix, camera.transform.position);
}
