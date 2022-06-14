export interface Geometry {
  vertexCount: number;
  positionBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
}

export function initArrayBuffer(gl: WebGL2RenderingContext, array: Float32Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  if (buffer === null) throw new Error('Failed to create buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  return buffer;
}

export function initElementBuffer(gl: WebGL2RenderingContext, elements: Uint16Array): WebGLBuffer {
  const buffer = gl.createBuffer()!;
  if (buffer === null) throw new Error('Failed to create buffer');
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);
  return buffer;
}
