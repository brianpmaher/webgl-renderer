import { CAMERA_COMPONENT, createCameraComponent } from './components/camera-component';
import { createRenderComponent, RENDER_COMPONENT } from './components/render-component';
import { createEntity, createWorld, runAllSystems } from './ecs';
import { initRenderSystem, renderSystem } from './systems/render-system';

initRenderSystem('gl-canvas');

const world = createWorld([renderSystem]);

createEntity(world, 'camera', {
  [CAMERA_COMPONENT]: createCameraComponent(),
});

createEntity(world, 'cube', {
  [RENDER_COMPONENT]: createRenderComponent(),
});

runAllSystems(world);
