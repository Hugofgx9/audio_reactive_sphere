import { Pane } from 'tweakpane';

export default class Tweaker {

	constructor(sketch) {
		this.sketch = sketch;

		this._ = new Pane({
			title: 'Tweaker',
			// expanded: false
		});

		this.folders = {};

		this.create();
	}

	create() {
		const particles = this.addFolder(this._, 'Particles', { expanded: true });
		const pp_feedback = this.addFolder(this._, 'Feedback', { expanded: false });
		const pp_bloom = this.addFolder(this._, 'Bloom', { expanded: false });

		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_middle_space, 'value', {
			label: 'Middle space',
			min: 0,
			max: 1,
			step: 0.00001
		});

		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_density, 'value', {
			label: 'Density',
			min: 0,
			max: 1,
			step: 0.00001
		});

		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_ring, 'value', {
			label: 'Ring',
			min: 0,
			max: 1,
			step: 0.00001
		});


		pp_feedback.addInput(this.sketch.postprocess.feedbackPass.uniforms.uFeedbackAmount, 'value', {
			label: 'FeedbackAmount',
			min: 0,
			max: 1,
			step: 0.0001
		});



		pp_bloom.addInput(this.sketch.postprocess.brightPass.uniforms.uThreshold, 'value', {
			label: 'Bright Threslod',
			min: 0,
			max: 1,
			step: 0.01
		});
		pp_bloom.addInput(this.sketch.postprocess.composePass.uniforms.uBloomStrength, 'value', {
			label: 'BloomStrength',
			min: 0,
			max: 20,
			step: 0.1
		});

		pp_bloom.addInput(this.sketch.postprocess.vertPass.uniforms.uDirection.value, 'x', {
			label: 'bloom dir',
			min: 0,
			max: 20,
			step: 0.1,

		}).on('change', (event) => {
			this.sketch.postprocess.horiPass.uniforms.uDirection.value.y = event.value;
		});
		// console.log('change')
		// });





		// this.addTab(this._, [{ title: 'Parameter' }, { title: 'Color' }]);
	}

	addTab(parent, pages) {
		const tab = parent.addTab({
			pages
		});

		return tab.pages;
	}


	addFolder(parent, title, opts) {

		if (!opts) opts = { expanded: false };
		return this.folders[title] = parent.addFolder({
			title,
			...opts
		});
	}
}