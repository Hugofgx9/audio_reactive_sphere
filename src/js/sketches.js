import Alpine from 'alpinejs';

import Sketch1 from '@sketches/1';
import Sketch2 from '@sketches/2';
import Sketch3 from '@sketches/3';
import Sketch4 from '@sketches/4';
import Sketch5 from '@sketches/5';
import Sketch6 from '@sketches/6';
import Sketch7 from '@sketches/7';
import Sketch8 from '@sketches/8';


// const sketches = import.meta.glob('../sketches/*/index.js')


const sketches = [
	Sketch1,
	Sketch2,
	Sketch3,
	Sketch4,
	Sketch5,
	Sketch6,
	Sketch7,
	Sketch8,
];
export default sketches;



Alpine.store('sketches', {
	items: sketches.map((s, i) => i + 1),
});

Alpine.store('navigation', {
	isRootPath: window.location.pathname === '/'
});
