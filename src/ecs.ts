export interface Component {}

export interface ComponentMap {
  [name: string]: Component;
}

export interface Entity {
  id: number;
  components: Component[];
}

export type System = (entities: Entity[]) => void;

export interface World {
  entitiesCreated: number;
  entities: Entity[];
  systems: System[];
}

export function createWorld(): World {
  return {
    entitiesCreated: 0,
    entities: [],
    systems: [],
  };
}

export function createEntity(world: World): Entity {
  const id = world.entitiesCreated + 1; // first entity ID is 1
  world.entitiesCreated++;

  const entity: Entity = {
    id,
    components: [],
  };

  world.entities.push(entity);

  return entity;
}

export function runAllSystems(world: World): void {
  const { systems, entities } = world;
  const numSystems = systems.length;
  for (let i = 0; i < numSystems; i++) systems[i](entities);
}
