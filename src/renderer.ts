export const GL_FLOAT_SIZE_BYTES = 4;

export function initGl(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2')!;
  if (gl === null) throw new Error('Your browser does not support WebGL');

  updateCanvasSize(gl);
  window.addEventListener('resize', () => updateCanvasSize(gl));

  return gl;
}

export function createBuffer(gl: WebGL2RenderingContext, data: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (buffer === null) throw new Error('Unable to create buffer');

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  return buffer;
}

export function createElementBuffer(gl: WebGL2RenderingContext, data: Uint16Array): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (buffer === null) throw new Error('Unable to create buffer');

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  return buffer;
}

export function loadTexture(gl: WebGL2RenderingContext, url: string): WebGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  /* Because images have to be downloaded over the internet, they might take a 
     moment until they are ready. Until then, put a single pixel in the texture 
     so we can use it immediately. Whent he image has finished downloading, we'll 
     update the texture with the contents of the image. */
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  image.src = url;

  return texture!;
}

export function bindArrayBuffer(
  gl: WebGL2RenderingContext,
  buffer: WebGLBuffer,
  bufferAttribLocation: number,
  numComponents: number
): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(bufferAttribLocation, numComponents, gl.FLOAT, false, GL_FLOAT_SIZE_BYTES * numComponents, 0);
  gl.enableVertexAttribArray(bufferAttribLocation);
}

function updateCanvasSize(gl: WebGL2RenderingContext): void {
  const { canvas } = gl;
  const { clientWidth, clientHeight } = canvas;
  const devicePixelRatio = window.devicePixelRatio;
  const width = Math.round(clientWidth * devicePixelRatio);
  const height = Math.round(clientHeight * devicePixelRatio);

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);
}
