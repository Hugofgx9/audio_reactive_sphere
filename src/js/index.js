import '@src/style/style.scss';
import Alpine from 'alpinejs';
import Experience from "@src/js/experience";

const experience = new Experience()

document.addEventListener('alpine:init', () => {
	Alpine.data('container', () => ({
		isButtonOpen: true,
		closeButton() {
			this.isButtonOpen = false;
			experience.start();
		}
	}))
})

Alpine.start();

// const { isRootPath } = Alpine.store('navigation');
// if (!isRootPath) new Render();