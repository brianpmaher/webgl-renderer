export interface Shader {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexNormal: number;
    textureCoord: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    normalMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    uSampler: WebGLUniformLocation;
  };
}

export async function loadShader(gl: WebGL2RenderingContext, name: string): Promise<Shader> {
  const [vsSource, fsSource] = await Promise.all([
    fetch(`src/shaders/${name}/${name}.vert.glsl`).then(res => res.text()),
    fetch(`src/shaders/${name}/${name}.frag.glsl`).then(res => res.text()),
  ]);

  const shaderProgram = createShaderProgram(gl, vsSource, fsSource)!;

  const shader: Shader = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix')!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!,
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')!,
    },
  };

  return shader;
}

function createShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource)!;
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

  const shaderProgram = gl.createProgram()!;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));

  return shaderProgram;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('An error occurred compiling the shaders: ' + info);
  }

  return shader;
}
