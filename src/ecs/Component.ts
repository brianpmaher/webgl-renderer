import Entity from './Entity';

export interface ComponentMap {
  [name: string]: Component;
}

export default abstract class Component {
  protected abstract readonly _name: string;

  public GetName(): string {
    return this._name;
  }

  public Bind(_entity: Entity): void {}

  public Unbind(_entity: Entity): void {}
}
