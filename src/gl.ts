export function initGl(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2')!;

  if (gl === null) {
    const message = 'Unable to initialize WebGL';
    alert(message);
    throw new Error(message);
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return gl;
}
