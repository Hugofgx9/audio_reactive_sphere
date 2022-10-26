import { Program, Mesh, Plane, Triangle, Orbit, Vec3 } from 'ogl';
import Particles from './particles';
import PostProcess from './postprocess';
import Presets from './presets';
import frag from './sketch.frag';
import vert from './sketch.vert';
import Tweaker from './tweaker';
import Sphere from './sphere';
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

		this.sphere1 = new Sphere(this.gl, {sketch: this, nb: 1300000});
		this.sphere2 = new Sphere(this.gl, {sketch: this, nb: 400000});

		this.sphere1.mesh.scale = [2, 2, 2];
		this.sphere2.mesh.scale = [0.5, 0.5, 0.5];

		this.sphere2.rotation_x = 0;
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
				this.sphere2.particles.position.passes[0].uniforms.u_noise_amount.value = this.audio.values[0];

				const s = 0.1 + this.audio.values[5] * 0.5;

				this.sphere2.mesh.scale = [s,s,s];

				// console.log(this.audio.waveData)
				// console.log(this.audio.levelsData[0] > 0.8)
				// console.log(this.audio.audioRangeTexture)
			}
	
			this.sphere1.particles.update();
			this.sphere2.particles.update();

			this.sphere2.rotation_x += 0.007;
			this.sphere2.mesh.rotation.x = this.sphere2.rotation_x;
	
			this.sphere1.program.uniforms.u_time.value = this.render.clock * 0.01;
			this.sphere2.program.uniforms.u_time.value = this.render.clock * 0.01;
	
			// this.render.renderer.render({ scene: this.scene, camera: this.render.camera });
			this.postprocess.render();
	
			this.tweaker.fpsGraph.end();

		}
	}
}