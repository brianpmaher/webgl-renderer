import { Component } from '../ecs';

export const MATERIAL_LOADED = 'materialLoaded';

export default class MaterialLoadedComponent extends Component {
  protected _name: string = MATERIAL_LOADED;
}
