import { mat4 } from 'gl-matrix';
import Stats from 'stats.js';

const piOverFour = Math.PI / 4;

const glFloatSizeBytes = 4;

interface ShaderProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    textureCoord: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
    uSampler: WebGLUniformLocation;
  };
}

interface BufferData {
  position: WebGLBuffer;
  textureCoord: WebGLBuffer;
  indices: WebGLBuffer;
}

function main() {
  const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl2')!;
  if (gl === null) throw new Error('Your browser does not support WebGL');

  updateCanvasSize(gl);
  window.addEventListener('resize', () => updateCanvasSize(gl));

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const shaderProgram = createShaderProgram(gl, vsSource, fsSource)!;
  const programInfo: ShaderProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!,
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')!,
    },
  };

  const buffers = initBuffers(gl);

  const texture = loadTexture(gl, '../textures/crate/crate.diffuse.png');

  // Stats setup
  const stats = new Stats();
  const FPS = 0;
  stats.showPanel(FPS);
  document.body.appendChild(stats.dom);

  let then = 0;
  (function render(now: DOMHighResTimeStamp = 0) {
    stats.begin();

    now *= 0.001; // ms to s
    const deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, buffers, texture, deltaTime);

    stats.end();

    requestAnimationFrame(render);
  })();
}

function updateCanvasSize(gl: WebGL2RenderingContext) {
  const { canvas } = gl;
  const { clientWidth, clientHeight } = canvas;
  const devicePixelRatio = window.devicePixelRatio;
  const width = Math.round(clientWidth * devicePixelRatio);
  const height = Math.round(clientHeight * devicePixelRatio);

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);
}

let rotation = 0.0;

function drawScene(
  gl: WebGL2RenderingContext,
  programInfo: ShaderProgramInfo,
  buffers: BufferData,
  texture: WebGLTexture,
  deltaTime: number
) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projectionMatrix = mat4.create();
  {
    const fieldOfView = piOverFour;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  }

  // Set the drawing position to the the "identity" point, which is the center of the screen.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to start drawing the square.

  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
  rotation += deltaTime;
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.7, [0, 1, 0]);

  // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = glFloatSizeBytes * numComponents;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the texture coordinates from buffer
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = glFloatSizeBytes * numComponents;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL which indices to use to index the verices
  {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  }

  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

  {
    gl.activeTexture(gl.TEXTURE0); // Tell WebGL we want to affect texture unit 0.
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the texture to texture unit 0.
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0); // Tell the shader we bound texture to texture unit 0.
  }

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function initBuffers(gl: WebGL2RenderingContext): BufferData {
  // prettier-ignore
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // prettier-ignore
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ]
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // prettier-ignore
  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  return {
    position: positionBuffer!,
    textureCoord: textureCoordBuffer!,
    indices: indexBuffer!,
  };
}

function createShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
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

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
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

function loadTexture(gl: WebGL2RenderingContext, url: string): WebGLTexture {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  /* Because images have to be downloaded over the internet, they might take a 
     moment until they are ready. Until then, put a single pixel int he texture 
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

main();
