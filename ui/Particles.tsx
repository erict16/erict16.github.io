'use client';

import { useEffect, useRef } from 'react';

// One field of points for the whole page. In the hero the points build the
// Ragdoll cat from its icon; on scroll they drift apart as dust; at the foot of
// the page some of them gather into a turning sphere.

const VERT = `
precision highp float;
attribute vec3 aCat;
attribute vec3 aDust;
attribute vec4 aSphere;
attribute vec3 aColor;
attribute vec4 aRand;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec3 uCat;
uniform vec3 uSphere;
uniform float uA;
uniform float uB;
uniform vec3 uPointer;
uniform vec2 uTilt;
uniform float uScroll;
uniform float uCell;
varying vec3 vColor;
varying float vAlpha;

float ease(float t) { return t * t * (3.0 - 2.0 * t); }

void main() {
  float stagger = 0.7;
  float a = ease(clamp(uA * (1.0 + stagger) - aRand.x * stagger, 0.0, 1.0));
  float b = ease(clamp(uB * (1.0 + stagger) - aRand.y * stagger, 0.0, 1.0)) * aSphere.w;

  // dust: slow drift, deeper points move more with the scroll
  vec2 span = uRes + 160.0;
  vec2 dust = aDust.xy * span;
  dust.y -= uScroll * (0.06 + aDust.z * 0.4) + uTime * (2.0 + 10.0 * aDust.z);
  dust += vec2(
    sin(uTime * (0.11 + aRand.z * 0.2) + aRand.x * 6.283),
    cos(uTime * (0.09 + aRand.w * 0.2) + aRand.y * 6.283)
  ) * (12.0 + 30.0 * aDust.z);
  dust = mod(dust, span) - 80.0;

  // cat: a shallow relief that leans with the pointer
  vec3 c = aCat;
  c.z += sin(c.x * 9.0 - uTime * 1.2) * 0.012;
  c.xy += vec2(
    sin(uTime * 1.3 + aRand.x * 40.0),
    cos(uTime * 1.1 + aRand.y * 40.0)
  ) * 0.0015;
  float cx = c.x * cos(uTilt.x) + c.z * sin(uTilt.x);
  float cz = -c.x * sin(uTilt.x) + c.z * cos(uTilt.x);
  float cy = c.y * cos(uTilt.y) - cz * sin(uTilt.y);
  cz = c.y * sin(uTilt.y) + cz * cos(uTilt.y);
  vec2 cat = uCat.xy + vec2(cx, cy) / (1.0 - cz * 0.7) * uCat.z;

  // sphere
  float ang = uTime * 0.32;
  vec3 s = aSphere.xyz;
  s.xz = vec2(s.x * cos(ang) + s.z * sin(ang), -s.x * sin(ang) + s.z * cos(ang));
  s.yz = vec2(s.y * cos(0.4) - s.z * sin(0.4), s.y * sin(0.4) + s.z * cos(0.4));
  vec2 sph = uSphere.xy + s.xy * uSphere.z * (1.0 + s.z * 0.14);

  vec2 pos = mix(dust, cat, a);
  pos = mix(pos, sph, b);

  // a sideways swing while a point is on its way
  vec2 way = cat - dust;
  vec2 side = vec2(-way.y, way.x) / (length(way) + 0.001);
  pos += side * sin(3.14159 * a) * (aRand.z - 0.5) * 260.0;

  // the pointer pushes points away
  vec2 d = pos - uPointer.xy;
  float r = length(d);
  float reach = 92.0;
  float push = exp(-r * r / (reach * reach)) * uPointer.z;
  pos += d / (r + 0.001) * push * (24.0 + 70.0 * aRand.w) * (0.3 + 0.7 * max(a, b));

  float depth = s.z * 0.5 + 0.5;
  float size = mix(1.0 + 2.4 * aDust.z * aDust.z, uCell * (1.3 + 0.6 * aRand.w), a);
  size = mix(size, 1.4 + 1.8 * depth, b);
  gl_PointSize = max(1.0, size * uDpr);

  vec3 tint = mix(vec3(0.37, 0.70, 0.67), vec3(0.82, 0.63, 0.46), step(0.5, aRand.z));
  vec3 dustColor = mix(vec3(0.95, 0.91, 0.84), tint, step(0.6, aRand.w));
  float twinkle = 0.75 + 0.25 * sin(uTime * (0.6 + aRand.x) + aRand.y * 30.0);
  float dustAlpha = pow(aRand.y, 6.0) * 0.62 * twinkle;
  vColor = mix(dustColor, aColor, a);
  vColor = mix(vColor, vec3(0.93, 0.89, 0.82), b);
  vAlpha = mix(dustAlpha, 1.0, a);
  vAlpha = mix(vAlpha, 0.25 + 0.75 * depth, b);

  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.3, d));
}
`;

