import { ComponentMap } from './Component';
import Entity from './Entity';
import World from './World';

export interface SystemStatic {
  new (): System;
}

export default abstract class System {
  public abstract Init(world: World): void;
  public abstract Run(entities: Entity[], worldComponents: ComponentMap): void;
}
