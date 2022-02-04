precision highp float;

#pragma glslify: cosPalette = require(./utils/cosPalette.glsl);

uniform float u_time;
uniform vec2 u_resolution;

varying vec3 vNormal;
varying float v_distord;

void main() {
  // vec3 normal = normalize(vNormal);
  // gl_FragColor.rgb = vec3(normal);

  float distortion = v_distord;

  vec3 brightness = vec3(0.9216, 0.5059, 0.1686);
  vec3 contrast = vec3(0.4667, 0.1961, 0.1961);
  vec3 oscilation = vec3(1.0, 1.0, 1.0);
  vec3 phase = vec3(0.1059, 0.3725, 0.0392);

  // Pass the distortion as input of cospalette
  vec3 color = cosPalette(distortion, brightness, contrast, oscilation, phase);
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}