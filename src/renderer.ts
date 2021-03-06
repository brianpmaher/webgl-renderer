import { vec4 } from 'gl-matrix';
import { Camera, updateAspectRatio, updateProjectionMatrix, updateViewMatrix } from './camera';
import { Scene } from './scene';
import { Shader } from './shader';
import { BASIC_SHADER_NAME, loadBasicShader } from './shaders/basic/basic-shader';
import { loadNormalShader, NORMAL_SHADER_NAME } from './shaders/normal/normal-shader';

export interface Renderer {
  gl: WebGL2RenderingContext;
  shaders: {
    [shaderName: string]: Shader;
  };
}

export async function createRenderer(
  canvasSelector: string,
  clearColor: vec4 = vec4.fromValues(0.0, 0.0, 0.0, 1.0)
): Promise<Renderer> {
  const canvas = document.querySelector<HTMLCanvasElement>(canvasSelector)!;

  canvas.height = canvas.clientHeight * devicePixelRatio;
  canvas.width = canvas.clientWidth * devicePixelRatio;

  window.addEventListener('resize', () => {
    canvas.height = canvas.clientHeight * devicePixelRatio;
    canvas.width = canvas.clientWidth * devicePixelRatio;
  });

  const gl = canvas.getContext('webgl2')!;

  if (gl === null) {
    const message = 'Unable to initialize WebGL';
    alert(message);
    throw new Error(message);
  }

  gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const [basicShader, normalShader] = await Promise.all([
    loadBasicShader(gl),
    loadNormalShader(gl),
  ]);

  const shaders = {
    [BASIC_SHADER_NAME]: basicShader,
    [NORMAL_SHADER_NAME]: normalShader,
  };

  return {
    gl,
    shaders,
  };
}

export function renderScene(renderer: Renderer, camera: Camera, scene: Scene): void {
  const { gl } = renderer;
  const { canvas } = gl;
  const { meshes } = scene;
  const numMeshes = meshes.length;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  updateAspectRatio(camera, canvas);
  updateProjectionMatrix(camera);
  updateViewMatrix(camera);

  for (let i = 0; i < numMeshes; i++) {
    const mesh = meshes[i];
    const { geometry, material } = mesh;
    const { shader } = material;

    gl.useProgram(shader.program);

    material.bindBuffers(renderer, camera, mesh);

    gl.drawElements(gl.TRIANGLES, geometry.vertexCount, gl.UNSIGNED_SHORT, 0);
  }
}
