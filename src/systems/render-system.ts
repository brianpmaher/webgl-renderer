import { Entity } from '../ecs';

export default function renderSystem(entities: Entity[]): void {
  const numEntities = entities.length;
  for (let i = 0; i < numEntities; i++) {
    const entity = entities[i];
    if (entity.components[])
  }
}
