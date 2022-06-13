attribute vec4 aVertexPosition;

uniform mat4 uModelViewProjectionMatrix;

void main() {
  gl_Position = uModelViewProjectionMatrix * aVertexPosition;
}
