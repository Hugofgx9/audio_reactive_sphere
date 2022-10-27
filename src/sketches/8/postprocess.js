import { Post, Vec2 } from 'ogl';
import feedbackF from './post_feedback.frag';
import blurF from './post_blur.frag';
import brightF from './post_bright.frag';
import compositeF from './post_composite.frag';


export default class PostProcess {

	constructor(gl, { render }) {
		this.gl = gl;
		// this.render = render;
		this.scene = render.scene;
		this.camera = render.camera;
		this.canvas = render.canvas;

		this.init();
	}

	init() {

		this.postEmpty = new Post(this.gl);
		this.postEmpty.addPass();

		this.postFeedback = new Post(this.gl);
		this.feedbackPass = this.postFeedback.addPass({
			fragment: feedbackF,
			uniforms: {
				uResolution: { value: [this.canvas.width, this.canvas.height] },
				tPreviousFrame: { value: this.postFeedback.uniform },
				uFeedbackAmount: { value: 0. },
			},
		});


		this.postCompose = new Post(this.gl)
		this.postCompose.addPass();

		this.postBloom = new Post(this.gl, { targetOnly: true });

		this.brightPass = this.postBloom.addPass({
			fragment: brightF,
			uniforms: {
				uThreshold: { value: 0.66 },
			},
		});

		this.vertPass = this.postBloom.addPass({
			fragment: blurF,
			uniforms: {
				uDirection: { value: new Vec2(1, 0) },
				uResolution: { value: [this.canvas.width, this.canvas.height] },
			},
		});
		this.horiPass = this.postBloom.addPass({
			fragment: blurF,
			uniforms: {
				uDirection: { value: new Vec2(0, 1) },
				uResolution: { value: [this.canvas.width, this.canvas.height] },
			},
		});


		// Re-add the gaussian blur passes several times to the array to get smoother results
		for (let i = 0; i < 4; i++) {
			this.postBloom.passes.push(this.horiPass, this.vertPass);
		}


		this.composePass = this.postCompose.addPass({
			fragment: compositeF,
			uniforms: {
				uResolution: { value: [this.canvas.width, this.canvas.height] },
				tBloom: this.postBloom.uniform,
				uBloomStrength: { value: 2.4 },
			},
		});
	}


	onResize() {
		this.postFeedback.resize();
		this.postEmpty.resize();
		this.postCompose.resize();
		this.postBloom.resize();
	}

	render() {
		// Feedback >> Bloom

		// render current scene
		this.postEmpty.targetOnly = true;
		this.postEmpty.render({ scene: this.scene, camera: this.camera });

		//merge current scene and old + render it on target
		this.postFeedback.targetOnly = true;
		this.postFeedback.render({ texture: this.postEmpty.uniform.value });

		// finally render on canvas
		this.postEmpty.targetOnly = true;
		this.postEmpty.render({ texture: this.postFeedback.uniform.value });

		this.composePass.enabled = false;
		this.postCompose.targetOnly = true;
		this.postCompose.render({ texture: this.postEmpty.uniform.value });

		// this.postCompose.render({ texture: this.postFeedback.uniform.value });

		// This render the bloom effect's bright and blur passes to postBloom.fbo.read
		this.postBloom.targetOnly = true;
		this.postBloom.render({ texture: this.postCompose.uniform.value });

		// This renders to canvas, compositing the bloom pass on top
		this.composePass.enabled = true;
		this.postCompose.targetOnly = false;
		this.postCompose.render({ texture: this.postCompose.uniform.value });

		// pass texture for next frame feebdackframe
		this.feedbackPass.uniforms.tPreviousFrame.value = this.postCompose.uniform.value;



		// // render current scene
		// this.postEmpty.targetOnly = true;
		// this.postEmpty.render({ texture: this.postCompose.uniform.value });

		// //merge current scene and old + render it on target
		// this.postFeedback.targetOnly = true;
		// this.postFeedback.render({ texture: this.postEmpty.uniform.value });

		// // finally render on canvas
		// this.postEmpty.targetOnly = false;
		// this.postEmpty.render({ texture: this.postFeedback.uniform.value });

		// // pass texture for next frame feebdackframe
		// this.feedbackPass.uniforms.tPreviousFrame.value = this.postFeedback.uniform.value;

	}
}