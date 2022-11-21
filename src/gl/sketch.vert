#pragma glslify: noise4 = require(../glsl/utils/noises/snoise4.glsl);
#pragma glslify: noise2 = require(../glsl/utils/noises/snoise2.glsl);
// #pragma glslify: snoise3 = require(./utils/noises/snoise3.glsl);
#pragma glslify: rotate2d = require(../glsl/utils/rotate2d.glsl);

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 g_coords;
uniform mat3 normalMatrix;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
uniform sampler2D t_position;
varying vec2 v_uv;


void main() {

  v_uv = normalize(normalMatrix * normal).xz;
  // vec3 pos = position;

  vec3 g_pos = texture2D(t_position, g_coords).xyz;

  vec3 pos = g_pos.xyz;

  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  vec4 mvPos = viewMatrix * mPos;
  gl_Position = projectionMatrix * mvPos;
  gl_PointSize = 1.;


}