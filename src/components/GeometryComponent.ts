import { Component } from '../ecs';

export const GEOMETRY = 'geometry';

export default abstract class GeometryComponent extends Component {
  protected readonly _name: string = GEOMETRY;
  public abstract vertices: Float32Array;
  public abstract numVertexComponents: number;
  public abstract vertexBuffer: WebGLBuffer;
  public abstract indices: Uint16Array;
  public abstract indexBuffer: WebGLBuffer;

  public InitBuffers(gl: WebGL2RenderingContext): void {
    this.vertexBuffer = this._InitArrayBuffer(gl, this.vertices);
    this.indexBuffer = this._InitIndexBuffer(gl, this.indices);
  }

  protected _InitArrayBuffer(gl: WebGL2RenderingContext, bufferData: Float32Array): WebGLBuffer {
    return this._InitBuffer(gl, gl.ARRAY_BUFFER, bufferData);
  }

  protected _InitIndexBuffer(gl: WebGL2RenderingContext, bufferData: Uint16Array): WebGLBuffer {
    return this._InitBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, bufferData);
  }

  private _InitBuffer(
    gl: WebGL2RenderingContext,
    type: number,
    bufferData: Float32Array | Uint16Array
  ): WebGLBuffer {
    const buffer = gl.createBuffer()!;

    if (buffer === null) throw new Error('Unable to create buffer');

    gl.bindBuffer(type, buffer);
    gl.bufferData(type, bufferData, gl.STATIC_DRAW);

    return buffer;
  }
}