const SOURCE = '/static/home/cat.png';
const SPHERE_POINTS = 2600;
const LOOSE_POINTS = 5000;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function smooth(from: number, to: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

// small seeded generator, so the dust looks the same on every visit
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d_2b_79_f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function readPixels(img: HTMLImageElement) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return { data: ctx.getImageData(0, 0, width, height).data, height, width };
}

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const root = document.documentElement;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      root.classList.add('no-webgl');
      return;
    }

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const hover = window.matchMedia('(hover: hover)').matches;
    let dead = false;
    let raf = 0;

    const pointer = { on: 0, x: -9999, y: -9999 };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.on = 1;
    };
    const onLeave = () => {
      pointer.on = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onLeave, { passive: true });
    window.addEventListener('pointercancel', onLeave, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    const start = (img: HTMLImageElement) => {
      const { data, height, width } = readPixels(img);
      const random = seeded(7);
      const small = window.innerWidth < 720;
      const picked: number[] = [];
      for (let i = 0; i < width * height; i++) {
        if (data[i * 4 + 3] > 220 && (!small || random() < 0.5)) picked.push(i);
      }
      const formed = picked.length;
      const count = formed + (small ? LOOSE_POINTS / 2 : LOOSE_POINTS);
      const cat = new Float32Array(count * 3);
      const dust = new Float32Array(count * 3);
      const sphere = new Float32Array(count * 4);
      const color = new Float32Array(count * 3);
      const rand = new Float32Array(count * 4);
      const sphereShare = SPHERE_POINTS / formed;

      for (let n = 0; n < count; n++) {
        dust[n * 3] = random();
        dust[n * 3 + 1] = random();
        dust[n * 3 + 2] = random();
        for (let k = 0; k < 4; k++) rand[n * 4 + k] = random();
        if (n >= formed) {
          // loose dust: it never joins the cat, so the page is never empty
          rand[n * 4] = 9;
          rand[n * 4 + 1] = 0.55 + rand[n * 4 + 1] * 0.45;
          continue;
        }
        const i = picked[n];
        const px = i % width;
        const py = (i - px) / width;
        const r = data[i * 4] / 255;
        const g = data[i * 4 + 1] / 255;
        const b = data[i * 4 + 2] / 255;
        const x = (px + random() - 0.5 - width / 2) / width;
        const y = (py + random() - 0.5 - height / 2) / width;
        const dome = Math.max(0, 1 - (x * x + y * y * 1.6) * 5);
        cat[n * 3] = x;
        cat[n * 3 + 1] = y;
        cat[n * 3 + 2] =
          dome * 0.12 + (r + g + b - 1.5) * 0.012 + random() * 0.01;
        color[n * 3] = r;
        color[n * 3 + 1] = g;
        color[n * 3 + 2] = b;
        if (random() < sphereShare) {
          const z = random() * 2 - 1;
          const turn = random() * Math.PI * 2;
          const ring = Math.sqrt(1 - z * z);
          sphere[n * 4] = ring * Math.cos(turn);
          sphere[n * 4 + 1] = z;
          sphere[n * 4 + 2] = ring * Math.sin(turn);
          sphere[n * 4 + 3] = 1;
        }
      }

      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        root.classList.add('no-webgl');
        return;
      }
      gl.useProgram(program);

      const attribute = (name: string, array: Float32Array, size: number) => {
        const at = gl.getAttribLocation(program, name);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(at);
        gl.vertexAttribPointer(at, size, gl.FLOAT, false, 0, 0);
      };
      attribute('aCat', cat, 3);
      attribute('aDust', dust, 3);
      attribute('aSphere', sphere, 4);
      attribute('aColor', color, 3);
      attribute('aRand', rand, 4);

      const uniform = (name: string) => gl.getUniformLocation(program, name);
      const u = {
        a: uniform('uA'),
        b: uniform('uB'),
        cat: uniform('uCat'),
        cell: uniform('uCell'),
        dpr: uniform('uDpr'),
        pointer: uniform('uPointer'),
        res: uniform('uRes'),
        scroll: uniform('uScroll'),
        sphere: uniform('uSphere'),
        tilt: uniform('uTilt'),
        time: uniform('uTime'),
      };

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(15 / 255, 13 / 255, 11 / 255, 1);

      const catBox = document.querySelector<HTMLElement>('[data-cat]');
      const sphereBox = document.querySelector<HTMLElement>('[data-sphere]');
      const now = { a: reduce ? 1 : 0, b: 0, on: 0, tiltX: 0, tiltY: 0 };
      const at = { x: -9999, y: -9999 };
      let last = performance.now();
      const began = last;
      root.classList.add('fx-ready');

      const frame = (time: number) => {
        if (dead) return;
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (time - last) / 1000);
        last = time;
        const seconds = reduce ? 0 : (time - began) / 1000;

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (
          canvas.width !== Math.round(w * dpr) ||
          canvas.height !== Math.round(h * dpr)
        ) {
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          gl.viewport(0, 0, canvas.width, canvas.height);
        }

        const view = window.innerHeight;
        const scroll = window.scrollY;
        const catRect = catBox?.getBoundingClientRect();
        const sphereRect = sphereBox?.getBoundingClientRect();
        const wantA = 1 - smooth(0.08, 0.7, scroll / view);
        const wantB = sphereRect
          ? smooth(
              0.15,
              0.8,
              (view - sphereRect.top) / (sphereRect.height + view * 0.2),
            )
          : 0;
        const follow = reduce ? 1 : 1 - Math.exp(-dt * 2.4);
        now.a += (wantA - now.a) * follow;
        now.b += (wantB - now.b) * follow;

        const quick = 1 - Math.exp(-dt * 9);
        at.x += (pointer.x - at.x) * quick;
        at.y += (pointer.y - at.y) * quick;
        now.on +=
          ((reduce ? 0 : pointer.on) - now.on) * (1 - Math.exp(-dt * 5));
        const leanX = hover
          ? (pointer.x / w - 0.5) * 0.7
          : Math.sin(seconds * 0.5) * 0.22;
        const leanY = hover
          ? (pointer.y / h - 0.5) * -0.4
          : Math.cos(seconds * 0.4) * 0.08;
        const settle = 1 - Math.exp(-dt * 3);
        now.tiltX +=
          ((reduce || pointer.x < 0 ? 0 : leanX) - now.tiltX) * settle;
        now.tiltY +=
          ((reduce || pointer.y < 0 ? 0 : leanY) - now.tiltY) * settle;
        if (!hover && !reduce) {
          now.tiltX = leanX;
          now.tiltY = leanY;
        }

        gl.uniform2f(u.res, w, h);
        gl.uniform1f(u.dpr, dpr);
        gl.uniform1f(u.time, seconds);
        gl.uniform1f(u.a, now.a);
        gl.uniform1f(u.b, now.b);
        gl.uniform1f(u.scroll, scroll);
        gl.uniform2f(u.tilt, now.tiltX, now.tiltY);
        gl.uniform3f(u.pointer, at.x, at.y, now.on);
        if (catRect) {
          gl.uniform3f(
            u.cat,
            catRect.left + catRect.width / 2,
            catRect.top + catRect.height / 2,
            catRect.width,
          );
          gl.uniform1f(u.cell, (catRect.width / width) * (small ? 1.4 : 1));
        }
        if (sphereRect) {
          gl.uniform3f(
            u.sphere,
            sphereRect.left + sphereRect.width / 2,
            sphereRect.top + sphereRect.height / 2,
            sphereRect.width / 2,
          );
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, count);
      };
      raf = requestAnimationFrame(frame);
    };

    const img = new Image();
    img.addEventListener('load', () => {
      if (!dead) start(img);
    });
    img.addEventListener('error', () => root.classList.add('no-webgl'));
    img.src = SOURCE;

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onLeave);
      window.removeEventListener('pointercancel', onLeave);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return <canvas aria-hidden="true" className="fx-canvas" ref={ref} />;
}
