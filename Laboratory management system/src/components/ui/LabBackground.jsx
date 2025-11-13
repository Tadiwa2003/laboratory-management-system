import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
  vec2  r  = iResolution.xy;
  float t  = iTime;
  vec3  FC = vec3(fragCoord, t);
  vec4  o  = vec4(0.0);

  vec3 s = normalize(FC.rgb * 2.1 - r.xyy), p, c = s;
  c /= max(1e-4, abs(c.y));
  c.z -= t;

  float z = 0.0, d = 1.0;
  for (float i = 0.0; i < 30.0; i++)
  {
    p = s * z;
    p.z -= t;
    float py = p.y;
    d = ++py;
    p.y = abs(mod(d - 2.0, 4.0) - 2.0);
    p += 0.03 * sin(c / 0.04) * abs(p.y - d);
    float dxz = abs(length(cos(p.xz)) - 0.4);
    float dy  = abs(cos(p.y + z));
    float stepLen = 0.6 * dxz + 0.1 * dy;
    z += stepLen;
    d  = max(stepLen, 1e-4);
    o.rgb += (1.1 - sin(p)) / d;
  }

  o = tanh(o / 400.0);
  fragColor = vec4(o.rgb, 1.0);
}

void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program) || 'Program link failed');
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

const LabBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
    if (!gl) {
      console.warn('WebGL2 not supported');
      return;
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = linkProgram(gl, vs, fs);
    if (!program) return;
    gl.useProgram(program);

    const uResolution = gl.getUniformLocation(program, 'iResolution');
    const uTime = gl.getUniformLocation(program, 'iTime');
    const uFrame = gl.getUniformLocation(program, 'iFrame');
    const uMouse = gl.getUniformLocation(program, 'iMouse');

    const mouse = { x: 0, y: 0, l: 0, r: 0 };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = rect.height - (event.clientY - rect.top);
    };
    const onDown = (event) => {
      if (event.button === 0) mouse.l = 1;
    };
    const onUp = (event) => {
      if (event.button === 0) mouse.l = 0;
    };
    const onContextMenu = (event) => event.preventDefault();

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('contextmenu', onContextMenu);

    let resizeObserver = null;
    const applySize = () => {
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(applySize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', applySize);
    }
    applySize();

    let animationFrame = 0;
    let start = performance.now();
    let frame = 0;

    const render = (now) => {
      const time = (now - start) / 1000;
      frame += 1;

      applySize();
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      if (uResolution) gl.uniform3f(uResolution, canvas.width, canvas.height, dpr);
      if (uTime) gl.uniform1f(uTime, time);
      if (uFrame) gl.uniform1i(uFrame, frame);
      if (uMouse) gl.uniform4f(uMouse, mouse.x, mouse.y, mouse.l, mouse.r);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('contextmenu', onContextMenu);
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (error) {
          console.warn('ResizeObserver disconnect error', error);
        }
      } else {
        window.removeEventListener('resize', applySize);
      }
      try { gl.deleteProgram(program); } catch (error) { console.warn(error); }
      try { gl.deleteShader(vs); } catch (error) { console.warn(error); }
      try { gl.deleteShader(fs); } catch (error) { console.warn(error); }
      try { gl.deleteBuffer(vbo); } catch (error) { console.warn(error); }
      try { gl.deleteVertexArray(vao); } catch (error) { console.warn(error); }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ display: 'block', background: 'black', pointerEvents: 'none' }}
    />
  );
};

export default LabBackground;
