import { mat4 } from 'gl-matrix';
import { CameraComponent, CAMERA_COMPONENT } from '../components/camera-component';
import { RenderComponent, RENDER_COMPONENT } from '../components/render-component';
import { Entity, queryEntities } from '../ecs';
import { initGl } from '../renderer';

const renderQuery = [RENDER_COMPONENT];
const cameraQuery = [CAMERA_COMPONENT];
let renderableEntities: Entity[] = [];
let cameraEntites: Entity[] = [];
let gl: WebGL2RenderingContext;
const modelViewMatrix = mat4.create();
const normalMatrix = mat4.create();

export function initRenderSystem(canvasId: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  gl = initGl(canvas);
}

export function renderSystem(entities: Entity[]): void {
  clear();

  const cam = getCamera(entities);
  setProjectionMatrix(cam);

  mat4.identity(modelViewMatrix);
  updateNormalMatrix(modelViewMatrix);

  renderableEntities = queryEntities(renderQuery, entities, renderableEntities);
  const numEntities = renderableEntities.length;
  for (let i = 0; i < numEntities; i++) {
    const entity = renderableEntities[i];
    const renderComponent = entity.components[RENDER_COMPONENT] as RenderComponent;

    // TODO: Figure out how to draw multiple entities with each having their own transform.
    // TODO: Figure out how to update the camera position and rotation and apply that to any transforms.
  }
}

function clear() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function getCamera(entities: Entity[]): CameraComponent {
  const cameraEntity = queryEntities(cameraQuery, entities, cameraEntites)[0];
  return cameraEntity.components[CAMERA_COMPONENT] as CameraComponent;
}

function setProjectionMatrix(cam: CameraComponent): void {
  const projectionMatrix = cam.projectionMatrix;
  mat4.identity(projectionMatrix);
  cam.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(projectionMatrix, cam.fov, cam.aspect, cam.zNear, cam.zFar);
}

function updateNormalMatrix(modelViewMatrix: mat4): void {
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
}
