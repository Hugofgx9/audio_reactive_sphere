import { Program, Mesh, Triangle } from 'ogl';
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

		this.gl.clearColor(0, 0, 0, 1);
		this.init();
		new Tweaker(this)
	}


	init() {

		const geometry = new Triangle(this.gl, {});

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

		this.mesh = new Mesh(this.gl, { geometry, program: this.program });
		this.scene.addChild(this.mesh);
	}

	update() {

		// this.mesh.rotation.x += 0.001;
		// this.mesh.rotation.y += 0.006;
		// this.mesh.rotation.z += 0.001;

		this.mesh.program.uniforms.u_time.value = this.render.clock;
		this.postprocess.render();
	}
}