import { mat4 } from 'gl-matrix';
import { PI_OVER_FOUR } from '../math';

export interface CameraComponent {
  fov: number;
  aspect: number;
  zNear: number;
  zFar: number;
  projectionMatrix: mat4;
}

export const CAMERA_COMPONENT = 'camera';

export function createCameraComponent(): CameraComponent {
  return {
    fov: PI_OVER_FOUR,
    aspect: 1,
    zNear: 0.1,
    zFar: 100.0,
    projectionMatrix: mat4.create(),
  };
}
