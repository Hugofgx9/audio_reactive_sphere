#pragma glslify: noise4 = require(../../glsl/utils/noises/snoise4.glsl);
#pragma glslify: noise2 = require(../../glsl/utils/noises/snoise2.glsl);
// #pragma glslify: snoise3 = require(./utils/noises/snoise3.glsl);
#pragma glslify: rotate2d = require(../../glsl/utils/rotate2d.glsl);

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat3 normalMatrix;



uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;

varying vec2 v_uv;

void main() {

  v_uv = normalize(normalMatrix * normal).xz;
  // vec3 pos = position;

  // pos += sin(u_time + pos.y * 1.) * normal;

  // pos += cross(normal, vec3(1., 0., 0.)) * u_time;

  // vec3 pos = position;
  // vec3 pos = position + (normal * distortion);
  // float spin = pow(pos.y + 1.0, 1.0) * 4.;
  // // float radius = sin(0.5 - pow(pos.y, 0.8));
  // float radius = 1.;
  // // float l = exp(pos.y);
  // pos.xz = rotate2d(pos.xz, spin) * radius;

  

  float distortion = noise4(vec4(normal * 1., u_time * 0.01)) * 0.15;
  vec3 pos = position + (normal * distortion);

  // pos.xyz *= (noise2((u_time + pos.x) * .5 + .5, 1.) + .4);
  pos.xyz *= (sin(u_time + pos.z) * .5 + .5) + .4;

  float angle = (position.y * 1. + u_time * 0.5) * 10.;
  pos.xz = rotate2d(pos.xz, angle);

  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  vec4 mvPos = viewMatrix * mPos;
  gl_Position = projectionMatrix * mvPos;
  gl_PointSize = 2.;

}