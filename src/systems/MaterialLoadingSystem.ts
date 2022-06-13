import { MaterialLoadedComponent } from '../components';
import MaterialComponent, { MATERIAL } from '../components/MaterialComponent';
import ShaderMapComponent, { SHADER_MAP } from '../components/ShaderMapComponent';
import UnloadedMaterialComponent, {
  UNLOADED_MATERIAL,
} from '../components/UnloadedMaterialComponent';
import { Entity, System, World } from '../ecs';

export default class MaterialLoadingSystem extends System {
  private readonly _unloadedEntities: Entity[] = [];
  private readonly _unloadedEntitiesQuery: string[] = [UNLOADED_MATERIAL, MATERIAL];

  public Run(world: World): void {
    const shaderMap = world.components[SHADER_MAP] as ShaderMapComponent;
    const entities = world.QueryAll(this._unloadedEntitiesQuery, this._unloadedEntities);
    const numEntities = entities.length;
    for (let i = 0; i < numEntities; i++) {
      const entity = entities[i];
      const material = entity.components[MATERIAL] as MaterialComponent;
      material.shader = shaderMap.map[material.shaderType];
      if (!material.shader)
        throw new Error(`Shader ${material.shaderType} not found in shader map`);
      const unloadedMaterial = entity.components[UNLOADED_MATERIAL] as UnloadedMaterialComponent;
      entity.RemoveComponent(unloadedMaterial);
      entity.AddComponent(new MaterialLoadedComponent());
    }
  }
}
