import '@src/style/style.scss';
import Alpine from 'alpinejs';
import "@js/alpine";
import Render from "@src/js/render";

Alpine.start();

const { isRootPath } = Alpine.store('navigation');


if (!isRootPath) new Render();