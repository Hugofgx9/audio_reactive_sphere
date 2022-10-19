import { Renderer, Geometry, Program, Mesh, Transform, Camera } from 'ogl';
import PostProcess from './postprocess';
import Sketch1 from '@sketches/sketch1';
import Sketch2 from '@sketches/sketch2';
import Sketch3 from '@sketches/sketch3';
import { getCurrentURLPath } from './utils';


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
    this.postprocess = new PostProcess(this.gl, { webgl: this });

    this.camera = new Camera(this.gl, { fov: 35 });
    this.camera.position.set(0, 1, 7);
    this.camera.lookAt([0, 0, 0]);
    this.camera.perspective({ aspect: this.canvas.width / this.canvas.height });
    // const controls = new Orbit(camera);

    this.instantiateSketchFromPath();

    this.play();
  }

  resize() {
    // todo

  }

  instantiateSketchFromPath() {
    const sketches = {
      1: Sketch1,
      2: Sketch2,
      3: Sketch3,
    };

    const path_index = getCurrentURLPath();

    this.sketch = new sketches[path_index](this.gl, {
      canvas: this.canvas,
      scene: this.scene,
      render: this,
    });
  }


  frame(past, now = performance.now()) {
    this.request = requestAnimationFrame(this.frame.bind(this, now));
    const last = past || now;
    let d = (now - last) * (60 / 1000); // normalize at 60fps

    this.clock += d * 0.01;


    this.sketch.update();

    // Don't need a camera if camera uniforms aren't required
    // this.renderer.render({ scene: this.scene, camera: this.camera });
    // this.renderer.render({ scene: this.scene });
    this.postprocess.render();
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

