import { RenderStateComponent } from '../components';
import GeometryBufferedComponent from '../components/GeometryBufferedComponent';
import GeometryComponent, { GEOMETRY } from '../components/GeometryComponent';
import { UNBUFFERED_GEOMETRY } from '../components/UnbufferedGeometryComponent';
import { Entity, System, World } from '../ecs';

export default class GeometryBufferingSystem extends System {
  private readonly _unbufferedEntities: Entity[] = [];
  private readonly _unbufferedEntitiesQuery: string[] = [UNBUFFERED_GEOMETRY, GEOMETRY];

  public Run(world: World): void {
    const entities = world.QueryAll(this._unbufferedEntitiesQuery, this._unbufferedEntities);

    const { gl } = world.components.renderState as RenderStateComponent;

    const numEntities = entities.length;
    for (let i = 0; i < numEntities; i++) {
      const entity = entities[i];
      const unbufferedGeometry = entity.components.unbufferedGeometry as GeometryComponent;
      const geometry = entity.components.geometry as GeometryComponent;
      geometry.InitBuffers(gl);
      entity.RemoveComponent(unbufferedGeometry);
      entity.AddComponent(new GeometryBufferedComponent());
    }
  }
}
