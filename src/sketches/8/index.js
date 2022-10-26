import { Program, Mesh, Plane, Triangle, Sphere, Orbit, Vec3 } from 'ogl';
import Particles from './particles';
import PostProcess from './postprocess';
import Presets from './presets';
import frag from './sketch.frag';
import vert from './sketch.vert';
import Tweaker from './tweaker';
import Audio from './audio';
// import trackUrl from './audio/with_eyes_unclouded_by_longing.mp3';
import trackUrl from './audio/Sestrica - Intention.mp3';


export default class Sketch {
	constructor(gl, { canvas, scene, render }) {

		this.gl = gl;
		this.canvas = canvas;
		this.render = render;
		this.scene = scene;
		this.postprocess = new PostProcess(this.gl, { render: this.render });
		this.particles = new Particles(this.gl, { render, sketch: this });


		// this.controls = new Orbit(this.render.camera, {
		// 	target: new Vec3(0, 0, 0),
		// 	// enabled: false
		// });

		this.gl.clearColor(0, 0, 0, 1);
		this.init();
		this.tweaker = new Tweaker(this);
		this.presets = new Presets(this, { tweaker: this.tweaker });

		//use to normalize at 60 fps
		this.last_frame = 0;
	}


	init() {

		// const geometry = new Triangle(this.gl, {});

		//todo custom geometry
		const geometry = new Plane(this.gl, {
			widthSegments: 500,
			heightSegments: 500,
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


		//particles gpugpu
		this.particles.particles_nb = geometry.attributes.position.count;
		this.particles.init();

		geometry.addAttribute('g_coords', { size: 2, data: this.particles.position.coords });


		this.program = new Program(this.gl, {
			vertex: vert,
			fragment: frag,
			uniforms: {
				u_time: { value: 0 },
				u_color1: { value: [0.3, 0, 0.3] },
				u_color2: { value: [0.65, 0.2, 0.5] },
				u_alpha: { value: 1 },
				u_resolution: { value: [this.canvas.width, this.canvas.height] },
				t_position: this.particles.position.uniform
			},
			transparent: true,
			cullFace: false
		});


		//could be an instanced mesh
		this.mesh1 = new Mesh(this.gl, {
			mode: this.gl.POINTS,
			geometry,
			program: this.program
		});
		this.mesh2 = new Mesh(this.gl, {
			mode: this.gl.POINTS,
			geometry,
			program: this.program
		});

		this.mesh1.scale = [2, 2, 2];
		this.mesh2.scale = [0.5, 0.5, 0.5];

		// this.mesh2.rotation.y = Math.PI / 2;
		// this.mesh2.rotation.x = Math.PI / 2;

		this.mesh2_rotation = 0;
		this.mesh2.program.uniforms.u_alpha.value = 0.8;

		this.scene.addChild(this.mesh1);
		this.scene.addChild(this.mesh2);

	}

	play() {
		this.audio = new Audio();
		this.audio.showPreview =false

		this.audio.start({
			// onBeat: () => console.log('onBeat'),
			live: false,
			src: trackUrl,
			analyse: true,
			// shutup: true
		});

	}


	update() {
		const last_frame_delta = this.render.clock - this.last_frame;
		
		//60fps render
		if (last_frame_delta >= 0.6) {
			this.last_frame = this.render.clock;

			this.tweaker.fpsGraph.begin();

			if(this.audio) {
				this.audio.update()

				//todo lerp
				// this.particles.position.passes[0].uniforms.u_noise_amount.value = this.audio.values[0];
				this.particles.position.passes[0].uniforms.u_noise2_amount.value = this.audio.values[5] * 0.1;

				const a = 0.1 + this.audio.values[5] * 0.5;

				this.mesh2.scale = [a,a,a];

				// console.log(this.audio.waveData)
				// console.log(this.audio.levelsData[0] > 0.8)
				// console.log(this.audio.audioRangeTexture)
			}
	
			// this.mesh2_rotation = (this.mesh2_rotation + 0.007)% (2 * Math.PI);
			this.mesh2_rotation += 0.007;
			this.mesh2.rotation.x = this.mesh2_rotation;
	
			this.program.uniforms.u_time.value = this.render.clock * 0.01;
			this.particles.update();
	
			// this.render.renderer.render({ scene: this.scene, camera: this.render.camera });
			// this.controls.update();
			this.postprocess.render();
	
			this.tweaker.fpsGraph.end();
	
			// this.audio?.update();


		}
	}
}