#version 300 es
precision highp float;

// mandatory inputs
in vec2 screenUV;
in vec2 sourceUV;
in vec2 destinationUV;
out vec4 outColor;

// mandatory uniforms
uniform float time;
uniform float deltaTime;
uniform float framerate;
uniform int frame;
uniform vec2 resolution;
uniform sampler2D sourceTexture;
uniform sampler2D destinationTexture;
uniform mat4 sourceMatrix;
uniform mat4 destinationMatrix;

// your custom color uniforms now as vec4
uniform vec4 colorYellow;
uniform vec4 colorDeepBlue;
uniform vec4 colorRed;
uniform vec4 colorBlue;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a){
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 hash(vec2 p){
  p = vec2(dot(p, vec2(2127.1,81.17)),
           dot(p, vec2(1269.5,283.37)));
  return fract(sin(p)*43758.5453);
}

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(
    mix(dot(-1.0+2.0*hash(i+vec2(0,0)), f-vec2(0,0)),
        dot(-1.0+2.0*hash(i+vec2(1,0)), f-vec2(1,0)), u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0,1)), f-vec2(0,1)),
        dot(-1.0+2.0*hash(i+vec2(1,1)), f-vec2(1,1)), u.x),
    u.y
  );
}

void main(){
  vec2 uv = sourceUV;
  float ratio = resolution.x/resolution.y;
  vec2 tuv = uv - 0.5;
  tuv.y /= ratio;

  float degree = noise(vec2(time*0.1, tuv.x*tuv.y));
  tuv *= Rot(radians((degree-0.5)*720.0 + 180.0));
  tuv.y *= ratio;

  float freq = 5.0, amp = 30.0, spd = time*2.0;
  tuv.x += sin(tuv.y*freq + spd)/amp;
  tuv.y += sin(tuv.x*freq*1.5 + spd)/(amp*0.5);

  // extract rgb from the vec4 uniforms:
  vec3 y = colorYellow.rgb;
  vec3 db = colorDeepBlue.rgb;
  vec3 r = colorRed.rgb;
  vec3 b = colorBlue.rgb;

  vec3 layer1 = mix(y, db, S(-0.3, 0.2, (tuv*Rot(radians(-5.0))).x));
  vec3 layer2 = mix(r,  b, S(-0.3, 0.6, (tuv*Rot(radians(-5.0))).x));
  vec3 comp   = mix(layer1, layer2, S(0.5, -0.3, tuv.y));

  float dist = 1.0 - length((uv - 0.5) * vec2(ratio,1.0));
  float fade = smoothstep(0.0,1.0,dist) * 1.2;
  comp *= fade;

  outColor = vec4(comp, 1.0);
}