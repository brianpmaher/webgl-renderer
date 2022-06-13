import { Component } from '../ecs';

export const UNLOADED_MATERIAL = 'unloadedMaterial';

export default class UnloadedMaterialComponent extends Component {
  protected _name: string = UNLOADED_MATERIAL;
}
