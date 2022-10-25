import Alpine from 'alpinejs';
import sketches from '@js/sketches';

Alpine.store('sketches', {
	items: sketches.map((s, i) => i + 1),
});

Alpine.store('navigation', {
	isRootPath: window.location.pathname === '/'
});
