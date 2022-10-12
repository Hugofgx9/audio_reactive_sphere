import { Post, RenderTarget, Texture } from 'ogl';
import feedbackF from '@src/glsl/postprocess/feedback.frag';


export default class PostProces {

	constructor(gl, { webgl }) {
		this.gl = gl;
		this.webgl = webgl;
		this.scene = webgl.scene;
		this.camera = webgl.camera;
		this.canvas = webgl.canvas;
		this.init();
	}

	init() {

		const fbo_options = {
			height: this.canvas.height,
			width: this.canvas.width
		};


		this.feedback = {};

		const fbo = (this.feedback.fbo = {
			read: null,
			write: null,
			swap: () => {
				let temp = fbo.read;
				fbo.read = fbo.write;
				fbo.write = temp;
			},
		});


		this.feedback.fbo.read = new RenderTarget(this.gl, fbo_options);
		this.feedback.fbo.write = new RenderTarget(this.gl, fbo_options);

		this.basicSceneBuffer = new RenderTarget(this.gl, fbo_options);


		// const previousFrameTexture = new Texture(this.gl, {
		// 	width: this.canvas.width,
		// 	height: this.canvas.height
		// });

		this.postComposite = new Post(this.gl);
		this.postComposite.addPass();

		this.postFeedback = new Post(this.gl);
		this.feedbackPass = this.postFeedback.addPass({
			fragment: feedbackF,
			uniforms: {
				uResolution: { value: [this.canvas.width, this.canvas.height] },
				tPreviousFrame: { value: this.postFeedback.uniform },
				// tPreviousFrame: { value: null },
				// uFeedbackAmount: { value: 0.99 },
			},
		});
		// this.basicPass = this.postFeedback.addPass();

	}


	onResize() {
		this.postFeedback.resize();
		this.postComposite.resize();
	}

	render() {

		// this.postFeedback.render({ scene: this.scene, camera: this.camera, target: this.postFeedback.fbo.write.buffer });
		// this.postFeedback.fbo.swap();
		// this.postFeedback.render({ texture: this.postFeedback.fbo.read.buffer })

		// this.postComposite.render({ scene: this.scene, camera: this.camera });


		// this.radialPass.uniforms.uTime.value = this.webgl.clock * 0.1;

		//draw to canvas 
		// this.feedbackPass.enabled = true;
		// this.postFeedback.targetOnly = false;
		// this.postFeedback.render({ texture: this.feedback.fbo.write.buffer });
		// this.postFeedback.render({ scene: this.scene, camera: this.camera });

		//render current scene
		// this.feedbackPass.enabled = false;
		this.postComposite.targetOnly = true;
		this.postComposite.render({ scene: this.scene, camera: this.camera });

		// this.postFeedback.render({texture: this.postComposite.uniform})

		// this.postFeedback.fbo.swap(); //because postFeeback buffer is use by feedbackPass as input

		//merge current scene and old + render it on target
		this.postFeedback.targetOnly = true;
		this.feedbackPass.enabled = true;
		this.postFeedback.render({ texture: this.postComposite.uniform.value });

		this.feedbackPass.uniforms.tPreviousFrame.value = this.postFeedback.uniform.value;


		this.postComposite.targetOnly = false;
		this.postComposite.render({ texture: this.postFeedback.uniform.value})


		// this.feedback.fbo.swap();


		// this.basicPass.enabled = false;
		// this.postFeedback.targetOnly = false;
		// this.feedbackPass.enabled = false;
		// this.postFeedback.render({ texture: this.postFeedback.uniform.value, update: false });
		// this.postFeedback.render({ texture: this.basicSceneBuffer.buffer });
		// this.postFeedback.render({ scene: this.scene, camera: this.camera });





		/* 		
		1- render current scene and camera 
				-> target postFeedback && no pass 
		2- merge the rendered scene with the last frame texture
				-> in -> 
		3- render the previous generated texture in the canvas 		
		*/
	}
}