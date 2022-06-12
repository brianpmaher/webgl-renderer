import { toFirstLetterLowerCase } from '../utils/string';
import Component from './Component';

export default class Entity {
  id: number;
  name: string;
  components: { [componentName: string]: Component };

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.components = {};
  }

  addComponent(component: Component): Entity {
    const componentName = toFirstLetterLowerCase(component.constructor.name);
    this.components[componentName] = component;
    return this;
  }
}
