precision highp float;

#pragma glslify: cosPalette = require(../../glsl/utils/cosPalette.glsl);

uniform float u_time;
uniform vec2 u_resolution;

varying vec3 vNormal;
varying float v_distord;

void main() {
  // vec3 normal = normalize(vNormal);
  // gl_FragColor.rgb = vec3(normal);

  float distortion = v_distord * 12.;

  vec3 brightness = vec3(0.0549, 0.1098, 0.6);
  vec3 contrast = vec3(0.1216, 0.1137, 0.1137);
  vec3 oscilation = vec3(1.0, 1.0, 1.0);
  vec3 phase = vec3(0.3725, 0.2275, 0.0392);

  // Pass the distortion as input of cospalette
  vec3 color = cosPalette(distortion, brightness, contrast, oscilation, phase);
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}