precision highp float;

#pragma glslify: rotate2d = require(../../glsl/utils/rotate2d.glsl);
#pragma glslify: noise3 = require(../../glsl/utils/noises/snoise3.glsl);
#pragma glslify: noise4 = require(../../glsl/utils/noises/snoise4.glsl);
#pragma glslify: map = require(../../glsl/utils/map.glsl);

uniform float u_time;
uniform float u_middle_space;
uniform float u_middle_cut;
uniform float u_noise_amount;
uniform float u_noise_freq;
uniform float u_noise2_amount;
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
	float noise_angle = theta * floor(u_noise_freq);

	float space = u_middle_space;
	phi = map(phi, 0., PI, -1., 1.);

	float phi_sign = sign(phi);

	phi = abs(phi);

	//pow distribution
	float square_phi = phi * phi;

	float density = u_density + noise4(cos(noise_angle), sin(noise_angle), phi, 100. + u_time * 0.7) * u_noise_amount;
	phi = density * square_phi * square_phi + phi * (1. - density); //density spherical

	// phi += map(noise3(phi, theta, u_time * 0.1), -1., 1., 0., 2.);

	//cut middle
	float midde_cut = u_middle_cut;
	// space = sin(u_time * 0.6 + 2. ) * 0.04;
	// phi = min(1. - (space * 0.5), phi + (space * 0.5));
	// phi = max(phi, space);
	// phi = phi * phi_sign;
	phi = min(1. - (midde_cut * 0.2), phi + (midde_cut * 0.8));
	// phi = phi + (midde_cut * 0.5);
	// phi = max(phi, midde_cut);
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

	float length_offset = map(sqrt(initialPos.w), 0., 1., -u_ring, u_ring);
	length_offset = density * length_offset * length_offset + length_offset * (1. - density);
	// length_offset += noise3(phi * 2. * PI + u_time, theta, u_time * 0.1) * 0.01;
	float length = 1. + length_offset;
	// float length = map(random_sign.x, -1., 1., 1., 0.5);

	pos.z = length * cos(theta) * sin(phi);
	pos.x = length * sin(theta) * sin(phi);
	pos.y = length * cos(phi);
	// pos.y = 0.;

	vec3 noise_pos2 = sin(pos.xyz * 2.);

	pos.z += noise3(noise_pos2.x, noise_pos2.y, u_time * 0.6 + pos.z) * u_noise2_amount * 0.7;
	pos.x += noise3(noise_pos2.y, noise_pos2.x + map(sin(u_time), -1., 1., 0., 1.), u_time * 0.3) * u_noise2_amount * 0.7;
	pos.y += noise3(noise_pos2.y, noise_pos2.z, u_time * 0.4) * u_noise2_amount * 0.7;

	// pos.yz = rotate2d(initialPos.yz, u_time);
	// pos.xz = rotate2d(pos.xz,  length * u_time * 1.);
	// pos.yz = rotate2d(pos.yz, u_time * 0.4);

	pos.xz = rotate2d(pos.xz, u_time * 1.);
	pos.xy = rotate2d(pos.xy, u_time * 0.8);

	// pos.y += u_time * 0.001;

	gl_FragColor = pos;
}