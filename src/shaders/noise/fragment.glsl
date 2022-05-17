varying vec2 vUv;
uniform float uTime;
uniform sampler2D tDiffuse;

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
  float whiteNoise = (rand(vUv * 50. + mod(uTime, 5.)) * 0.12);
  vec3 c = texture2D(tDiffuse, vUv).xyz;

  gl_FragColor = vec4(vec3(c + whiteNoise), 1.);
}
