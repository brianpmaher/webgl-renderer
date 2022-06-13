import Entity from './Entity';
import World from './World';

export interface SystemStatic {
  new (): System;
}

export type QueryEntitiesFunction = (query: string[], out: Entity[]) => Entity[];

export default abstract class System {
  public Init(_world: World): void {}

  public abstract Run(world: World): void;
}
