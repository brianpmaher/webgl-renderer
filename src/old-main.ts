import { mat4 } from 'gl-matrix';
import { createCubeGeometry, Geometry } from './geometry';
import { MS_TO_S, PI_OVER_FOUR } from './math';
import { GL_FLOAT_SIZE_BYTES, initGl, loadTexture } from './renderer';
import { loadShader, Shader } from './shader';

async function main(): Promise<void> {
  const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
  const gl = initGl(canvas);
  const shader = await loadShader(gl, 'simple-texture');
  const cube = createCubeGeometry(gl);
  const texture = loadTexture(gl, '../textures/crate/crate.diffuse.png');

  let then = 0;
  (function render(now: DOMHighResTimeStamp = 0) {
    now *= MS_TO_S;
    const deltaTime = now - then;
    then = now;
    renderScene(gl, shader, cube, texture, deltaTime);
    requestAnimationFrame(render);
  })();
}

let rotation = 0.0;

function renderScene(
  gl: WebGL2RenderingContext,
  programInfo: Shader,
  buffers: Geometry,
  texture: WebGLTexture,
  deltaTime: number
): void {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projectionMatrix = mat4.create();
  {
    const fieldOfView = PI_OVER_FOUR;
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
    const stride = GL_FLOAT_SIZE_BYTES * numComponents;
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
    const stride = GL_FLOAT_SIZE_BYTES * numComponents;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord!);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL which indices to use to index the verices
  {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  }

  // Tell WebGL how to pull out the normals from the normal buffer into the vertexNormal attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = GL_FLOAT_SIZE_BYTES * numComponents;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
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

main();
