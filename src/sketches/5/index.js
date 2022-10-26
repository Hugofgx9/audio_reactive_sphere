import { Program, Mesh, Triangle, Sphere, Orbit, Vec3 } from 'ogl';
import PostProcess from './postprocess';
import frag from './sketch.frag';
import vert from './sketch.vert';
import Tweaker from './tweaker';


export default class Sketch {
	constructor(gl, { canvas, scene, render }) {

		this.gl = gl;
		this.canvas = canvas;
		this.render = render;
		this.scene = scene;
		this.postprocess = new PostProcess(this.gl, { render: this.render });


		this.controls = new Orbit(this.render.camera, {
			target: new Vec3(0, 0, 0),
			// enabled: false
		});

		this.gl.clearColor(0, 0, 0, 1);
		this.init();
		// new Tweaker(this)
	}


	init() {

		// const geometry = new Triangle(this.gl, {});

		const geometry = new Sphere(this.gl, {
			widthSegments: 22,
		});

		const nb = geometry.attributes.position.count;
		const new_pos = new Float32Array(nb * 3);
		const new_normal = new Float32Array(nb * 3);

		const normal_tmp = new Vec3();

		for (let index = 0; index < nb * 3; index += 3) {

			let x = -1 + Math.random() * 2;
			let y = -1 + Math.random() * 2;
			let z = -1 + Math.random() * 2;
			const d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
			x *= d;
			y *= d;
			z *= d;


			normal_tmp.set(x, y, z).normalize();

			new_pos.set([x, y, z], index);
			new_normal.set(normal_tmp.toArray(), index);
		}

		geometry.attributes.position.data = new_pos;
		geometry.attributes.position.needsUpdate = true;

		geometry.attributes.normal.data = new_normal;
		geometry.attributes.normal.needsUpdate = true;


		this.program = new Program(this.gl, {
			vertex: vert,
			fragment: frag,
			uniforms: {
				u_time: { value: 0 },
				u_resolution: { value: [this.canvas.width, this.canvas.height] },

			},
			transparent: true,
			cullFace: false
		});

		this.mesh = new Mesh(this.gl, {
			mode: this.gl.POINTS,
			geometry,
			program: this.program
		});
		this.scene.addChild(this.mesh);

	}

	update() {

		// this.mesh.rotation.x += 0.001;
		// this.mesh.rotation.y += 0.006;
		// this.mesh.rotation.z += 0.001;

		this.mesh.program.uniforms.u_time.value = this.render.clock * 0.01;

		// this.render.renderer.render({ scene: this.scene, camera: this.render.camera });
		this.controls.update();
		this.postprocess.render();
	}
}