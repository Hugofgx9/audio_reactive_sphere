precision highp float;

// #pragma glslify: cosPalette = require(./utils/cosPalette.glsl);
// #pragma glslify: snoise3 = require(../../glsl/utils/noises/snoise3.glsl);
// #pragma glslify: snoise2 = require(../../glsl/utils/noises/snoise2.glsl);
// #pragma glslify: snoise4 = require(../../snoise4.glsl);
// #pragma glslify: circle = require(../../glsl/utils/sdf/circle.glsl);
#pragma glslify: hsl2rgb = require(../../glsl/utils/colors/hsl2rgb.glsl);
// #pragma glslify: map = require(@hugofgx9/glsl-toys/map.glsl);

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;
uniform vec3 u_color1; //hsl
uniform vec3 u_color2; //hsl

void main() {

	vec3 color = vec3(v_uv, 1.);

	vec3 color1 = u_color1;
	vec3 color2 = u_color2;

	color = mix(hsl2rgb(color1), hsl2rgb(color2), pow(mod(v_uv.y + u_time, 1.), 2.));

	gl_FragColor = vec4(color, 1.);

}

