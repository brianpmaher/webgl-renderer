import Color from '../utils/Color';
import MaterialComponent from './MaterialComponent';

export default class BasicMaterialComponent extends MaterialComponent {
  public shaderType = 'basic';
  public color: Color;

  public constructor(color: Color) {
    super();
    this.color = color;
  }
}
