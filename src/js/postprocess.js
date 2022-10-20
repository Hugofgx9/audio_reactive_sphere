import { Post } from 'ogl';
import feedbackF from '@src/glsl/postprocess/feedback.frag';


export default class PostProces {

	constructor(gl, { webgl }) {
		this.gl = gl;
		this.webgl = webgl;
		this.scene = webgl.scene;
		this.camera = webgl.camera;
		this.canvas = webgl.canvas;

		this.options = {
			feedback: {
				enable: true,
				amount: 0.99,
				// type: 1, //no implemanted
			}
		};

		// this.init();
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
				uFeedbackAmount: { value: this.options.feedback.amount },
			},
		});
	}


	onResize() {
		this.postFeedback.resize();
		this.postEmpty.resize();
	}

	render() {
		
		//render current scene
		this.postEmpty.targetOnly = true;
		this.postEmpty.render({ scene: this.scene, camera: this.camera });
		
		//merge current scene and old + render it on target
		this.postFeedback.targetOnly = true;
		this.postFeedback.render({ texture: this.postEmpty.uniform.value });		
		
		//finally render on canvas
		this.postEmpty.targetOnly = false;
		this.postEmpty.render({ texture: this.postFeedback.uniform.value });

		//pass texture for next frame
		this.feedbackPass.uniforms.tPreviousFrame.value = this.postFeedback.uniform.value;
	}
}