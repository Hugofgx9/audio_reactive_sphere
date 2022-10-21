precision highp float;

// #pragma glslify: cosPalette = require(./utils/cosPalette.glsl);
#pragma glslify: snoise3 = require(../../glsl/utils/noises/snoise3.glsl);
#pragma glslify: snoise2 = require(../../glsl/utils/noises/snoise2.glsl);
// #pragma glslify: snoise4 = require(../../snoise4.glsl);
#pragma glslify: circle = require(../../glsl/utils/sdf/circle.glsl);
#pragma glslify: hsl2rgb = require(../../glsl/utils/colors/hsl2rgb.glsl);
// #pragma glslify: map = require(@hugofgx9/glsl-toys/map.glsl);

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;

const float size = 0.05;

//center, weight, x value
float cubicPulse(float c, float w, float x) {
	x = abs(x - c);
	if(x > w)
		return 0.0;
	x /= w;
	return 1.0 - x * x * (3.0 - 2.0 * x);

}

void main(){


	// vec3 color = vec3(1.);
	vec3 color1 = hsl2rgb(mod(u_time * 0.3, 1.), 1., 0.5);
	vec3 color2 = hsl2rgb(mod(0.8 + u_time * 0.23, 1.), 1., 0.5);
	vec3 color3 = hsl2rgb(mod(-0.3 + u_time * 0.1, 1.), 1., 0.5);


	float n = snoise2(v_uv.x * 0.8 + u_time * 0.6, 1.) * 0.5 + 0.5;
	float n2 = snoise2(v_uv.x * 0.7 + u_time * 2.5, 200.) * 0.5 + 0.5;
	float n3 = snoise2(v_uv.x * 0.7 + u_time * 2.5, 90.) * 0.5 + 0.5;
	// n = smoothstep(n, n +0.01,v_uv.y);

	float width = 0.001;
	float smoothness = 0.001;
	float halfwidth = width * .5;
	n = smoothstep(n - (halfwidth + smoothness), n - halfwidth,v_uv.y) * (1. - smoothstep(n + halfwidth, n + (halfwidth + smoothness), v_uv.y));
	n2 = smoothstep(n2 - (halfwidth + smoothness), n2 - halfwidth,v_uv.y) * (1. - smoothstep(n2 + halfwidth, n2 + (halfwidth + smoothness), v_uv.y));
	n3 = smoothstep(n3 - (halfwidth + smoothness), n3 - halfwidth,v_uv.y) * (1. - smoothstep(n3 + halfwidth, n3 + (halfwidth + smoothness), v_uv.y));


	vec3 color = min(n * color1 + n2 * color2 + n3 * color3, 1.) ;



	gl_FragColor = vec4(color, 1.);

}