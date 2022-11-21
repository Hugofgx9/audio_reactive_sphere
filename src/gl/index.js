import { Program, Mesh, Plane, Triangle, Orbit, Vec3 } from 'ogl';
import Particles from './particles';
import PostProcess from './postprocess';
import Presets from './presets';
import frag from './sketch.frag';
import vert from './sketch.vert';
import Tweaker from './tweaker';
import Sphere from './sphere';
import Audio from './audio';
import { findTop3, random } from './utils';
// import trackUrl from './audio/with_eyes_unclouded_by_longing.mp3';
// import trackUrl from './audio/sestrica_short.mp3';
import anime from 'animejs';
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
		// this.tweaker = new Tweaker(this);
		this.presets = new Presets(this, { tweaker: this.tweaker });

		//use to normalize at 60 fps
		this.last_frame = 0;

		this.tweaker_level = 0;

		// this.tweaker._.addMonitor(this, 'tweaker_level', {
		// 	view: 'graph',
		// 	min: 0,
		// 	max: 200,
		// 	interval: 40,
		// });

		// document.addEventListener('keydown', (ev) => {
		// 	if (ev.key == "Enter") this.play();
		// });
	}


	init() {

		this.sphere1 = new Sphere(this.gl, { sketch: this, nb: 1300000 });
		this.sphere2 = new Sphere(this.gl, { sketch: this, nb: 400000 });

		this.sphere1.mesh.scale = [2, 2, 2];
		this.sphere2.mesh.scale = [0.5, 0.5, 0.5];

		this.sphere2.rotation_x = 0;
	}

	play() {
		this.audio = new Audio();
		this.audio.showPreview = false;
		this.audio.levelsCount = 512;

		this.audio_params = {
			kick: {
				decay: 200,
				last: 0
			},
			snare: {
				decay: 400,
				last: 0
			},
			hh: {
				decay: 40,
				last: 0
			}
		};

		//low/mid/hi
		this.audio_levels = [{ value: 0, lerp: 0.4 }, { value: 0, lerp: 0.1 }, { value: 0, lerp: 0.1 }];

		this.audio.start({
			// onBeat: () => console.log('onBeat'),
			live: false,
			src: trackUrl,
			analyse: true,
			// shutup: true
			onLoad: () => {

				anime({
					targets: this.postprocess.feedbackPass.uniforms.uFeedbackAmount,
					value: 0.64,
					easing: 'easeOutSine',
					duration: 20000,
				})


				anime({
					targets: this.sphere1.program.uniforms.u_alpha,
					value: 0.4,
					easing: 'easeOutSine',
					duration: 10000,
					delay: 5000,
				})

				anime({
					targets: this.sphere2.program.uniforms.u_alpha,
					value: 0.4,
					easing: 'easeOutSine',
					duration: 10000,
					delay: 1000,
				})

				// this.presets.loopRandomPreset();
			}
		});



	}

	onSnare() {
		this.sphere2.rotation_x += random(-Math.PI, Math.PI);
		this.sphere2.mesh.rotation.z += random(-Math.PI, Math.PI);

		const tl = anime.timeline({
		});

		tl.add({
			targets: this.presets.values_offset,
			middle_cut1: [0.2, 0],
			easing: 'easeInOutSine',
			duration: 300,
		});

		tl.add({
			targets: this.presets.values_offset,
			ring1: [0, 0.6],
			easing: 'easeOutSine',
			duration: 500,
		}, 200);
	}

	onKick() {

		anime({
			targets: this.presets.values_offset,
			density1: [0, -0.2],
			easing: 'easeInOutSine',
			duration: 300,
		});
	}

	onHH() {

		anime({
			targets: this.postprocess.composePass.uniforms.uBloomStrength,
			value: [3, 2],
			easing: 'easeOutSine',
			duration: 20
		})

	}


	update() {
		const last_frame_delta = this.render.clock - this.last_frame;

		//60fps render
		if (last_frame_delta >= 0.6) {
			this.last_frame = this.render.clock;

			this.tweaker?.fpsGraph.begin();

			if (this.audio) {
				this.audio.update();

				//todo lerp low, mid and hi


				const time = performance.now();

				// console.log(time)

				if (this.audio.levelsData[0] > 0.996) {
					if (time - this.audio_params.kick.last > this.audio_params.kick.decay) {
						this.audio_params.kick.last = time;
						this.onKick();
					}
				}

				if (this.audio.levelsData[200] > 0.65) {
					if (time - this.audio_params.snare.last > this.audio_params.snare.decay) {
						this.audio_params.snare.last = time;

						this.onSnare();
					}
				}

				if (this.audio.levelsData[280] > 0.2) {
					if (time - this.audio_params.hh.last > this.audio_params.hh.decay) {
						this.audio_params.hh.last = time;
						this.onHH();
					}
				}


				// const a = findTop3(this.audio.levelsData.slice(400, 500));

				// this.tweaker_level = a.index[0];
			}

			this.sphere1.particles.update();
			this.sphere2.particles.update();

			this.sphere2.rotation_x += 0.007;
			this.sphere2.mesh.rotation.x = this.sphere2.rotation_x;

			this.sphere1.program.uniforms.u_time.value = this.render.clock * 0.01;
			this.sphere2.program.uniforms.u_time.value = this.render.clock * 0.01;

			this.presets.update();

			// this.render.renderer.render({ scene: this.scene, camera: this.render.camera });
			this.postprocess.render();

			this.tweaker?.fpsGraph.end();

		}
	}
}