import { BasicMaterialComponent, CubeGeometryComponent } from './components';
import { World } from './ecs';
import { RenderSystem } from './systems';
import Color from './utils/Color';

function main(): void {
  const world = new World('WebGL Playground');
  (window as any).world = world;

  world.AddSystem(RenderSystem);

  world
    .CreateEntity('Cube')
    .AddComponent(new CubeGeometryComponent())
    .AddComponent(new BasicMaterialComponent(new Color(0.0, 0.0, 1.0, 1.0)));

  world.Run();
}

main();
