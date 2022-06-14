attribute vec4 vertexPosition;
uniform mat4 modelViewProjection;

void main() {
  gl_Position = modelViewProjection * vertexPosition;
}
