varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  vec3 c = texture2D(uTexture, vUv).rgb;

  gl_FragColor = vec4(c, 1.);
}
