import { mat4, vec2, vec3 } from 'gl-matrix';
import { PI_OVER_FOUR } from './math';
import { Renderer } from './renderer';
import { Transform } from './transform';

export interface ControlConfig {
  panSensitivity: number;
}

export interface ControlData {
  deltaPan: vec2;
  deltaRotate: vec2;
  deltaZoom: number;
}

export interface Camera {
  fov: number;
  aspect: number;
  zNear: number;
  zFar: number;
  projectionMatrix: mat4;
  viewMatrix: mat4;
  transform: Omit<Transform, 'modelMatrix' | 'scale'>;
  controlConfig: ControlConfig;
  controlData: ControlData;
  forward: vec3;
  up: vec3;
  right: vec3;
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
    controlConfig: {
      panSensitivity: 0.1,
    },
    controlData: {
      deltaPan: vec2.create(),
      deltaRotate: vec2.create(),
      deltaZoom: 0.0,
    },
    forward: vec3.create(),
    up: vec3.create(),
    right: vec3.create(),
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

export function setupOrbitalControls(renderer: Renderer, camera: Camera): void {
  const LEFT_MOUSE_BUTTON = 0;
  // const MIDDLE_MOUSE_BUTTON = 1;
  const RIGHT_MOUSE_BUTTON = 2;
  let isPanning = false;
  let isRotating = false;

  const { canvas } = renderer.gl;

  // stop context menu and middle mouse lock
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
  });

  canvas.addEventListener('mousedown', event => {
    event.preventDefault();

    switch (event.button) {
      case LEFT_MOUSE_BUTTON:
        isPanning = true;
        break;
      case RIGHT_MOUSE_BUTTON:
        isRotating = true;
        break;
    }
  });

  canvas.addEventListener('mouseup', event => {
    switch (event.button) {
      case LEFT_MOUSE_BUTTON:
        isPanning = false;
        vec2.zero(camera.controlData.deltaPan);
        break;
      case RIGHT_MOUSE_BUTTON:
        isRotating = false;
        vec2.zero(camera.controlData.deltaRotate);
        break;
    }
  });

  let mouseMoveTimeout: number;
  const handleMouseMoveTimeout = () => {
    vec2.zero(camera.controlData.deltaPan);
    vec2.zero(camera.controlData.deltaRotate);
  };
  canvas.addEventListener('mousemove', event => {
    if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);

    const { deltaPan, deltaRotate } = camera.controlData;

    mouseMoveTimeout = setTimeout(handleMouseMoveTimeout, 1);

    if (isPanning) {
      vec2.set(deltaPan, event.movementX, event.movementY);
      vec2.scale(deltaPan, deltaPan, 0.1);
    }
    if (isRotating) vec2.set(camera.controlData.deltaRotate, event.movementX, event.movementY);
  });

  canvas.addEventListener('wheel', event => {
    camera.controlData.deltaZoom = event.deltaY;
  });
}

let v1 = vec3.create();
let v2 = vec3.create();
export function updateOrbitalControls(camera: Camera): void {
  updateViewMatrix(camera);

  const { viewMatrix, forward, up, right } = camera;
  const { position } = camera.transform;
  const { deltaPan, deltaRotate, deltaZoom } = camera.controlData;
  const { panSensitivity } = camera.controlConfig;

  vec3.set(forward, viewMatrix[8], viewMatrix[9], viewMatrix[10]);
  vec3.negate(forward, forward);
  vec3.normalize(forward, forward);

  vec3.set(up, viewMatrix[4], viewMatrix[5], viewMatrix[6]);
  vec3.normalize(up, up);

  vec3.set(right, viewMatrix[0], viewMatrix[1], viewMatrix[2]);
  vec3.negate(right, right);
  vec3.normalize(right, right);

  vec3.zero(v1);
  vec3.scale(v1, right, -deltaPan[0] * panSensitivity);
  vec3.scale(v2, up, -deltaPan[1] * panSensitivity);
  vec3.add(position, position, v1);
  vec3.add(position, position, v2);

  // vec3.zero(scratchVec);
  // vec3.scale(scratchVec, up, deltaPan)
}
