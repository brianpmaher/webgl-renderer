import { Component } from '../ecs';
import { ShaderMap } from '../renderer/Shader';

export const SHADER_MAP = 'shaderMap';

export default class ShaderMapComponent extends Component {
  protected readonly _name: string = SHADER_MAP;
  public map: ShaderMap;

  constructor(shaderMap: ShaderMap) {
    super();
    this.map = shaderMap;
  }
}
