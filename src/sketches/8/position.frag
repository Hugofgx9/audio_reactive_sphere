precision highp float;

#pragma glslify: rotate2d = require(../../glsl/utils/rotate2d.glsl);
#pragma glslify: map = require(../../glsl/utils/map.glsl);

uniform float u_time;
uniform float u_middle_space;
uniform float u_density;
uniform float u_ring;
// Default texture uniform for GPGPU pass is 'tMap'.
// Can use the textureUniform parameter to update.

uniform sampler2D tMap;
uniform sampler2D t_initialPos;
uniform sampler2D t_randomSign;
varying vec2 vUv;

const float PI = 3.1415926535;


void main() {
	vec4 pos = texture2D(tMap, vUv);
	vec4 initialPos = texture2D(t_initialPos, vUv);
	vec4 random_sign = texture2D(t_randomSign, vUv);

	pos = initialPos;

	//uniform distribution in sphere coordinates;
	float phi = acos(2. * pos.x - 1.);
	float theta = 2. * PI * pos.y;

	float space = u_middle_space;
	phi = map(phi, 0., PI, -1., 1.);

	float phi_sign = sign(phi);

	phi = abs(phi);

	//pow distribution
	float square_phi = phi * phi;
	phi = u_density * square_phi * square_phi + phi * (1. - u_density); //density spherical

	//cut middle
	// space = sin(u_time * 0.6 + 2. ) * 0.04;
	// phi = min(1. - (space * 0.5), phi + (space * 0.5));
	// phi = max(phi, space);
	// phi = phi * phi_sign;

	//invert cut
	// phi = min(phi, phi);
	// phi = min(phi, phi);
	// phi = min(phi, space);
	phi *= space * 0.8;
	phi = phi * phi_sign;

	//evolution scale
	// phi *= sin(u_time * 0.6);

	phi = map(phi, -1., 1., 0., PI);


	float length = map(sqrt(initialPos.w), 0., 1., -u_ring, u_ring);
	length = u_density * length * length + length * (1. - u_density);
	length += 1.;
	// float length = map(random_sign.x, -1., 1., 1., 0.5);

	pos.z = length * cos(theta) * sin(phi);
	pos.x = length * sin(theta) * sin(phi);
	pos.y = length * cos(phi);
	

	// pos.yz = rotate2d(initialPos.yz, u_time);
	pos.xz = rotate2d(pos.xz, u_time * 1.);
	// pos.yz = rotate2d(pos.yz, u_time * 0.4);
	// pos.xy = rotate2d(pos.xy, u_time * 1.3);

	// pos.y += u_time * 0.001;

	gl_FragColor = pos;
}