import { GPGPU, Texture } from 'ogl';
import positionFrag from './position.frag';
import { positiveOrNegative, random, staticTextureParams } from './utils';

export default class Particles {

	constructor(gl, { render, sketch }) {

		this.gl = gl;
		this.render = render;
		this.sketch = sketch;

		this.particles_nb = 0;
	}

	init() {

		this.position = this.createPosition();
		this.initialPos = this.createInitialPos();
		this.random_sign = this.createRandomSign();

		this.position.addPass({
			fragment: positionFrag,
			uniforms: {
				u_time: { value: this.render.clock },
				t_initialPos: { value: this.initialPos },
				t_randomSign: { value: this.random_sign },
				// t_randomSign: { value: a },
				u_middle_space: { value: 1 },
				u_middle_cut: { value: 0. },
				u_noise_amount: { value: 0 },
				u_noise_freq: { value: 2 },
				u_noise2_amount: { value: 0. },
				u_density: { value: 0.97 },
				u_ring: { value: 0.19 },
			},
		});
	}

	createPosition() {
		const length = this.particles_nb;
		const data = new Float32Array(length * 4);

		for (let i = 0; i < length; i++) {
			data.set(
				[
					// random(-1, 1)
					(Math.random() - 0.5) * 2.0 * 0.5,
					(Math.random() - 0.5) * 2.0 * 2.,
					(Math.random() - 0.5) * 2.0 * 0.5,
					i

				],
				i * 4
			);
		}
		return new GPGPU(this.gl, { data });
	}

	createRandomSign() {
		const length = this.particles_nb;
		// Find smallest PO2 that fits data
		const size = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(length))) / Math.LN2));
		const data = new Float32Array(size * size * 4);

		//sphere coordinates
		for (let i = 0; i < length; i++) {

			data.set([
				positiveOrNegative(),
				positiveOrNegative(),
				positiveOrNegative(),
				positiveOrNegative(),
			],
				i * 4
			);
		}

		return new Texture(this.gl, {
			image: data,
			width: size,
			...staticTextureParams(this.gl)
		});

	}

	createInitialPos() {
		const length = this.particles_nb;

		const size = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(length))) / Math.LN2));
		const data = new Float32Array(size * size * 4);

		//sphere coordinates
		for (let i = 0; i < length; i++) {

			let x1 = Math.random();
			let x2 = Math.random();
			// let x2 = Math.max(Math.random() * 0.1, 0.02);
			let x3 = Math.random();
			let x4 = Math.random();

			// const mag = Math.sqrt(x1 * x1 + x2 * x2 + x3 * x3);
			// x1 /= mag; x2 /= mag; x3 /= mag;

			data.set(
				[
					// 0,
					// 0,
					// 0,
					x1,
					x2,
					x3,
					x4,

				],
				i * 4
			);
		}
		// for (let i = 0; i < length / 2; i++) {
		// 	data.set(
		// 		[
		// 			(Math.random() - 0.5) * 2.0 * 0.5,
		// 			0,
		// 			(Math.random() > 0.5) ? 0.5 : -0.5 ,
		// 			0,
		// 			(Math.random() > 0.5) ? 0.5 : -0.5 ,
		// 			0,
		// 			(Math.random() - 0.5) * 2.0 * 0.5,
		// 			0,
		// 		],
		// 		i * 8
		// 	);
		// }


		return new Texture(this.gl, {
			image: data,
			width: size,
			...staticTextureParams(this.gl)
		});
	}

	update() {
		this.position.passes[0].uniforms.u_time.value = this.render.clock * 0.01;
		this.position.render();
	}
}