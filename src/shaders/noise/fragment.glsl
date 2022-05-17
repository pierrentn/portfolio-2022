varying vec2 vUv;
uniform float uTime;
uniform sampler2D tDiffuse;

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
    return mix(
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend), 
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend), 
        step(base, vec3(0.5))
    );
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  float whiteNoise = rand(vec2(vUv.x * 25., vUv.y * 50.) + fract(uTime)) * 1.;
  vec4 c = texture2D(tDiffuse, vUv);
  
  vec3 grain = blendSoftLight(c.rgb, vec3(whiteNoise));
  // grain = mix(c.rgb, grain, step(vUv.x, 0.5));

  //get the luminance of the background
  float luminance = luma(c.rgb);
  
  //reduce the noise based on some 
  //threshold of the background luminance
  float response = smoothstep(0.05, 0.9, luminance);
  // grain = mix(grain, c.rgb, pow(response, 2.0));
  grain = mix(grain, c.rgb, min(response, 0.2));

  gl_FragColor = vec4(vec3(c.rgb + whiteNoise * 0.12), c.a);
  gl_FragColor = vec4(vec3(grain), c.a);
}
