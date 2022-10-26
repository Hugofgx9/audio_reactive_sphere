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

		const sphere1 = this.sketch.sphere1;
		const sphere1_part_uniforms = sphere1.particles.position.passes[0].uniforms;
		const sphere2 = this.sketch.sphere2;
		const sphere2_part_uniforms = sphere2.particles.position.passes[0].uniforms;

		const folder_sphere1 = this.addFolder(this._, 'Sphere 1', { expanded: false });
		const folder_sphere2 = this.addFolder(this._, 'Sphere 2', { expanded: false });
		const pp_feedback = this.addFolder(this._, 'Feedback', { expanded: false });
		const pp_bloom = this.addFolder(this._, 'Bloom', { expanded: false });
		const preset = this.addFolder(this._, 'Presets', { expended: false });


		//sphere1
		folder_sphere1.addInput(sphere1_part_uniforms.u_middle_space, 'value', {
			label: 'Middle space',
			presetKey: 'middle_space1',
			min: 0,
			max: 1,
			step: 0.00001
		});

		folder_sphere1.addInput(sphere1_part_uniforms.u_density, 'value', {
			label: 'Density',
			presetKey: 'density1',
			min: 0,
			max: 1,
			step: 0.00001
		});

		folder_sphere1.addInput(sphere1_part_uniforms.u_ring, 'value', {
			label: 'Ring',
			presetKey: 'ring1',
			min: 0,
			max: 1,
			step: 0.00001
		});
		folder_sphere1.addInput(sphere1_part_uniforms.u_noise_amount, 'value', {
			label: 'Noise',
			presetKey: 'noise1_1',
			min: 0,
			max: 1,
			step: 0.00001
		});
		folder_sphere1.addInput(sphere1_part_uniforms.u_noise2_amount, 'value', {
			label: 'Noise2',
			presetKey: 'noise2_1',
			min: 0,
			max: 1,
			step: 0.00001
		});

		const colors_sphere1 = {
			color1: formatTweakerColor(hslToRgb(...sphere1.program.uniforms.u_color1.value)),
			color2: formatTweakerColor(hslToRgb(...sphere1.program.uniforms.u_color2.value)),
		};

		folder_sphere1.addInput(colors_sphere1, 'color1', {
			label: 'Color1',
			presetKey: 'color1_1',
			color: { type: 'float' },
			view: '',
			picker: 'inline',
			// expanded: true,
		}).on('change', (ev) => {
			sphere1.program.uniforms.u_color1.value = rgbToHsl(...Object.values(ev.value));
		});
		folder_sphere1.addInput(colors_sphere1, 'color2', {
			label: 'Color2',
			presetKey: 'color2_1',
			color: { type: 'float' },
			view: '',
			picker: 'inline',
			// expanded: true,
		}).on('change', (ev) => {
			sphere1.program.uniforms.u_color2.value = rgbToHsl(...Object.values(ev.value));
		});


		//sphere2
		folder_sphere2.addInput(sphere2_part_uniforms.u_middle_space, 'value', {
			label: 'Middle space',
			presetKey: 'middle_space2',
			min: 0,
			max: 1,
			step: 0.00001
		});

		folder_sphere2.addInput(sphere2_part_uniforms.u_density, 'value', {
			label: 'Density',
			presetKey: 'density2',
			min: 0,
			max: 1,
			step: 0.00001
		});

		folder_sphere2.addInput(sphere2_part_uniforms.u_ring, 'value', {
			label: 'Ring',
			presetKey: 'ring2',
			min: 0,
			max: 1,
			step: 0.00001
		});
		folder_sphere2.addInput(sphere2_part_uniforms.u_noise_amount, 'value', {
			label: 'Noise',
			presetKey: 'noise1_2',
			min: 0,
			max: 1,
			step: 0.00001
		});
		folder_sphere2.addInput(sphere2_part_uniforms.u_noise2_amount, 'value', {
			label: 'Noise2',
			presetKey: 'noise2_2',
			min: 0,
			max: 1,
			step: 0.00001
		});

		const sphere2_scale = { value: 0.5 };

		folder_sphere2.addInput(sphere2_scale, 'value', {
			label: 'Scale',
			presetKey: 'scale2',
			min: 0,
			max: 2,
			step: 0.00001
		}).on('change', (ev) => {
			sphere2.mesh.scale = [ev.value, ev.value, ev.value];
		});

		const colors_sphere2 = {
			color1: formatTweakerColor(hslToRgb(...sphere2.program.uniforms.u_color1.value)),
			color2: formatTweakerColor(hslToRgb(...sphere2.program.uniforms.u_color2.value)),
		};

		folder_sphere2.addInput(colors_sphere2, 'color1', {
			label: 'Color1',
			presetKey: 'color1_2',
			color: { type: 'float' },
			view: '',
			picker: 'inline',
			// expanded: true,
		}).on('change', (ev) => {
			sphere2.program.uniforms.u_color1.value = rgbToHsl(...Object.values(ev.value));
		});
		folder_sphere2.addInput(colors_sphere2, 'color2', {
			label: 'Color2',
			presetKey: 'color2_2',
			color: { type: 'float' },
			view: '',
			picker: 'inline',
			// expanded: true,
		}).on('change', (ev) => {
			sphere2.program.uniforms.u_color2.value = rgbToHsl(...Object.values(ev.value));
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