import { Renderer, Geometry, Program, Mesh } from 'ogl';
import v_shader from '../glsl/v-shader.glsl';
import f_shader from '../glsl/f-shader.glsl';



export default class Shape {

  constructor() {

    this.init()

  }

  init() {
    this.$canvas = document.querySelector('canvas')

    this.canvas = this.$canvas.getBoundingClientRect()
    this.renderer = new Renderer({
      canvas: this.$canvas,
      width: this.canvas.width,
      height: this.canvas.height,
      alpha: true,
      antialias: true,
      dpr: window.devicePixelRatio
    });
    this.gl = this.renderer.gl;

    this.clock = 0

    this.drawShape()
    this.play()

  }

  drawShape() {

    // Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
    const geometry = new Geometry(this.gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });
    // Alternatively, you could use the Triangle class.

    this.program = new Program(this.gl, {
      vertex: v_shader,
      fragment: f_shader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: [this.canvas.width, this.canvas.height] },

      },
      transparent: true
    });

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });

  }


  frame(past, now = performance.now()) {
    this.request = requestAnimationFrame( this.frame.bind(this, now) );
    const last = past || now;
    let d = (now - last) * (60 / 1000); // normalize at 60fps

    this.clock += d;

    this.program.uniforms.u_time.value = this.clock;

    // Don't need a camera if camera uniforms aren't required
    this.renderer.render({ scene: this.mesh });
  }

  play() {
    if (this.request) return null
    this.request = requestAnimationFrame(this.frame.bind(this))
  }

  pause() {
    if (this.request) cancelAnimationFrame(this.request)
    this.request = null
  }
}

