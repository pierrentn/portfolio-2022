#include ../utils/noise2d
#include ../utils/fbm
#define PI 3.14159265358

uniform float uTime;
uniform float uWhiteWidth;
uniform float uWhiteFade;
uniform float uProgressTrans;
uniform float uProgressFade;
uniform float uColorGradientIntens;
uniform float uLineWidth;
uniform float uGridProgress;
uniform vec3 uColor2;
uniform vec3 uColor1;
uniform vec3 uColor4;
uniform vec3 uColor3;
uniform vec2 uMouse;


varying vec2 vUv;
varying vec3 vPosition;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

float easeInExpo(float x) {
return x == 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0);
}

void main () {

  vec2 uv = vUv;
  uv -= 0.5;
  uv = scale(vec2(vec2((1. - uProgressTrans * 1.) * 1.))) * uv;
  // uv = rotate2d((PI * 1.) * uProgressTrans) * uv;
  uv += 0.5;

  float limitPos = 1. - (0.5 - uMouse.y * 0.1);
  float centerY = length(uv.y - limitPos);
  float centerX = length(uv.x - 0.5);

  float topSide = smoothstep(0., 0.0, centerY * step(limitPos, uv.y));
  float botSide = smoothstep(0., 0.0, centerY * step(uv.y, limitPos));

  // float clouds = (fbm(vUv * 40. + uTime * 0.5));
  // clouds *= 0.1 * (centerY * 0.8);

  float lines = mod(uv.x, 0.1) * 10.;
  float pattern = smoothstep(0.01 * (centerY ), 0.02 + uLineWidth * (centerY ), lines);
  //color offset from center
  float offset = floor(centerX * 30.) / 30.;
  //Offset progress 
  float offsetProgress = clamp(uProgressFade + offset, 0., 1.);
  float opening = smoothstep(offsetProgress, 1., 1. - centerY);

  
  // float grid = pattern;
  float grid = 1.;
  // grid = grid * opening;
  grid = mix(1., opening, uGridProgress);
 

  vec3 c1 = mix(uColor1, uColor2, pow(opening, uColorGradientIntens)) * topSide;
  vec3 c2 = mix(uColor3, uColor4, pow(opening, uColorGradientIntens)) * botSide;
  
  float whiteCenter = centerY * uWhiteWidth;
  whiteCenter = smoothstep(min((0.93 + 0.065 * uProgressFade) + offset * 0.1, 1.), 1. ,1. - whiteCenter) * 1.;

  float whiteNoise = (rand(uv * 50. + mod(uTime, 5.)) * 0.2) * opening;

  vec3 c = c1 + c2;
  // c = mix(c, vec3(1.), pow(whiteCenter, uWhiteFade));
  c *= grid;
  // c += whiteNoise * opening;

  // gl_FragColor = vec4(vec3(c + whiteNoise), (1.0 - uProgressFade + 0.2));
    // gl_FragColor = vec4(vec3(c + whiteNoise), 1.0);
    gl_FragColor = vec4(vec3(c + 0.05), 1.0);
}