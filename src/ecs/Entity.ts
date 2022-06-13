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
    component.Bind(this);
    this.components[component.GetName()] = component;
    return this;
  }

  public RemoveComponent(component: Component): void {
    const componentName = component.GetName();
    this.components[componentName].Unbind(this);
    delete this.components[componentName];
  }
}
