import { httpGetText } from './http';

export interface Shader {
  program: WebGLProgram;
  attribLocations: {
    [name: string]: number;
  };
  uniformLocations: {
    [name: string]: WebGLUniformLocation;
  };
}

export async function initShaderProgram(
  gl: WebGL2RenderingContext,
  shaderName: string
): Promise<WebGLProgram> {
  const { vertSource, fragSource } = await fetchShaderSource(shaderName);
  const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
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

async function fetchShaderSource(
  shaderName: string
): Promise<{ vertSource: string; fragSource: string }> {
  const [vertSource, fragSource] = await Promise.all([
    httpGetText(`src/shaders/${shaderName}/${shaderName}.vert.glsl`),
    httpGetText(`src/shaders/${shaderName}/${shaderName}.frag.glsl`),
  ]);
  return { vertSource, fragSource };
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
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
