import { Renderer, Program, Mesh, Triangle } from 'ogl';

const hexToRgb = (hex: string): number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

interface GrainientOptions {
  timeSpeed?: number;
  colorBalance?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  contrast?: number;
  gamma?: number;
  saturation?: number;
  centerX?: number;
  centerY?: number;
  zoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  color5?: string;
  color6?: string;
  color7?: string;
  color8?: string;
}

export class Grainient {
  private container: HTMLElement;
  private renderer: any;
  private canvas: HTMLCanvasElement;
  private raf: number = 0;
  private ro: ResizeObserver | null = null;
  private program: any;
  private colorSets: Array<[string, string, string]>;
  private nextSetIndex: number = 1;
  private transitionDuration: number = 7990; // ~8 seconds per palette (10ms faster)
  private fadeDuration: number = 4000; // 4 seconds fade
  private lastTransitionTime: number = 0;
  private currentColors: [Float32Array, Float32Array, Float32Array];
  private targetColors: [Float32Array, Float32Array, Float32Array];

  constructor(container: HTMLElement, options: GrainientOptions = {}) {
    this.container = container;

    // Define color palette sets (black -> grey -> darker accent colors)
    this.colorSets = [
      ['#000000', '#4a4a4a', '#008fb3'], // darker cyan
      ['#000000', '#4a4a4a', '#b34780'], // darker pink
      ['#000000', '#4a4a4a', '#cc7a00'], // darker orange
      ['#000000', '#4a4a4a', '#cccc00'], // darker yellow
    ];

    // Initialize current and target colors
    this.currentColors = [
      new Float32Array(hexToRgb(this.colorSets[0][0])),
      new Float32Array(hexToRgb(this.colorSets[0][1])),
      new Float32Array(hexToRgb(this.colorSets[0][2])),
    ];
    
    this.targetColors = [
      new Float32Array(hexToRgb(this.colorSets[1][0])),
      new Float32Array(hexToRgb(this.colorSets[1][1])),
      new Float32Array(hexToRgb(this.colorSets[1][2])),
    ];

    const {
      timeSpeed = 0.25,
      colorBalance = 0.0,
      warpStrength = 1.0,
      warpFrequency = 5.0,
      warpSpeed = 2.0,
      warpAmplitude = 50.0,
      blendAngle = 0.0,
      blendSoftness = 0.05,
      rotationAmount = 500.0,
      noiseScale = 2.0,
      grainAmount = 0.1,
      grainScale = 2.0,
      grainAnimated = false,
      contrast = 1.5,
      gamma = 1.0,
      saturation = 1.0,
      centerX = 0.0,
      centerY = 0.0,
      zoom = 0.9,
    } = options;

    this.renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = this.renderer.gl;
    this.canvas = gl.canvas;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '0';
    this.canvas.style.pointerEvents = 'none';

    // Insert canvas as first child so it's behind content
    this.container.insertBefore(this.canvas, this.container.firstChild);

    const geometry = new Triangle(gl);
    this.program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: timeSpeed },
        uColorBalance: { value: colorBalance },
        uWarpStrength: { value: warpStrength },
        uWarpFrequency: { value: warpFrequency },
        uWarpSpeed: { value: warpSpeed },
        uWarpAmplitude: { value: warpAmplitude },
        uBlendAngle: { value: blendAngle },
        uBlendSoftness: { value: blendSoftness },
        uRotationAmount: { value: rotationAmount },
        uNoiseScale: { value: noiseScale },
        uGrainAmount: { value: grainAmount },
        uGrainScale: { value: grainScale },
        uGrainAnimated: { value: grainAnimated ? 1.0 : 0.0 },
        uContrast: { value: contrast },
        uGamma: { value: gamma },
        uSaturation: { value: saturation },
        uCenterOffset: { value: new Float32Array([centerX, centerY]) },
        uZoom: { value: zoom },
        uColor1: { value: this.currentColors[0] },
        uColor2: { value: this.currentColors[1] },
        uColor3: { value: this.currentColors[2] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program: this.program });

    const setSize = () => {
      const rect = this.container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      this.renderer.setSize(width, height);
      const res = this.program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    this.ro = new ResizeObserver(setSize);
    this.ro.observe(this.container);
    setSize();

    const t0 = performance.now();
    this.lastTransitionTime = t0;
    
    const loop = (t: number) => {
      this.program.uniforms.iTime.value = (t - t0) * 0.001;
      
      const timeSinceTransition = t - this.lastTransitionTime;
      
      // Check if we're in fade period
      if (timeSinceTransition < this.fadeDuration) {
        // Smooth fade using easing function
        const progress = timeSinceTransition / this.fadeDuration;
        const eased = progress * progress * (3 - 2 * progress); // smoothstep
        
        // Interpolate between current and target colors
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.currentColors[i][j] = 
              this.currentColors[i][j] * (1 - eased) + 
              this.targetColors[i][j] * eased;
          }
        }
        
        // Update uniforms
        this.program.uniforms.uColor1.value = this.currentColors[0];
        this.program.uniforms.uColor2.value = this.currentColors[1];
        this.program.uniforms.uColor3.value = this.currentColors[2];
      }
      
      // Check if it's time to start next transition
      if (timeSinceTransition > this.transitionDuration) {
        // Move to next palette
        this.currentSetIndex = this.nextSetIndex;
        this.nextSetIndex = (this.nextSetIndex + 1) % this.colorSets.length;
        
        // Set current colors to target
        for (let i = 0; i < 3; i++) {
          this.currentColors[i] = new Float32Array(this.targetColors[i]);
        }
        
        // Set new target colors
        const nextSet = this.colorSets[this.nextSetIndex];
        this.targetColors = [
          new Float32Array(hexToRgb(nextSet[0])),
          new Float32Array(hexToRgb(nextSet[1])),
          new Float32Array(hexToRgb(nextSet[2])),
        ];
        
        this.lastTransitionTime = t;
      }
      
      this.renderer.render({ scene: mesh });
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    if (this.ro) {
      this.ro.disconnect();
    }
    try {
      this.container.removeChild(this.canvas);
    } catch {
      // Ignore
    }
  }
}

