export function positiveOrNegative() {
	return Math.random() > 0.5 ? -1 : 1;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
export function hslToRgb(h, s, l) {
	let r, g, b;

	function hue2rgb(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [r, g, b];
}


/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
export function rgbToHsl(r, g, b) {
	const max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
}

export function formatTweakerColor(array) {
	return { r: array[0], g: array[1], b: array[1] };
}


export function random(min, max) {
	return (Math.random() * (max - min)) + min;
}

export function staticTextureParams(gl) {

	return {
		type: gl.FLOAT,
		format: gl.RGBA,
		internalFormat: gl.renderer.isWebgl2 ? gl.RGBA32F : gl.RGBA,
		wrapS: gl.CLAMP_TO_EDGE,
		wrapT: gl.CLAMP_TO_EDGE,
		generateMipmaps: false,
		minFilter: gl.NEAREST,
		magFilter: gl.NEAREST,
		flipY: false,
	};
}

// export function get3TopItems(arr) {
//   return arr.sort((a, b) => b - a).slice(0, 3);
// }

export function findTop3(array) {
	const maxValues = [];
	const maxIndex = [];
	for (var i = 0; i < array.length; i++) {
		if (i === 0) {
			maxValues.push(array[i]);
			maxIndex.push(i);
		} else if (i === 1) {
			if (array[i] > maxValues[0]) {
				maxValues.push(maxValues[0]);
				maxValues[0] = array[i];
				maxIndex.push(maxIndex[0]);
				maxIndex[0] = i;
			} else {
				maxValues.push(array[i]);
				maxIndex.push(i);
			}
		} else if (i === 2) {
			if (array[i] > maxValues[0]) {
				maxValues.push(maxValues[0]);
				maxValues[1] = maxValues[0];
				maxValues[0] = array[i];
				maxIndex.push(maxIndex[0]);
				maxIndex[1] = maxIndex[0];
				maxIndex[0] = i;

			} else {
				if (array[i] > maxValues[1]) {
					maxValues.push(maxValues[1]);
					maxValues[1] = array[i];
					maxIndex.push(maxIndex[1]);
					maxIndex[1] = i;
				} else {
					maxValues.push(array[i]);
					maxIndex.push(i);
				}
			}
		} else {
			if (array[i] > maxValues[0]) {
				maxValues[2] = maxValues[1];
				maxValues[1] = maxValues[0];
				maxValues[0] = array[i];
				maxIndex[2] = maxIndex[1];
				maxIndex[1] = maxIndex[0];
				maxIndex[0] = i;
			} else {
				if (array[i] > maxValues[1]) {
					maxValues[2] = maxValues[1];
					maxValues[1] = array[i];
					maxIndex[2] = maxIndex[1];
					maxIndex[1] = i;
				} else if (array[i] > maxValues[2]) {
					maxValues[2] = array[i];
					maxIndex[2] = i;
				}
			}
		}
	}

	return {
		index: maxIndex,
		values: maxValues
	};
}