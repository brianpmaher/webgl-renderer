import { World } from './ecs';
import { RenderSystem } from './systems';

function main(): void {
  const world = new World('WebGL Playground');

  world.addSystem(new RenderSystem());

  world.createEntity('Cube');

  world.run();
}

main();
