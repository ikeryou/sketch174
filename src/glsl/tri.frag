uniform vec3 color;
uniform float alpha;

varying vec2 vUv;

void main(void) {
  float a = step(vUv.x * 0.5, vUv.y);
  if(vUv.y >= 0.5) {
    a = step(vUv.x * 0.5, 1.0 - vUv.y);
  }
  vec4 dest = vec4(color, a);
  gl_FragColor = dest;
}
