import anime from 'animejs';
import { random } from './utils';


export default class Presets {
	constructor(sketch, { tweaker }) {

		this.sketch = sketch;
		this.tweaker = tweaker;

		this.tl = null;


		//tweaker presets
		this.presets = [
			{ "middle_space1": 1, "density1": 0, "ring1": 0, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 1, "density1": 0.9782600000000001, "ring1": 0.19564999999999994, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 0.11957, "density1": 1, "ring1": 0.06521999999999992, "feedback_amount": 0.5435, "bright_threeslod": 0.6, "bloom_strength": 5.4 },
			{ "middle_space1": 1, "density1": 1, "ring1": 1, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 0, "density1": 1, "ring1": 0, "feedback_amount": 0.995, "bright_threeslod": 0.01999999999999999, "bloom_strength": 1.5 },

			{ "noise1_1": 0, "noise2_1": 0 },
			{ "noise1_1": 0.3 },
			{ "noise1_1": 1 },
			{ "noise2_1": 0.1 },
			{ "noise2_1": 0.8 },

			{ "color1": { "r": 0.0008672402871619192, "g": 0, "b": 0.36671875 }, "color2": { "r": 0.5013510874155409, "g": 0, "b": 0.68671875 } }
		];

		this.live_presets = [
			{ "middle_space1": 1, "density1": 0, "ring1": 0, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 1, "density1": 0.9782600000000001, "ring1": 0.19564999999999994, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 0.11957, "density1": 1, "ring1": 0.06521999999999992, "feedback_amount": 0.5435, "bright_threeslod": 0.6, "bloom_strength": 5.4 },
			{ "middle_space1": 1, "density1": 1, "ring1": 1, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
			{ "middle_space1": 0, "density1": 1, "ring1": 0, "feedback_amount": 0.995, "bright_threeslod": 0.01999999999999999, "bloom_strength": 1.5 },
		];

		const sphere1_position_uniforms = sketch.sphere1.particles.position.passes[0].uniforms;
		const sphere2_position_uniforms = sketch.sphere2.particles.position.passes[0].uniforms;
		this.references = {
			feedback_amount: sketch.postprocess.feedbackPass.uniforms.uFeedbackAmount,
			bright_threeslod: sketch.postprocess.brightPass.uniforms.uThreshold,
			bloom_strength: sketch.postprocess.composePass.uniforms.uBloomStrength,

			middle_space1: sphere1_position_uniforms.u_middle_space,
			density1: sphere1_position_uniforms.u_density,
			ring1: sphere1_position_uniforms.u_ring,
			middle_cut1: sphere1_position_uniforms.u_middle_cut,

			noise1_1: sphere1_position_uniforms.u_noise_amount,
			noise2_1: sphere1_position_uniforms.u_noise2_amount,
			noise1_freq_1: sphere1_position_uniforms.u_noise_freq,

			middle_space2: sphere2_position_uniforms.u_middle_space,
			density2: sphere2_position_uniforms.u_density,
			ring2: sphere2_position_uniforms.u_ring,
			middle_cut2: sphere2_position_uniforms.u_middle_cut,

			noise1_2: sphere2_position_uniforms.u_noise_amount,
			noise2_2: sphere2_position_uniforms.u_noise2_amount,
			noise1_freq_2: sphere2_position_uniforms.u_noise_freq,


			//todo
			color1: sketch.sphere1.program.uniforms.u_color1,
		};


		//use for time based animations
		this.values = {
			middle_space1: sphere1_position_uniforms.u_middle_space.value,
			density1: sphere1_position_uniforms.u_density.value,
			ring1: sphere1_position_uniforms.u_ring.value,
			middle_cut1: sphere1_position_uniforms.u_middle_cut.value,

			middle_space2: sphere2_position_uniforms.u_middle_space.value,
			density2: sphere2_position_uniforms.u_density.value,
			ring2: sphere2_position_uniforms.u_ring.value,
			middle_cut2: sphere2_position_uniforms.u_middle_cut.value,

			noise1_1: sphere1_position_uniforms.u_noise_amount.value,
			noise2_1: sphere1_position_uniforms.u_noise2_amount.value,
			noise1_freq_1: sphere1_position_uniforms.u_noise_freq.value,

			noise1_2: sphere2_position_uniforms.u_noise_amount.value,
			noise2_2: sphere2_position_uniforms.u_noise2_amount.value,
			noise1_freq_2: sphere2_position_uniforms.u_noise_freq.value,

		};

		//use for animejs animation on top of timebased
		this.values_offset = {
			middle_space1: 0,
			density1: 0,
			ring1: 0,
			middle_cut1: 0,

			middle_space2: 0,
			density2: 0,
			ring2: 0,
			middle_cut2: 0,

			noise1_1: 0,
			noise2_1: 0,
			noise1_2: 0,
			noise2_2: 0,

			noise1_freq_1: 0,
			noise1_freq_2: 0,
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

			if (this.references[key]) {
				this.tl.add({
					targets: this.values[key],
					[key]: value,
					duration: random(500, 1600),
				}, random(0, 800));
			}
			else console.warn('key dont exist', key);
		});
	}

