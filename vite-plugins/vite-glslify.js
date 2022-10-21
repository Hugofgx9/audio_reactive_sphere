import glsl from 'glslify';
import path from 'path';
import { transformWithEsbuild } from 'vite';

const fileRegex = /\.(glsl|vert|frag)$/;

export default function glslify() {
	return {
		name: 'transform-glslify',

		async transform(source, shader) {
			if (fileRegex.test(shader)) {

				const dirname = path.dirname(shader);
				const filename = path.basename(shader);


				// console.log(filename);


				// source = source.replace(/\n/g, ' '); //transform multiline to inline

				return await transformWithEsbuild(
					glsl.compile(source, { basedir: dirname }),
					shader,
					{ loader: 'text', format: 'esm' }
				);

				// return {
				// 	code: src,
				// 	// code: glsl.compile(src, { basedir: dirname }),
				// 	map: null // provide source map if available
				// };
			}
		}
	};
}