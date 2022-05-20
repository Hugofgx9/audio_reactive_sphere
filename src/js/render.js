import { Renderer, Geometry, Program, Mesh, Transform, Camera } from 'ogl';
import Sketch from './sketch2';


export default class Render {

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
    // const controls = new Orbit(camera);

    this.sketch = new Sketch(this.gl, {
      canvas: this.canvas,
      scene: this.scene,
      render: this,
    });

    this.play();

  }

  resize(){
    // todo

  }


  frame(past, now = performance.now()) {
    this.request = requestAnimationFrame(this.frame.bind(this, now));
    const last = past || now;
    let d = (now - last) * (60 / 1000); // normalize at 60fps

    this.clock += d* 0.01;


    this.sketch.update();

    // Don't need a camera if camera uniforms aren't required
    this.renderer.render({ scene: this.scene });
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

