import { Component } from '../ecs';

export default class RenderStateComponent extends Component {
  protected readonly _name: string = 'renderState';
  public canvas: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    super();
    this.canvas = canvas;
    this.gl = gl;
  }
}
