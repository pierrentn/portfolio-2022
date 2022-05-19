varying vec2 vUv;
uniform vec2 uMouseUv;
uniform vec2 uRez;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uProgress;
uniform vec3 uColor;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  uv*=uRez;
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
}

float easeOutExpo(float x) {
  return 1.0 - (1.0 - x) * (1.0 - x);
}

void main() {
  vec2 newUv = vUv;
  // newUv = fract(newUv * 10.);

    float centerY = length(newUv.y - uMouseUv.y);
    float centerX = newUv.x *( 2. * uProgress);
    // float centerX = length(newUv.x -  uMouseUv.x) *( 2. * uProgress);

    float offset = floor(centerY * 20.) / 20.;
    //Offset progress 
    float offsetProgress = clamp(uProgress * 1.5 + offset, 0., 1.);
    float opening = smoothstep(offsetProgress, 1., 1. - centerX);

    vec3 c1 = texture2D(uTexture, newUv).rgb * easeOutExpo(uProgress);
    c1 = mix(uColor * easeOutExpo(uProgress), c1, c1);
    vec3 c2 = texture2D(uTexture, vUv * opening).rgb;
  
    vec3 c = mix(c1, c2, opening);
    
    // vec2 st = gl_FragCoord.xy / uRez.xy - vec2(0.5);
    // st.x *= uRez.y / uRez.x;
  gl_FragColor = vec4(vec3(c), 1.);
}
