precision highp float;
uniform sampler2D tMap;
uniform float uThreshold;
varying vec2 vUv;
void main() {
	vec4 tex = texture2D(tMap, vUv);
	vec4 bright = tex * step(uThreshold, length(tex.rgb) / 1.73205);
	gl_FragColor = bright;
}