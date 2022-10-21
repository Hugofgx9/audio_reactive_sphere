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

void main() {

	// float n1 = snoise2(vec2(1., u_time * 0.4)) * 0.5 + 0.5;
	// float n2 = snoise2(vec2(100., u_time * 0.4)) * 0.5 + 0.5;

	// vec3 color1 = vec3(1.0, 1.0, 1.0);
	// vec3 color2 = vec3(0.);

	// vec3 color = color2;
	// // color = step(mod(v_uv.y + u_time * 0.01, 1.), 0.05) * color1;
	// // color = color1 * step(mod(v_uv.y + u_time * 1., 1.), 0.05);
	// color = color1 * step(mod(v_uv.y + u_time * 1., 1.), 0.05);
	// // color = cubicPulse(0.5, 0.0, mod(v_uv.y + u_time, 1.)) * color1;

	// vec2 pos = vec2(
		// mod(sin(u_time), 1.),
		// mod(sin(u_time), 1.),
	// );

	vec3 color = hsl2rgb(mod(u_time * .3, 1.), 1., 0.5);

	float n = snoise2(1., u_time) * 0.5 + 0.5;

	vec2 circle_center = vec2(
		mod(u_time, 1.),
		n
	);
	// vec2 circle_center = vec2(
	// 	mod(0.2 + sin(u_time * 2.) * 0.5, 1.),
	// 	mod(u_time, 1.)
	// 	);

	

	color *= vec3(circle(circle_center, v_uv, 0.005));

	float alpha = 1.;

	// color *= smoothstep(n1 - size, n1, v_uv.x);
	// color *= smoothstep(n1 + size, n1, v_uv.x);
	// color *= smoothstep(n2 - size, n2, v_uv.y);
	// color *= smoothstep(n2 + size, n2, v_uv.y);

	// alpha *= smoothstep(n1 - size, n1, v_uv.x);
	// alpha *= smoothstep(n1 + size, n1, v_uv.x);
	// alpha *= smoothstep(n2 - size, n2, v_uv.y);
	// alpha *= smoothstep(n2 + size, n2, v_uv.y);

	// color *= 1.5;

	// color *= step(n1 - size, v_uv.x) * step( v_uv.x, n1 + size);
	// color *= step(n2 - size, v_uv.y) * step( v_uv.y, n2 + size);
	// color *= smoothstep(v_uv.y + n2, v_uv.y + n2 + 0.1, 1.);
	gl_FragColor = vec4(color, alpha);
}

void main2(){


	vec3 color = vec3(1.);
	color = hsl2rgb(mod(u_time * 0.3, 1.), 1., 0.5);


	float n = snoise2(v_uv.x * 0.5 + u_time * 2., 1.) * 0.5 + 0.5;
	// n = smoothstep(n, n +0.01,v_uv.y);

	float width = 0.008;
	float smoothness = 0.005;
	float halfwidth = width * .5;
	n = smoothstep(n - (halfwidth + smoothness), n - halfwidth,v_uv.y) * (1. - smoothstep(n + halfwidth, n + (halfwidth + smoothness), v_uv.y));


	color *= n;



	gl_FragColor = vec4(color, 1.);

}