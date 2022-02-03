#pragma glslify: snoise = require(./simplex-noise3d.glsl);


attribute vec2 uv;
attribute vec2 position;

varying vec2 v_uv;

void main() {
  
  v_uv = vec2( snoise( vec3( uv.xy, 1.0) * 4. ) );


  gl_Position = vec4(position, 0, 1);
}