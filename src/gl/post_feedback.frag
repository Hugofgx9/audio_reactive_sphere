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

	vec2 offset_uv = vUv;


	// offset_uv.x += 0.01;

	vec4 current_scene = texture2D(tMap, vUv);
	vec4 previous_frame = texture2D(tPreviousFrame, offset_uv);
	previous_frame -= vec4(1. - uFeedbackAmount);

	// for(float i = 0.; i < 10.; i += 1.) {

	// 	current_scene += texture2D(tMap, ((vUv - 0.5) * 0.9) + 0.5 );
	// 	// current_scene += texture2D(tMap, ((vUv - 0.5) * (i * 1.)) + 0.5 );
	// }

	// current_scene += texture2D(tMap, ((vUv - 0.5) * 1.05) + 0.5 );
	// current_scene += texture2D(tMap, ((vUv - 0.5) * 1.1) + 0.:5 );
	// current_scene += texture2D(tMap, ((vUv - 0.5) * 1.15) + 0.5 );
	// current_scene += texture2D(tMap, ((vUv - 0.5) * 1.2) + 0.5 );


	gl_FragColor = vec4(max(previous_frame, vec4(0.)) + current_scene);
	// gl_FragColor = vec4(texture2D(tPreviousFrame, vUv) * uFeedbackAmount + texture2D(tMap, vUv));

	// gl_FragColor = vec4(
	// 	mix(
	// 		texture2D(tPreviousFrame, vUv),
	// 		texture2D(tMap, vUv),
	// 		uFeedbackAmount
	// 	)
	// );
}