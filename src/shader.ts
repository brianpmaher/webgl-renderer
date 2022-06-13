export interface Shader {
  program: WebGLProgram;
  attribLocations: {
    [name: string]: number;
  };
  uniformLocations: {
    [name: string]: WebGLUniformLocation;
  };
}

export function initShaderProgram(
  gl: WebGL2RenderingContext,
  vertSource: string,
  fragSource: string
): WebGLProgram {
  const vertShader = loadShader(gl, gl.VERTEX_SHADER, vertSource);
  const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fragSource);
  const shaderProgram = gl.createProgram()!;

  if (shaderProgram === null) {
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    throw new Error('Failed to create shader program');
  }

  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    const message = `Unable to initialize the shader program: ${gl.getProgramInfoLog(
      shaderProgram
    )}`;
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    throw new Error(message);
  }

  return shaderProgram;
}

function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);

  if (shader === null) throw new Error('Failed to create shader');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`;
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}
