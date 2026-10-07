/**
 * Minimal full-screen fragment-shader runner shared by the threeui ports.
 * Pauses when off-screen or the tab is hidden, caps pixel ratio, tracks the pointer
 * on the window (so overlaid content does not block it) and slows to a crawl for
 * prefers-reduced-motion. If WebGL is unavailable the host's CSS background shows.
 */
import { useEffect, useRef } from 'react';

const VERTEX = 'attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log || 'Shader compile failed');
  }
  return shader;
}

/**
 * @param fragment  GLSL source. Receives u_res (vec2, px), u_time (float, s), u_mouse (vec2, -1..1 smoothed)
 *                  plus any uniforms returned by `uniforms()` (floats only).
 * @param uniforms  () => ({ name: number }) read every frame, so props can change live.
 */
export default function ShaderCanvas({ fragment, uniforms, className = '', style, maxDpr = 1.5, speed = 1, smoothing = 0.05 }) {
  const hostRef = useRef(null);
  const uniformsRef = useRef(uniforms);
  useEffect(() => { uniformsRef.current = uniforms; }, [uniforms]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s ease';
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return undefined;
    let program;
    let vs;
    let fs;
    try {
      vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
      fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (err) {
      console.warn('[ShaderCanvas]', err);
      return undefined;
    }
    host.appendChild(canvas);
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const extra = new Map();
    const uniformLoc = (name) => {
      if (!extra.has(name)) extra.set(name, gl.getUniformLocation(program, name));
      return extra.get(name);
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const rate = reduce ? 0.08 : speed;
    let tx = 0; let ty = 0; let mx = 0; let my = 0;
    let frame = 0; let visible = true; let clock = 0; let last = performance.now();

    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, r.width < 700 ? 1 : maxDpr);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const onPointer = (e) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
      ty = -(((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1);
    };
    const draw = (now) => {
      clock += Math.min(50, now - last) * 0.001 * rate;
      last = now;
      mx += (tx - mx) * smoothing;
      my += (ty - my) * smoothing;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, clock);
      gl.uniform2f(uMouse, mx, my);
      const u = uniformsRef.current?.() || {};
      Object.entries(u).forEach(([k, v]) => gl.uniform1f(uniformLoc(k), v));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now) => {
      draw(now);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => { if (visible && !document.hidden && !frame) { last = performance.now(); frame = requestAnimationFrame(loop); } };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; wake(); });
    ro.observe(host);
    io.observe(host);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', wake);
    resize();
    draw(performance.now());
    requestAnimationFrame(() => { canvas.style.opacity = '1'; });
    frame = requestAnimationFrame(loop);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', wake);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      canvas.remove();
    };
  }, [fragment, maxDpr, speed, smoothing]);

  return <div ref={hostRef} aria-hidden="true" className={className} style={style} />;
}
