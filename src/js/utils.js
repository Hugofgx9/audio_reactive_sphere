export function getCurrentURLPath() {
	return window.location.pathname.match(/\/(.*)/m)[1];
}

export function applySketchOptionsOnRender(render_instance, sketch_instance) {

	const ren = render_instance;
	const ske = sketch_instance;

	const options_from_sketch = ske.getSceneOptions();

	if (options_from_sketch.postprocess) {

		options_from_sketch.postprocess.forEach(post_item => {
			// a.enable = true;
			ren.postprocess;
		});
	}
}


export function replaceNestedObjValues(originalObj, newValuesObj) {

	for (const [key, value] of Object.entries(newValuesObj)) {

		if (typeof value === "object") {
			// console.log(key, value);
			replaceNestedObjValues(originalObj[key], value);
		}
		
		else {
			// console.log(value)
			originalObj[key] = value;
		}
	}

}