import Particles from './particles';
import {random} from './utils';
import frag from './sketch.frag';
import vert from './sketch.vert';
import {Vec3, Geometry, Program, Mesh} from 'ogl';

export default class Sphere {
	constructor(gl, {sketch, nb}){

		this.gl = gl;
		this.sketch = sketch;
		this.nb = nb;
		this.scene = this.sketch.scene;
		
		this.particles = new Particles(this.gl, { render: this.sketch.render, sketch: this.sketch });

		this.mesh = this.createMesh();
	}

	createMesh(){

		const nb = this.nb;

		const pos_data = new Float32Array(nb * 3);
		const normal_data = new Float32Array(nb * 3);

		const normal_tmp = new Vec3();

		for (let index = 0; index < nb * 3; index += 3) {

			let x = random(-1, 1);
			let y = random(-1, 1);
			let z = random(-1, 1);
			const d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			x *= d;
			y *= d;
			z *= d;

			normal_tmp.set(x, y, z).normalize();

			pos_data.set([x, y, z], index);
			normal_data.set(normal_tmp.toArray(), index);
		}

		const position = { data: pos_data, size: 3, count: nb};
		const normal = { data: normal_data, size: 3, count: nb };

		const geometry = new Geometry(this.gl, { position, normal });

		//particles gpugpu
		this.particles.particles_nb = nb;
		this.particles.init();

		geometry.addAttribute('g_coords', { size: 2, data: this.particles.position.coords });

		this.program = new Program(this.gl, {
			vertex: vert,
			fragment: frag,
			uniforms: {
				u_time: { value: 0 },
				u_color1: { value: [0.3, 0, 0.3] },
				u_color2: { value: [0.65, 0.2, 0.5] },
				u_alpha: { value: 0.4 },
				u_resolution: { value: [this.sketch.canvas.width, this.sketch.canvas.height] },
				t_position: this.particles.position.uniform
			},
			transparent: true,
			cullFace: false
		});


		//could be an instanced mesh
		this.mesh = new Mesh(this.gl, {
			mode: this.gl.POINTS,
			geometry,
			program: this.program
		});

		this.scene.addChild(this.mesh);


		return this.mesh;
	}

}