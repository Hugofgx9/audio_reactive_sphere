import { Program, Mesh, Sphere } from 'ogl';
import frag from './sketch.frag';
import vert from './sketch.vert';


export default class Sketch {
	constructor(gl, { canvas, scene, render }) {

		this.gl = gl;
		this.canvas = canvas;
		this.render = render;
		this.scene = scene;

		this.gl.clearColor(0, 0, 0, 1);


		this.init();
	}

	init() {

		// const geometry = new Plane(this.gl, {})

		const geometry = new Sphere(this.gl, {
			widthSegments: 200,
			heightSegments: 200
		})
		// const geometry = new Box(this.gl, {
		// 	width: 1,
		// 	height: 1,
		// 	depth: 1,
		// 	widthSegments: 60,
		// 	heightSegments: 60,
		// 	depthSegments: 60
		// });

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

		this.mesh.scale.x = 2;
		this.mesh.scale.y = 2;
		this.mesh.scale.z = 2;

		this.scene.addChild(this.mesh);

	}

	update() {

		// this.mesh.rotation.x += 0.001;
		// this.mesh.rotation.y += 0.006;
		// this.mesh.rotation.z += 0.001;

		this.mesh.program.uniforms.u_time.value = this.render.clock * 0.01;

		this.render.renderer.render({ scene: this.scene, camera: this.render.camera });
	}
}