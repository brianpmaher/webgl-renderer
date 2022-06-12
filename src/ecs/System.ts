import Entity from './Entity';

export default abstract class System {
  abstract run(entities: Entity[]): void;
}
