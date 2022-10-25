const presets = [
	{ "middle_space": 1, "density": 0.9782600000000001, "ring": 0.19564999999999994, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
	{ "middle_space": 1, "density": 0, "ring": 0, "feedback_amount": 0.68, "bright_threeslod": 0.66, "bloom_strength": 2.4 },
	{"middle_space":1,"density":1,"ring":1,"feedback_amount":0.68,"bright_threeslod":0.66,"bloom_strength":2.4},
	{"middle_space":0,"density":1,"ring":0,"feedback_amount":0.995,"bright_threeslod":0.01999999999999999,"bloom_strength":1.5},
	{"middle_space":0.11957,"density":1,"ring":0.06521999999999992,"feedback_amount":0.5435,"bright_threeslod":0.6,"bloom_strength":5.4}
];



function applyPreset(index, tweaker) {
	const preset = presets[index];

	tweaker._.importPreset(preset);
}







export { presets, applyPreset };


