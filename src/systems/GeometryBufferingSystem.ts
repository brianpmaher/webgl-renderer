import { RenderStateComponent } from '../components';
import GeometryComponent, { GEOMETRY } from '../components/GeometryComponent';
import { UNBUFFERED_GEOMETRY } from '../components/UnbufferedGeometryComponent';
import { Entity, System, World } from '../ecs';

export default class GeometryBufferingSystem extends System {
  private _unbufferedEntities: Entity[] = [];
  private _unbufferedEntitiesQuery: string[] = [UNBUFFERED_GEOMETRY, GEOMETRY];

  public Run(world: World): void {
    const { _unbufferedEntities: entities } = this;
    world.QueryAll(this._unbufferedEntitiesQuery, entities);

    const { gl } = world.components.renderState as RenderStateComponent;

    const numEntities = entities.length;
    for (let i = 0; i < numEntities; i++) {
      const entity = entities[i];
      const unbufferedGeometry = entity.components.unbufferedGeometry as GeometryComponent;
      const geometry = entity.components.geometry as GeometryComponent;
      geometry.InitBuffers(gl);
      entity.RemoveComponent(unbufferedGeometry);
    }
  }
}
