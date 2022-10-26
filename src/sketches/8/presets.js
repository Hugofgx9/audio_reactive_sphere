import anime from 'animejs';
import { random } from './utils';


export default class Presets {
	constructor(sketch, { tweaker }) {

		this.sketch = sketch;
		this.tweaker = tweaker;

		this.tl = null;

		this.presets = [
			{ "middle_space1": 1, "density1": 0, "ring1": 0, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 1, "density1": 0.9782600000000001, "ring1": 0.19564999999999994, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 0.11957, "density1": 1, "ring1": 0.06521999999999992, "feedback_amount": 0.5435, "bright_threeslod": 0.6, "bloom_strength": 5.4 },
			{ "middle_space1": 1, "density1": 1, "ring1": 1, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 0, "density1": 1, "ring1": 0, "feedback_amount": 0.995, "bright_threeslod": 0.01999999999999999, "bloom_strength": 1.5 },

			{ "noise1_1": 0, "noise2_1": 0 },
			{ "noise1_1": 0.3},
			{ "noise1_1": 1},
			{ "noise2_1": 0.1},
			{ "noise2_1": 0.8},

			{"color1":{"r":0.0008672402871619192,"g":0,"b":0.36671875},"color2":{"r":0.5013510874155409,"g":0,"b":0.68671875}}
		];

		const sphere1_position_uniforms = sketch.sphere1.particles.position.passes[0].uniforms;
		this.references = {
			middle_space1: sphere1_position_uniforms.u_middle_space,
			density1: sphere1_position_uniforms.u_density,
			ring1: sphere1_position_uniforms.u_ring,
			feedback_amount: sketch.postprocess.feedbackPass.uniforms.uFeedbackAmount,
			bright_threeslod: sketch.postprocess.brightPass.uniforms.uThreshold,
			bloom_strength: sketch.postprocess.composePass.uniforms.uBloomStrength,

			noise1_1: sphere1_position_uniforms.u_noise_amount,
			noise2_1: sphere1_position_uniforms.u_noise2_amount,

			//todo
			color1: sketch.sphere1.program.uniforms.u_color1,
		};
	}

	applyPreset(index) {
		const preset = this.presets[index];

		if (this.tl) this.tl.pause();

		this.tl = anime.timeline({
			easing: 'easeInOutSine',
			duration: 800,
			update: () => this.tweaker._.refresh()
		});

		Object.entries(preset).forEach(([key, value]) => {
			this.tl.add({
				targets: this.references[key],
				value: value,
				duration: random(500, 1600),
			}, random(0, 800));
		});
	}
}



