import { mat4 } from 'gl-matrix';
import { PI_OVER_TWO } from './math';
import { Renderer } from './renderer';

export interface Camera {
  fov: number;
  aspect: number;
  zNear: number;
  zFar: number;
  projectionMatrix: mat4;
  viewMatrix: mat4;
}

export function createCamera(renderer: Renderer): Camera {
  const { gl } = renderer;

  return {
    fov: PI_OVER_TWO,
    aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
    zNear: 0.1,
    zFar: 100.0,
    projectionMatrix: mat4.create(),
    viewMatrix: mat4.create(),
  };
}

export function updateAspectRatio(camera: Camera, canvas: HTMLCanvasElement): void {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
}

export function updateProjectionMatrix(camera: Camera): void {
  mat4.perspective(camera.projectionMatrix, camera.fov, camera.aspect, camera.zNear, camera.zFar);
}
