import { Renderable } from './renderable';

export interface Scene {
  renderables: Renderable[];
}

export function createScene(): Scene {
  return {
    renderables: [],
  };
}
