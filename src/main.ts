import { mat4 } from 'gl-matrix';

const piOverFour = Math.PI / 4;

const glFloatSizeBytes = 4;

interface ShaderProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
  };
}

interface BufferData {
  position: WebGLBuffer;
  color: WebGLBuffer;
  indices: WebGLBuffer;
}

function main() {
  const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl2')!;
  if (gl === null) alert('Your browser does not support WebGL');

  updateCanvasSize(gl);
  window.addEventListener('resize', () => updateCanvasSize(gl));

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = createShaderProgram(gl, vsSource, fsSource)!;
  const programInfo: ShaderProgramInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')!,
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')!,
    },
  };

  const buffers = initBuffers(gl);

  let then = 0;
  (function render(now: DOMHighResTimeStamp = 0) {
    now *= 0.001; // ms to s
    const deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, buffers, deltaTime);
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

function drawScene(gl: WebGL2RenderingContext, programInfo: ShaderProgramInfo, buffers: BufferData, deltaTime: number) {
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
    const offset = 0; // How many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = glFloatSizeBytes * numComponents;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the verices
  {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  }

  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

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
  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.
  let colors = [] as Array<number>;
  for (let i = 0; i < faceColors.length; i++) {
    const faceColor = faceColors[i];
    // Repeat each color four times for four vertices of each face.
    colors = colors.concat(faceColor, faceColor, faceColor, faceColor);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

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

  return {
    position: positionBuffer!,
    color: colorBuffer!,
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

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

main();
