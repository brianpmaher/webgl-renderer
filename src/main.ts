import { initGl } from './gl';

function main(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#gl-canvas')!;

  const gl = initGl(canvas);
}

main();