	loopRandomPreset() {

		this.playRandomPreset().finished.then(() => {
			this.loopRandomPreset();
		});

	}


	playRandomPreset() {

		const preset = this.live_presets[Math.trunc(random(0, this.live_presets.length - 1))];

		// if (this.tl) this.tl.pause();

		const tl = anime.timeline({
			easing: 'easeInOutSine',
			duration: 4000,
		});

		Object.entries(preset).forEach(([key, value]) => {

			if (this.values[key]) {

				console.log(key);
				tl.add({
					targets: this.values,
					[key]: value,
					duration: random(10000, 20000),
				}, 0);
			}
			else console.warn('key dont exist', key);
		});



		return tl;

	}

	update() {

		const time = this.sketch.render.clock;

		this.values.middle_space1 = (Math.sin(2 + time * 0.013) * 0.5 + 0.5) * 0.8 + 0.2;
		this.values.density1 = (Math.sin(1.2 + time * 0.015) * 0.5 + 0.5) * 2 + 0.2;
		this.values.ring1 = (Math.sin(time * 0.012) * 0.5 + 0.5) * 0.2;
		this.values.middle_cut1 = (Math.sin(0.4 + time * 0.010) * 0.5 + 0.5) * 0.5;

		this.values.middle_space2 = Math.sin(8 + time * 0.013) * 0.5 + 0.5;
		this.values.density2 = Math.sin(7 + time * 0.015) * 0.5 + 0.5;
		this.values.ring2 = (Math.sin(2 + time * 0.012) * 0.5 + 0.5) * 0.4;
		this.values.middle_cut2 = Math.sin(8 + time * 0.010) * 0.5 + 0.5;

		this.values.noise1_1 = Math.cos(8 + time * 0.020) * 0.5 + 0.5;
		this.values.noise2_1 = (Math.sin(8 + time * 0.024) * 0.5 + 0.5) * 0.01;
		this.values.noise1_2 = Math.cos(8 + time * 0.021) * 0.5 + 0.5;
		this.values.noise2_2 = (Math.sin(8 + time * 0.015) * 0.5 + 0.5) * 0.01;

		if ( Math.random() > 0.995) {
			this.values.noise1_freq_1 = Math.random() > 0.5 ? 0 : 10;
			this.values.noise1_freq_1 = Math.random() > 0.5 ? 0 : 10;
		}

		//compute 
		Object.keys(this.values).forEach((key) => {
			// this.references[key]
			if (typeof this.values[key] === "undefined" || typeof this.values_offset[key] === "undefined" || typeof this.references[key] === "undefined") {
				console.warn('key', key);
			}
			else this.references[key].value = this.values[key] + this.values_offset[key];

		});
	}

}



