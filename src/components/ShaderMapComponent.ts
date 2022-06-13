import { Component } from '../ecs';
import { ShaderMap } from '../renderer/Shader';

export default class ShaderMapComponent extends Component {
  protected readonly _name: string = 'shaderMap';
  public map: ShaderMap;

  constructor(shaderMap: ShaderMap) {
    super();
    this.map = shaderMap;
  }
}
