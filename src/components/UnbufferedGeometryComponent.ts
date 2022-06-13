import { Component } from '../ecs';

export const UNBUFFERED_GEOMETRY = 'unbufferedGeometry';

export default class UnbufferedGeometryComponent extends Component {
  protected _name: string = UNBUFFERED_GEOMETRY;
}
