#pragma glslify: noise4 = require(../../glsl/utils/noise_4d.glsl);
#pragma glslify: snoise3 = require(../../glsl/utils/noises/snoise3.glsl);
#pragma glslify: rotate2d = require(../../glsl/utils/rotate2d.glsl);

attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vNormal;

uniform float u_time;
varying float v_distord;

float quarticInOut(float t) {
  return t < 0.5 ? +8.0 * pow(t, 4.0) : -8.0 * pow(t - 1.0, 4.0) + 1.0;
}

void main() {

  vNormal = normalize(normalMatrix * normal);

  // vec3 pos = position;
  // vec3 pos = position + (normal * distortion);
  // float spin = pow(pos.y + 1.0, 1.0) * 4.;
  // // float radius = sin(0.5 - pow(pos.y, 0.8));
  // float radius = 1.;
  // // float l = exp(pos.y);
  // pos.xz = rotate2d(pos.xz, spin) * radius;

  float distortion = noise4(vec4(normal * 1., u_time * 0.01)) * 0.15;
  vec3 pos = position + (normal * distortion);

  float angle = (position.y * 1. + u_time * 0.6) * 10.;
  pos.xz = rotate2d(pos.xz, angle);   

  v_distord = distortion;

  // pos.z += cos(l);
  // pos.x += sin(l);
  // pos.x += noise4(vec4(u_time * 1., pos)) * 0.2;
  // pos.x *= 100.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}