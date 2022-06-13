import Component, { ComponentMap } from './Component';

export default class Entity {
  public readonly id: number;
  public name: string;
  public components: ComponentMap;

  public constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.components = {};
  }

  public AddComponent(component: Component): Entity {
    this.components[component.name] = component;
    return this;
  }
}
