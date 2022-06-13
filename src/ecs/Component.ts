export interface ComponentMap {
  [name: string]: Component;
}

export default abstract class Component {
  protected abstract readonly _name: string;

  public GetName(): string {
    return this._name;
  }
}
