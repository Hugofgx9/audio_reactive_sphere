// #pragma glslify: noise4 = require(./utils/noise_4d.glsl);
// #pragma glslify: snoise3 = require(./utils/noises/snoise3.glsl);
// #pragma glslify: rotate2d = require(./utils/rotate2d.glsl);

attribute vec3 position;
attribute vec2 uv;


uniform float u_time;

varying vec2 v_uv;

void main() {

  v_uv = uv;
  vec3 pos = position;

  gl_Position =  vec4(pos, 1.0);
}