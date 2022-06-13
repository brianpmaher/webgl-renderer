import { initGl } from './gl';
import { loadBasicShader } from './shaders/basic-shader';

function main(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#gl-canvas')!;

  const gl = initGl(canvas);

  const shader = loadBasicShader(gl);

  // TODO: Load cube buffer and store transform and move cube around
}

main();
