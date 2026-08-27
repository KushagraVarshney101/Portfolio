/**
 * GLSL for the hero scene. Kept apart from the components so the shaders can be
 * compiled and inspected on their own.
 */

/**
 * Shared displacement used by the core body and its wireframe shell, so the two
 * deform in lockstep and the edges stay welded to the faces.
 */
export const CORE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vWobble;

  // Cheap, smooth, organic displacement — layered sines instead of noise
  // so the surface breathes without ever reading as a repeating pattern.
  float wobble(vec3 p, float t) {
    float a = sin(p.x * 2.1 + t * 0.62) * sin(p.y * 1.7 - t * 0.48);
    float b = sin(p.y * 2.9 - t * 0.37) * sin(p.z * 2.3 + t * 0.53);
    float c = sin(p.z * 1.6 + t * 0.44) * sin(p.x * 2.6 - t * 0.31);
    return (a + b + c) / 3.0;
  }

  void main() {
    vec3 n = normalize(normal);
    float w = wobble(position, uTime);
    vec3 pos = position + n * w * uAmp;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormalV = normalize(normalMatrix * n);
    vViewDir = normalize(-mv.xyz);
    vWobble = w;
    gl_Position = projectionMatrix * mv;
  }
`;

/**
 * The core body. Deliberately near-black across the facets with the colour
 * pushed entirely into the fresnel rim: a solid object catching light, rather
 * than the flat saturated ball that additive blending produces.
 */
export const CORE_FRAG = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uDeep;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vWobble;

  void main() {
    // 0 facing the camera, 1 at the silhouette.
    float f = 1.0 - clamp(dot(normalize(vNormalV), normalize(vViewDir)), 0.0, 1.0);

    vec3 col = mix(uDeep * 0.55, uDeep, 0.5 + vWobble * 0.5);
    col += uRim * pow(f, 3.0) * 1.35;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Glowing edges over the core. Brightest where the surface turns away. */
export const WIRE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vWobble;

  void main() {
    float f = 1.0 - clamp(dot(normalize(vNormalV), normalize(vViewDir)), 0.0, 1.0);
    float a = (0.06 + pow(f, 2.0) * 1.05) * uStrength;
    gl_FragColor = vec4(uColor * (0.85 + vWobble * 0.3), a);
  }
`;

/**
 * Drifting particle field. One draw call for the whole field: the per-point
 * drift, twinkle and depth fade all happen on the GPU, driven by two
 * per-particle attributes.
 */
export const PARTICLE_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // Each particle drifts on its own phase so the field never pulses in unison.
    p.y += sin(uTime * 0.25 + aPhase) * 0.14;
    p.x += cos(uTime * 0.19 + aPhase * 1.3) * 0.11;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (14.0 / max(0.001, -mv.z));

    float twinkle = 0.55 + 0.45 * sin(uTime * 0.8 + aPhase * 2.1);
    // Fade out both the far field and anything drifting into the camera's lap.
    float depth = smoothstep(18.0, 4.0, -mv.z) * smoothstep(0.4, 2.0, -mv.z);
    vAlpha = twinkle * depth;
  }
`;

export const PARTICLE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = pow(max(0.0, 1.0 - d), 2.0) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * Receding floor grid. Lines are derived in the fragment shader and antialiased
 * with fwidth, so they stay one pixel wide at every distance instead of
 * shimmering the way a textured plane would.
 */
export const GRID_VERT = /* glsl */ `
  varying vec3 vLocal;

  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const GRID_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uSpacing;
  uniform float uStrength;
  varying vec3 vLocal;

  float line(float v, float w) {
    float g = abs(fract(v - 0.5) - 0.5) / max(w, 1e-4);
    return 1.0 - min(g, 1.0);
  }

  void main() {
    // Drift the grid toward the viewer so the scene has a sense of travel.
    vec2 uv = vec2(vLocal.x, vLocal.y + uTime * 0.35) / uSpacing;
    vec2 w = fwidth(uv);

    float g = max(line(uv.x, w.x), line(uv.y, w.y));

    // Fade with distance from the centre so the plane has no visible edge.
    float r = length(vLocal.xy);
    float fade = smoothstep(26.0, 4.0, r);

    float a = g * fade * uStrength;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;
