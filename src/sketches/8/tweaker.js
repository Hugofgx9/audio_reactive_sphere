import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { hslToRgb, rgbToHsl, formatTweakerColor} from './utils';

export default class Tweaker {

	constructor(sketch) {
		this.sketch = sketch;

		this._ = new Pane({ title: 'Tweaker' });


		this.init();
	}


	init() {
		this._.registerPlugin(EssentialsPlugin);
		this.folders = {};
		this.create();
	}

	create() {
		//fps
		const fps = this.addFolder(this._, 'fps', { expanded: true });

		this.fpsGraph = fps.addBlade({
			view: 'fpsgraph',
			label: 'graph',
			max: 125,
			lineCount: 1.8,
		});

		const particles = this.addFolder(this._, 'Particles', { expanded: false });
		const pp_feedback = this.addFolder(this._, 'Feedback', { expanded: false });
		const pp_bloom = this.addFolder(this._, 'Bloom', { expanded: false });
		const preset = this.addFolder(this._, 'Presets', { expended: false });


		//particules
		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_middle_space, 'value', {
			label: 'Middle space',
			presetKey: 'middle_space',
			min: 0,
			max: 1,
			step: 0.00001
		});

		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_density, 'value', {
			label: 'Density',
			presetKey: 'density',
			min: 0,
			max: 1,
			step: 0.00001
		});

		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_ring, 'value', {
			label: 'Ring',
			presetKey: 'ring',
			min: 0,
			max: 1,
			step: 0.00001
		});
		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_noise_amount, 'value', {
			label: 'Noise',
			presetKey: 'noise',
			min: 0,
			max: 1,
			step: 0.00001
		});
		particles.addInput(this.sketch.particles.position.passes[0].uniforms.u_noise2_amount, 'value', {
			label: 'Noise2',
			presetKey: 'noise2',
			min: 0,
			max: 1,
			step: 0.00001
		});

		const colors = {
			color1: formatTweakerColor(hslToRgb(...this.sketch.program.uniforms.u_color1.value)),
			color2: formatTweakerColor(hslToRgb(...this.sketch.program.uniforms.u_color2.value)),
		};

		particles.addInput(colors, 'color1', {
			label: 'Color1',
			presetKey: 'color1',
			color: { type: 'float' },
			view: '',
			picker: 'inline',
			// expanded: true,
		}).on('change', (ev) => {
			this.sketch.program.uniforms.u_color1.value = rgbToHsl(...Object.values(ev.value));
		});
		particles.addInput(colors, 'color2', {
			label: 'Color2',
			presetKey: 'color2',
			color: { type: 'float' },
			view: '',
			picker: 'inline',
			// expanded: true,
		}).on('change', (ev) => {
			this.sketch.program.uniforms.u_color2.value = rgbToHsl(...Object.values(ev.value));
		});


		//postprocess
		pp_feedback.addInput(this.sketch.postprocess.feedbackPass.uniforms.uFeedbackAmount, 'value', {
			label: 'FeedbackAmount',
			presetKey: 'feedback_amount',
			min: 0,
			max: 1,
			step: 0.0001
		});

		pp_bloom.addInput(this.sketch.postprocess.brightPass.uniforms.uThreshold, 'value', {
			label: 'Bright Threeslod',
			presetKey: 'bright_threeslod',
			min: 0,
			max: 1,
			step: 0.01
		});
		pp_bloom.addInput(this.sketch.postprocess.composePass.uniforms.uBloomStrength, 'value', {
			label: 'BloomStrength',
			presetKey: 'bloom_strength',
			min: 0,
			max: 20,
			step: 0.1
		});

		// pp_bloom.addInput(this.sketch.postprocess.vertPass.uniforms.uDirection.value, 'x', {
		// 	label: 'bloom dir',
		// 	min: 0,
		// 	max: 20,
		// 	step: 0.1,
		// }).on('change', (event) => {
		// 	// this.sketch.postprocess.horiPass.uniforms.uDirection.value.y = event.value;
		// });
		// console.log('change')
		// });


		//presets
		preset.addBlade({
			view: 'buttongrid',
			label: 'Presets',
			size: [5, 3],
			cells: (x, y) => ({
				title: y * 5 + x + 1,
			}),
		}).on('click', (ev) => {

			this.sketch.presets.applyPreset(ev.cell.title - 1);
		});

		preset.addButton({
			title: 'Copy Params',
		}).on('click', () => {
			navigator.clipboard.writeText(JSON.stringify(this._.exportPreset()));
			// preset_params.export = JSON.stringify(this._.exportPreset());
		});


		this._.addButton({
			title: 'Play'
		}).on('click', () => this.sketch.play())
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