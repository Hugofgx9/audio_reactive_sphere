import { GPGPU, Texture } from 'ogl';
import positionFrag from './position.frag';
import { positiveOrNegative } from './utils';

export default class Particles {

	constructor(gl, { render, sketch }) {

		this.gl = gl;
		this.render = render;
		this.sketch = sketch;

		this.particles_nb = 0;
	}

	init() {

		this.initialPos = this.createInitialPos();
		this.position = this.createPosition();
		this.random_sign = this.createRandomSign();

		this.initialPos.render();

		this.position.addPass({
			fragment: positionFrag,
			uniforms: {
				u_time: { value: this.render.clock },
				t_initialPos: this.initialPos.uniform,
				t_randomSign: this.random_sign.uniform,
				u_middle_space: { value: 0.18 },
				u_density: {value: 0.},
				u_ring: {value: 1.},
			},
		});
	}

	createRandomSign() {
		const length = this.particles_nb;
		const data = new Float32Array(length * 4);

		//sphere coordinates
		for (let i = 0; i < length; i++) {

			data.set(
				[
					Math.random() > 0.5 ? 1 : -1,
					Math.random() > 0.5 ? 1 : -1,
					Math.random() > 0.5 ? 1 : -1,
					Math.random() > 0.5 ? 1 : -1,
				],
				i * 4
			);
		}
		return new GPGPU(this.gl, { data });
	}

	createPosition() {
		const length = this.particles_nb;
		const data = new Float32Array(length * 4);

		for (let i = 0; i < length; i++) {
			data.set(
				[
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


	createInitialPos() {
		const length = this.particles_nb;
		const data = new Float32Array(length * 4);

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


		return new GPGPU(this.gl, { data });
	}

	update() {
		this.position.passes[0].uniforms.u_time.value = this.render.clock;
		this.position.render();
	}
}