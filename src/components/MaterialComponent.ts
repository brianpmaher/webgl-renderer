import { Component, Entity } from '../ecs';
import { Shader } from '../renderer';
import UnloadedMaterialComponent from './UnloadedMaterialComponent';

export const MATERIAL = 'material';

export default abstract class MaterialComponent extends Component {
  protected _name: string = MATERIAL;
  public abstract shaderType: string;
  public shader: Shader | null = null;

  public Bind(entity: Entity): void {
    super.Bind(entity);
    entity.AddComponent(new UnloadedMaterialComponent());
  }
}
