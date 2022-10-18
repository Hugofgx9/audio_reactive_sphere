precision highp float;

// #pragma glslify: cosPalette = require(./utils/cosPalette.glsl);
#pragma glslify: snoise3 = require(./utils/simplex_noise_3d.glsl);
// #pragma glslify: snoise4 = require(./utils/snoise4.glsl);
#pragma glslify: snoise2 = require(./utils/snoise2.glsl);
// #pragma glslify: map = require(./utils/map.glsl);

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;

const float size = 0.05;

//center, weight, x value
float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

void main() {


	float n1 = snoise2(vec2(1., u_time * 0.4)) * 0.5 + 0.5;
	float n2 = snoise2(vec2(100., u_time * 0.4)) * 0.5 + 0.5;

	vec3 color1 = vec3(1.0, 1.0, 1.0);
	vec3 color2 = vec3(0.);

	vec3 color = color2;
	// color = step(mod(v_uv.y + u_time * 0.01, 1.), 0.05) * color1;
	// color = color1 * step(mod(v_uv.y + u_time * 1., 1.), 0.05);
	color = color1 * step(mod(v_uv.y + u_time * 1., 1.), 0.05);
	// color = cubicPulse(0.5, 0.0, mod(v_uv.y + u_time, 1.)) * color1;

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