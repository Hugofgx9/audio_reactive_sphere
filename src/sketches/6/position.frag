precision highp float;

#pragma glslify: rotate2d = require(../../glsl/utils/rotate2d.glsl);

uniform float u_time;
// Default texture uniform for GPGPU pass is 'tMap'.
// Can use the textureUniform parameter to update.

uniform sampler2D tMap;
uniform sampler2D t_initialPos;
varying vec2 vUv;
void main() {
	vec4 pos = texture2D(tMap, vUv);
	vec4 t_initialPos = texture2D(t_initialPos, vUv);

	pos.y += 0.008;
	if(pos.y > 2.) {
		pos.y -= 4.;
	}
	if(pos.y < -2.) {
		pos.y += 4.;
	}

	pos.xz = rotate2d(t_initialPos.xz, pos.y + u_time * 1.);

	// pos.y += u_time * 0.001;


	gl_FragColor = pos;
}