import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cn } from '../../utils/cn';

const fragmentShader = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_dot_size;
uniform float u_total_size;
uniform vec3 u_colors[4];
uniform float u_opacities[4];
uniform float u_reverse;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 coord = v_uv * u_resolution;
  coord.x -= mod(u_resolution.x, u_total_size) * 0.5;
  coord.y -= mod(u_resolution.y, u_total_size) * 0.5;

  vec2 gridPos = floor(coord / u_total_size);
  vec2 cell = fract(coord / u_total_size);

  float baseOpacity = step(cell.x, u_dot_size / u_total_size) * step(cell.y, u_dot_size / u_total_size);
  if (baseOpacity < 0.5) {
    fragColor = vec4(0.0);
    return;
  }

  float dist = length(gridPos);
  float t = u_time * 0.35;
  float noise = random(gridPos);

  float intro = smoothstep(noise * 1.2, noise * 1.2 + 0.4, t - dist * 0.12);
  float outro = 1.0 - smoothstep(noise * 1.2, noise * 1.2 + 0.4, t - dist * 0.12 - 2.0);
  float opacity = mix(intro, outro, u_reverse);

  float gradientIndex = clamp(dist / 12.0, 0.0, 1.0);
  int colorIndex = int(floor(gradientIndex * 3.0));
  colorIndex = clamp(colorIndex, 0, 3);

  vec3 color = u_colors[colorIndex];
  float opacityMix = mix(u_opacities[0], u_opacities[min(colorIndex + 1, 3)], gradientIndex);
  fragColor = vec4(color, opacity * opacityMix);
}
`;

const vertexShader = `#version 300 es
in vec3 position;
out vec2 v_uv;

void main() {
  v_uv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position, 1.0);
}
`;

const DotShaderPlane = ({ reverse }) => {
  const meshRef = useRef(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(size.width * 2, size.height * 2) },
    u_dot_size: { value: 3.6 },
    u_total_size: { value: 22.0 },
    u_colors: {
      value: [
        new THREE.Vector3(0.06, 0.32, 0.66),
        new THREE.Vector3(0.10, 0.45, 0.80),
        new THREE.Vector3(0.20, 0.58, 0.89),
        new THREE.Vector3(0.80, 0.92, 1.00),
      ],
    },
    u_opacities: { value: new Float32Array([0.12, 0.28, 0.45, 0.7]) },
    u_reverse: { value: reverse ? 1 : 0 },
  }), [size, reverse]);

  useEffect(() => {
    uniforms.u_resolution.value.set(size.width * 2, size.height * 2);
  }, [size, uniforms]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    uniforms.u_time.value = clock.getElapsedTime();
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms]
  );

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const SignInCanvasBackground = ({ className, reverse = false, showOverlay = true }) => {
  return (
    <div className={cn('absolute inset-0', className)}>
      <Canvas camera={{ position: [0, 0, 1], fov: 90 }}>
        <DotShaderPlane reverse={reverse} />
      </Canvas>
      {showOverlay && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#031225] via-[#041a34]/90 to-[#01060d]" />
      )}
    </div>
  );
};

export default SignInCanvasBackground;
