precision highp float;

#pragma glslify: cosPalette = require(./utils/cosPalette.glsl);
#pragma glslify: snoise3 = require(./utils/noises/snoise3.glsl);
#pragma glslify: snoise4 = require(./utils/noises/snoise4.glsl);
#pragma glslify: map = require(./utils/map.glsl);

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;

float fbm3(vec3 p) {
  float f;
  vec2 uv = p.xy;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  f = 0.5000 * snoise3(vec3(p));
  uv = m * uv;
  f += 0.2500 * snoise3(vec3(p));
  uv = m * uv;
  f += 0.1250 * snoise3(vec3(p));
  uv = m * uv;
  f += 0.0625 * snoise3(vec3(p));
  uv = m * uv;
  f = 0.5 + 0.5 * f;
  return f;
}

// procedural noise from IQ
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324865; // (3-sqrt(3))/6;

  vec2 i = floor(p + (p.x + p.y) * K1);

  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;

  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);

  vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));

  return dot(n, vec3(70.0));
}

float fbm(vec3 p) {
  vec2 uv = p.xy;
  float cycle = p.z;
  float f;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  f = 0.5000 * snoise3(vec3(uv, p.z));
  uv = m * uv;
  f += 0.2500 * snoise3(vec3(uv, p.z));
  uv = m * uv;
  f += 0.1250 * snoise3(vec3(uv, p.z));
  uv = m * uv;
  f += 0.0625 * snoise3(vec3(uv, p.z));
  uv = m * uv;
  f = 0.5 + 0.5 * f;
  return f;
}

// MY MAIN SHADER

// void main() {
//   // vec3 normal = normalize(vNormal);
//   // gl_FragColor.rgb = vec3(normal);

//   float radius = .3;
//   float d = distance(v_uv, vec2(.5));
//   float direction = atan(v_uv.y - .5, v_uv.x - .5);
//   float border_n = (0.5 * (1. + fbm3(vec3(d * 4. - u_time, direction * 10., u_time * .5))));
//   // float border_n = fbm(vec2(d - u_time, direction * 10.));
//   float borderThickness = 0.1 + border_n * 0.2;

//   float t = 1.0 - smoothstep(0.0, borderThickness, abs(radius - d));

//   vec3 color = vec3(0.0, 0.0, 0.0);
//   float a = border_n * (1. - pow(d * 0.1, 3.));

//   color += t * vec3(0., 0., 1.);
//   gl_FragColor.rgb = color;
//   gl_FragColor.a = a;
// }

// void main() {

//   float radius = .3;
//   float d = distance(v_uv, vec2(.5));
//   float direction = atan(v_uv.y - .5, v_uv.x - .5);

//   float angle = direction;
//   // d -= 0.3;

//   float x_off = cos(angle);
//   float y_off = sin(angle);  
//   d += snoise3(vec3(x_off, y_off, u_time * .2)) * 0.01;

//   float borderThickness = 0.01;

//   float t = 1.0 - smoothstep(0.0, borderThickness, abs(radius - d));

//   vec3 color = vec3(0.0, 0.0, 0.0);

//   color += t * vec3(0., 0., 1.);
//   gl_FragColor.rgb = color;
//   gl_FragColor.a = 1.;
// }

//////////////////////
// Fire Flame shader

// no defines, standard redish flames
//#define BLUE_FLAME
//#define GREEN_FLAME

