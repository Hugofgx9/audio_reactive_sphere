import { Renderer, Transform, Camera } from 'ogl';
import { getCurrentURLPath } from './utils';
import Gl from '@gl';

export default class Experience {

  constructor() {
    this.init();
  }

  init() {
    this.$canvas = document.querySelector('canvas');

    this.canvas = this.$canvas.getBoundingClientRect();
    this.renderer = new Renderer({
      canvas: this.$canvas,
      width: this.canvas.width,
      height: this.canvas.height,
      alpha: true,
      antialias: true,
      dpr: window.devicePixelRatio
    });
    this.gl = this.renderer.gl;
    this.clock = 0;
    this.scene = new Transform();

    this.camera = new Camera(this.gl, { fov: 35 });
    this.camera.position.set(0, 1, 7);
    this.camera.lookAt([0, 0, 0]);
    this.camera.perspective({ aspect: this.canvas.width / this.canvas.height });

    this.gl = new Gl(this.gl, {
      canvas: this.canvas,
      scene: this.scene,
      render: this,
    });

    window.addEventListener('resize', () => this.resize());
    this.play();

  }

  resize() {

    // this.sketch.onResize();
    // todo

  }

  start(){
    this.gl.play()
  }


  frame(past, now = performance.now()) {
    this.request = requestAnimationFrame(this.frame.bind(this, now));
    const last = past || now;
    let d = (now - last) * (60 / 1000); // normalize at 60fps

    this.clock += d;

    this.gl.update();

    // Don't need a camera if camera uniforms aren't required
    // this.renderer.render({ scene: this.scene, camera: this.camera });
    // this.renderer.render({ scene: this.scene });
    // this.postprocess.render();
  }

  play() {
    if (this.request) return null;
    this.request = requestAnimationFrame(this.frame.bind(this));
  }

  pause() {
    if (this.request) cancelAnimationFrame(this.request);
    this.request = null;
  }
}

