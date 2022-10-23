import { GPGPU, Texture } from 'ogl';
import positionFrag from './position.frag';


export default class Particles {

	constructor(gl, { render, sketch }) {

		this.gl = gl;
		this.render = render;
		this.sketch = sketch;

		this.particles_nb = 0;
	}

	init() {

		this.position_GPGPU = this.createPositionGPGPU();
		this.initialPos = this.createInitialPos();

		this.initialPos.render();

		this.position_GPGPU.addPass({
			fragment: positionFrag,
			uniforms: {
				u_time: { value: this.render.clock },
				t_initialPos: this.initialPos.uniform
			},
		});
	}

	createPositionGPGPU() {
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

		for (let i = 0; i < length; i++) {
			data.set(
				[
					(Math.random() - 0.5) * 2.0 * 0.5,
					0,
					(Math.random() > 0.5) ? 0.5 : -0.5 ,
					0
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
		this.position_GPGPU.passes[0].uniforms.u_time.value = this.render.clock;
		this.position_GPGPU.render();
	}
}