void main() {
  vec2 uv = v_uv;

  //ratio
  float ratio = u_resolution.x / u_resolution.y;
  uv.x = (uv.x * ratio) - (ratio - 1.0) * 0.5;

  float strength = 3.;
  vec2 q = uv;
  q.x *= 8.;
  float T3 = max(3., 1.25 * strength) * u_time * 0.1;

  float d = distance(uv, vec2(.5));
  float angle = atan(uv.y - .5, uv.x - .5);
  // angle += u_time * 0.1;

  // float movement = 0.1;
  float movement = sin(u_time);

  angle += movement * map(smoothstep(0., .5, d), 0.5, 1., 0., 0.5) + u_time * -0.3;
  // angle = 0.159 * (angle + 3.14); //from 0 to 1;
  // float n_angle = 0.159 * (angle + 3.14); //from 0 to 1;
  d -= 0.3;
  // angle = cos(angle) + sin(angle);
  // angle = (1. + angle) * .5;

  q = vec2(angle * 3., d);

  float noise_scale = 1.;
  float x_off = cos(angle) * noise_scale + 10.;
  float y_off = sin(angle) * noise_scale + 13.;

  float n = fbm(vec3(strength * vec2(x_off, y_off) - vec2(0, T3), -u_time + d * map(movement, -1., 1., 6., 20.)));
  // float c = 1. - 10. * pow(max(-0.5, length(q * vec2(1.8 + q.y * 1.5, .75)) - n * max(0., q.y + .25)), 1.2);
  float c = 1. - 3. * pow(max(-0.2, n * max(0., 3. * abs(q.y))), 2.);
  // float c = 1.;
  float c1 = n * c * (1.5 - pow(0.5 - q.y * 1., 5.));
  // float c1 = n * c * ;
  c1 = clamp(c1, 0., 1.);

  c1 = (c1 * c1 * c1 * c1 * c1 * c1);

  vec3 col = vec3(0.);

  // col = vec3(clamp(mod(u_time * 0.5, 2.), 0., 1.));
  // vec3 col = vec3(color_amount);

  // vec3 col = vec3( color_amount );

  // col = vec3(c1);

  // float a = c * (1. - pow(q.y, 3.));
  float a = 1.;

  // col += smoothstep(0., 0.4, c1) * vec3(0.9333, 0.3294, 0.0667);
  // col += smoothstep(0., 1., c1) * vec3(0.1843, 0.1843, 0.5216);

  // col = mix(col, vec3(0.0), smoothstep(0.0, 0.5, d));

  // col = map(c1, 0.2, 0.4, 0., 1.) * vec3(0.9412, 0.0, 0.0);
  // col += map(c1, 0.4, 1., 0., 1.) * vec3(0.0, 0.251, 0.9412);

  // col += c1 * vec3(0.1098, 0.0, 0.9412);

  gl_FragColor = vec4(mix(vec3(0.), col, a), 1.0);

  // float e = pow(max(-0.2, n * max(0., q.y + .2)), 2.);

  // gl_FragColor = vec4( vec3(sin(angle)) , 1.);
  // gl_FragColor = vec4(vec3( 0.159 * (angle + 3.14) ), 1.);

  // float color_amount = distance(uv, vec2(.5)) - clamp(mod(u_time * 0.5, 2.), 0., 1.) * 2. + 1.;
  // float color_amount2 = distance(uv, vec2(.5)) - clamp(mod((u_time * 0.5) + 1., 2.), 0., 1.) * 2. + 1.;

  float color_amount = distance(uv, vec2(.5)) * 2.;

  // color_amount = mod(color_amount, 0.25 *  0.2 + sin(u_time) * 4. ) * 4.; 
  color_amount = 1. - color_amount;
  color_amount += u_time * 0.3;
  // color_amount = color_amount * 1. + u_time * 4.;


  float color_amount_1 = sin(color_amount);
  float color_amount_2 = cos(color_amount);

  float a1 = smoothstep(-1., 0., color_amount_1);
  col = mix(col, vec3(1.0, 1.0, 1.0), a1);
  float a2 = smoothstep(-1., 0., color_amount_2);
  col = mix(col, vec3(0.102, 0.2941, 0.9255), a2);
  float a3 = smoothstep(0., 1., color_amount_1);
  col = mix(col, vec3(1.0, 0.051, 0.0), a3);
  float a4 = smoothstep(0., 1., color_amount_2);
  col = mix(col, vec3(0.9529, 0.498, 0.1961), a4);

  col *= c1;



  // col += vec3(color_amount);

  // col += vec3(color_amount) * 0.5;
  gl_FragColor = vec4(col, 1.);

  // col += vec3(0.0, 0.251, 0.9412) * (1. - color_amount);
  // col -= vec3(0.0, 0.0, 0.0) * (1. - color_amount2);

  // col = max(vec3(color_amount), vec3(color_amount));
}