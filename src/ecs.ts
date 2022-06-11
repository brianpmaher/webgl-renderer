export interface Component extends Object {}

export interface ComponentMap {
  [name: string]: Component;
}

export interface Entity {
  id: number;
  name: string;
  components: ComponentMap;
}

export type System = (entities: Entity[]) => void;

export interface World {
  entitiesCreated: number;
  entities: Entity[];
  systems: System[];
}

export function createWorld(systems: System[] = []): World {
  return {
    entitiesCreated: 0,
    entities: [],
    systems: systems,
  };
}

export function createEntity(world: World, name: string, components: ComponentMap = {}): Entity {
  const id = world.entitiesCreated + 1; // first entity ID is 1
  world.entitiesCreated++;

  const entity: Entity = {
    id,
    name,
    components,
  };

  world.entities.push(entity);

  return entity;
}

export function runAllSystems(world: World): void {
  (function _runAllSystems() {
    requestAnimationFrame(_runAllSystems);
    const { systems, entities } = world;
    const numSystems = systems.length;
    for (let i = 0; i < numSystems; i++) systems[i](entities);
  })();
}

export function queryEntities(query: string[], entities: Entity[], out: Entity[]): Entity[] {
  out.length = 0; // clear without deleting array
  const numEntities = entities.length;
  const numQueries = query.length;

  for (let i = 0; i < numEntities; i++) {
    const entity = entities[i];
    // prettier-ignore
    for (let j = 0; j < numQueries; j++) 
      if (entity.components[query[j]]) 
        out.push(entity);
  }

  return out;
}
