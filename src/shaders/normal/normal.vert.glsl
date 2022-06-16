attribute vec4 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 modelViewProjection;

varying lowp vec4 color;

void main() {
  gl_Position = modelViewProjection * vertexPosition;
  color = vec4(vertexNormal, 1.0);
}
