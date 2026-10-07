/**
 * Ribbon Field — port of ThreeUI's "Ribbon Field" (Axiom) background by Meng To.
 * Source: https://github.com/MengTo/threeui (src/shaders/ribbon-field) — MIT License, © 2026 Meng To.
 * Changes: shared runner, monochrome palette to match the G Developments guidelines,
 * and a `side` uniform to mirror the halftone ribbons to the left or right.
 */
import { useCallback } from 'react';
import ShaderCanvas from './ShaderCanvas.jsx';

const FRAGMENT = `
        precision highp float;
        uniform vec2 u_res;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_side;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float ribbon(vec2 uv, float offset, float width, float phase) {
          float y = 0.55 + 0.20 * sin((uv.x * 2.15) + phase) + 0.045 * sin((uv.x * 7.0) - phase * 0.7);
          float d = abs(uv.y - y - offset);
          return exp(-(d * d) / width);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_res.xy;
          vec2 p = uv;
          p.x *= u_res.x / u_res.y;

          float t = u_time * 0.22;
          vec2 pointer = u_mouse * 0.5 + 0.5;
          float drift = (pointer.x - 0.5) * 0.06;

          float rightFade = mix(smoothstep(0.28, 0.72, uv.x), smoothstep(0.72, 0.28, uv.x), u_side);
          float centerDark = 1.0 - smoothstep(0.0, 0.88, distance(uv, vec2(0.18, 0.48)));

          float r1 = ribbon(vec2(uv.x + drift, uv.y), 0.03, 0.0065, t + 0.9);
          float r2 = ribbon(vec2(uv.x - drift * 0.7, uv.y), -0.23, 0.0085, t + 3.25);
          float r3 = ribbon(vec2(uv.x + drift * 0.4, uv.y), 0.25, 0.014, t + 1.85);

          float glow = r1 * 1.14 + r2 * 1.05 + r3 * 0.48;

          vec3 col = vec3(0.0);
          col += vec3(1.0) * r1 * 1.05;
          col += vec3(0.62) * r2 * 0.85;
          col += vec3(0.42) * r3 * 0.60;

          float bloom = exp(-pow(distance(uv, vec2(0.76, 0.40 + 0.035 * sin(t))), 2.0) / 0.050);
          bloom += exp(-pow(distance(uv, vec2(0.71, 0.75 + 0.025 * cos(t))), 2.0) / 0.030);
          col += vec3(0.85) * bloom * 0.30;

          vec2 grid = fract(gl_FragCoord.xy / 7.0) - 0.5;
          float dotShape = smoothstep(0.29, 0.11, length(grid));
          float noise = hash(floor(gl_FragCoord.xy / 7.0));
          float scan = 0.72 + 0.28 * sin((uv.x + uv.y) * 38.0 + u_time * 1.3);
          float dots = dotShape * (0.48 + 0.52 * noise) * scan;

          float micro = hash(gl_FragCoord.xy + u_time) * 0.035;
          float alpha = clamp((glow * 1.55 + bloom * 0.50) * dots * rightFade, 0.0, 1.0);
          alpha *= 1.0 - centerDark * 0.56;

          vec3 base = vec3(0.0);
          vec3 finalColor = mix(base, col, clamp(alpha * 1.55, 0.0, 1.0));
          finalColor += micro * rightFade;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

export default function RibbonField({ className = '', side = 0 }) {
  const uniforms = useCallback(() => ({ u_side: side }), [side]);
  return <ShaderCanvas fragment={FRAGMENT} uniforms={uniforms} className={className} maxDpr={2} smoothing={0.035} style={{ background: '#000' }} />;
}
