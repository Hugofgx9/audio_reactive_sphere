precision highp float;
uniform sampler2D tMap;
uniform sampler2D tPreviousFrame;
uniform vec2 uResolution;
uniform float uFeedbackAmount;
varying vec2 vUv;

void main() {

	// gl_FragColor =  texture2D(tPreviousFrame, vUv) * 0.001 + vec4(1.,0.,0.,1.) * 0.02;
	// gl_FragColor = texture2D(tMap, vUv);
	// gl_FragColor =  texture2D(tPreviousFrame, vUv) * 0.99 * vec4(1., 0., 0., 1.) + texture2D(tMap, vUv)  * 0. * vec4(0., 1., 0., 1.);

	gl_FragColor = vec4(
		max(texture2D(tPreviousFrame, vUv) - vec4(1. - uFeedbackAmount), 
		vec4(0.)) + texture2D(tMap, vUv));
	// gl_FragColor = vec4(texture2D(tPreviousFrame, vUv) * uFeedbackAmount + texture2D(tMap, vUv));

	// gl_FragColor = vec4(
	// 	mix(
	// 		texture2D(tPreviousFrame, vUv),
	// 		texture2D(tMap, vUv),
	// 		uFeedbackAmount
	// 	)
	// );
}