import Entity from './Entity';
import System from './System';

export default class World {
  name: string;
  entities: Entity[];
  systems: System[];
  private nextEntityId: number;

  constructor(name: string) {
    this.name = name;
    this.entities = [];
    this.systems = [];
    this.nextEntityId = 1;
  }

  createEntity(name: string): Entity {
    const entity = new Entity(this.nextEntityId, name);
    this.nextEntityId++;
    this.entities.push(entity);
    return entity;
  }

  addSystem(system: System): World {
    this.systems.push(system);
    return this;
  }

  run(): void {
    const run_ = () => {
      requestAnimationFrame(run_);
      const { systems } = this;
      const numSystems = systems.length;
      for (let i = 0; i < numSystems; i++) systems[i].run(this.entities);
    };
    run_();
  }
}
