import { World } from './ecs';
import { RenderSystem } from './systems';

function main(): void {
  const world = new World('WebGL Playground');

  world.AddSystem(RenderSystem);

  world.CreateEntity('Cube');

  world.Run();
}

main();
