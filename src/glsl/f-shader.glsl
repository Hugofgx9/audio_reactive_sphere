precision highp float;

#pragma glslify: snoise = require(./simplex-noise3d.glsl);

uniform float u_time;
uniform vec2 u_resolution;


varying vec2 v_uv;


void main() {

  vec3 color = vec3(0.8, 0.2, 0.2);

  vec2 st = gl_FragCoord.xy / u_resolution;
  float noise = snoise( vec3( st.xy, u_time * 0.001) * 1.2 ) * 0.1;

  // a. The DISTANCE from the pixel to the center
  float pct = distance( st , vec2(0.5));
  pct = pct + noise;

  //color = vec3( noise);


  if(pct < 0.4) {
  //if(0. < 0.5) {
    gl_FragColor = vec4( color, 1.0);
  } else { discard; }

}