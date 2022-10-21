#pragma glslify: noise4 = require(../../glsl/utils/noises/snoise4.glsl);
#pragma glslify: snoise3 = require(../../glsl/utils/noises/snoise3.glsl);
#pragma glslify: rotate2d = require(../../glsl/utils/rotate2d.glsl);

attribute vec3 position;
attribute vec2 uv;


uniform float u_time;

varying vec2 v_uv;

void main() {

  v_uv = uv;


  vec3 pos = position;
  gl_Position =  vec4(pos, 1.0);
}