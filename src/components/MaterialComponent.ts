import { Component } from '../ecs';
import { Shader } from '../renderer';

export default abstract class MaterialComponent extends Component {
  protected _name: string = 'material';
  public abstract shaderType: string;
  public shader: Shader | null = null;
}
