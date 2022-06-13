import Component, { ComponentMap } from './Component';
import Entity from './Entity';
import System, { SystemStatic } from './System';

export default class World {
  public readonly name: string;
  public readonly entities: Entity[];
  public readonly systems: System[];
  public readonly components: ComponentMap;
  private _nextEntityId: number;

  public constructor(name: string) {
    this.name = name;
    this.entities = [];
    this.systems = [];
    this.components = {};
    this._nextEntityId = 1;
  }

  public CreateEntity(name: string): Entity {
    const entity = new Entity(this._nextEntityId, name);
    this._nextEntityId++;
    this.entities.push(entity);
    return entity;
  }

  public AddSystem(SystemClass: SystemStatic): World {
    const system = new SystemClass();
    system.Init(this);
    this.systems.push(system);
    return this;
  }

  public AddComponent(component: Component): World {
    this.components[component.GetName()] = component;
    return this;
  }

  public Run(): void {
    const run_ = () => {
      requestAnimationFrame(run_);
      const { entities, systems, components } = this;
      const numSystems = systems.length;
      for (let i = 0; i < numSystems; i++) systems[i].Run(entities, components);
    };
    run_();
  }
}
