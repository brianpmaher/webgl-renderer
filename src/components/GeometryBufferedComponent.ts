import { Component } from '../ecs';

export const GEOMETRY_BUFFERED = 'geometryBuffered';

export default class GeometryBufferedComponent extends Component {
  protected _name: string = GEOMETRY_BUFFERED;
}
