import anime from 'animejs';
import { random } from './utils';


export default class Presets {
	constructor(sketch, { tweaker }) {

		this.sketch = sketch;
		this.tweaker = tweaker;

		this.presets = [
			{ "middle_space": 1, "density": 0, "ring": 0, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space": 1, "density": 0.9782600000000001, "ring": 0.19564999999999994, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space": 0.11957, "density": 1, "ring": 0.06521999999999992, "feedback_amount": 0.5435, "bright_threeslod": 0.6, "bloom_strength": 5.4 },
			{ "middle_space": 1, "density": 1, "ring": 1, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space": 0, "density": 1, "ring": 0, "feedback_amount": 0.995, "bright_threeslod": 0.01999999999999999, "bloom_strength": 1.5 },
		];

		this.references = {
			middle_space: sketch.particles.position.passes[0].uniforms.u_middle_space,
			density: sketch.particles.position.passes[0].uniforms.u_density,
			ring: sketch.particles.position.passes[0].uniforms.u_ring,
			feedback_amount: sketch.postprocess.feedbackPass.uniforms.uFeedbackAmount,
			bright_threeslod: sketch.postprocess.brightPass.uniforms.uThreshold,
			bloom_strength: sketch.postprocess.composePass.uniforms.uBloomStrength,
		};
	}

	applyPreset(index) {
		const preset = this.presets[index];

		const tl = anime.timeline({
			easing: 'easeInOutSine',
			duration: 800,
			update: () => this.tweaker._.refresh()
		});

		Object.entries(preset).forEach(([key, value]) => {
			tl.add({
				targets: this.references[key],
				value: value,
				duration: random(300, 1600),
			}, random(0, 800));
		});
	}
}



