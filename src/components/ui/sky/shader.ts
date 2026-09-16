// fullscreen triangle straight from gl_VertexID: no buffers, no attributes
export const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID & 1) << 2), float((gl_VertexID & 2) << 1)) - 1.0;
  gl_Position = vec4(p, 0.0, 1.0);
}
`

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;       // backing-store pixels
uniform vec2 uCss;       // css pixels of the hero
uniform float uTime;
uniform vec3 uLook;      // day, dusk, night weights (sum to 1)
uniform vec2 uSun;       // css px, y up
uniform vec2 uMoon;      // css px, y up
uniform float uOrb;      // orb scale (smaller on phones)
uniform vec2 uPointer;   // -1..1
uniform float uScroll;   // 0..1 of the hero scrolled past
uniform vec4 uMeteor;    // head css px (xy, y up), heading angle, fade (<= 0: none)
uniform int uOctaves;
uniform float uIntro;    // 0..1 opening exposure
#ifdef VOLUMETRIC
uniform sampler2D uClouds;
#endif

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}

const mat2 ROT = mat2(0.8, 0.6, -0.6, 0.8);

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += a * noise(p);
    p = ROT * p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// domain-warped fbm reads as billowing cumulus rather than flat smoke
float cloudDensity(vec2 p, float t, float coverage, int octaves) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.012), 3), fbm(p + vec2(5.2, 1.3) - t * 0.01, 3));
  float d = fbm(p + 0.9 * q + vec2(t * 0.02, 0.0), octaves);
  // billowy erosion gives the puffed, rounded tops of cumulus instead of smoke
  float billow = 1.0 - abs(noise(p * 3.1 + q * 2.0 + t * 0.03) * 2.0 - 1.0);
  d += (billow - 0.5) * 0.08;
  return smoothstep(coverage, coverage + 0.22, d);
}

vec3 starLayer(vec2 p, float cell, float threshold, float t, float sizeMin, float sizeMax) {
  vec2 id = floor(p / cell);
  float h = hash12(id);
  if (h < threshold) return vec3(0.0);
  vec2 pos = (hash22(id * 1.37) * 0.8 + 0.1) * cell;
  float d = length(mod(p, cell) - pos);
  float size = mix(sizeMin, sizeMax, hash12(id + 7.1));
  float twinkle = 0.55 + 0.45 * sin(t * (0.8 + hash12(id + 3.0) * 2.6) + h * 40.0);
  float core = exp(-(d * d) / (size * size));
  vec3 tint = mix(vec3(0.72, 0.80, 1.0), vec3(1.0, 0.88, 0.76), hash12(id + 11.0));
  return tint * core * twinkle * (0.35 + 0.65 * (h - threshold) / (1.0 - threshold)) * 1.8;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 px = uv * uCss;
  float wDay = uLook.x;
  float wDusk = uLook.y;
  float wNight = uLook.z;
  float sunWeight = wDay + wDusk;
  float duskShare = wDusk / max(sunWeight, 1e-3);
  float t = uTime;

  // one camera for every layer; each layer moves by its depth
  vec2 cam = vec2(uPointer.x * -18.0, uPointer.y * 12.0 - uScroll * 90.0);

  // ---- atmosphere ----
  float h = clamp(uv.y, 0.0, 1.0);
  vec3 dayCol = mix(vec3(0.80, 0.87, 0.92), vec3(0.24, 0.49, 0.79), pow(h, 0.75));
  vec3 duskLow = mix(mix(vec3(0.55, 0.22, 0.30), vec3(1.0, 0.52, 0.30), smoothstep(0.7, 1.3, uCss.x / uCss.y)), vec3(0.42, 0.14, 0.32), smoothstep(0.0, 0.45, h));
  vec3 duskCol = mix(duskLow, vec3(0.05, 0.03, 0.13), smoothstep(0.45, 1.0, h));
  vec3 nightCol = mix(vec3(0.035, 0.05, 0.13), vec3(0.004, 0.008, 0.03), pow(h, 0.6));
  vec3 col = dayCol * wDay + duskCol * wDusk + nightCol * wNight;

  vec2 sunPx = uSun + cam * 0.45;
  vec2 moonPx = uMoon + cam * 0.45;
  float sunDist = length(px - sunPx);
  float moonDist = length(px - moonPx);
  float sunR = 50.0 * uOrb * mix(1.0, 1.5, duskShare);
  vec3 sunTint = mix(vec3(1.0, 0.94, 0.80), vec3(1.0, 0.56, 0.30), duskShare);

  // broad forward scattering around the sun, and the dusk horizon burn
  // on portrait screens the copy spans the full width, so the wide glows are held back behind it
  float wide = mix(0.3, 1.0, smoothstep(0.7, 1.3, uCss.x / uCss.y));
  col += sunTint * (wDay * (exp(-sunDist / (sunR * 5.0)) * 0.3 + exp(-sunDist / (sunR * 14.0)) * 0.12 * wide)
                  + wDusk * (exp(-sunDist / (sunR * 6.0)) * 0.42 + exp(-sunDist / (sunR * 16.0)) * 0.22 * wide));
  col += vec3(1.0, 0.42, 0.22) * wDusk * wide * exp(-uv.y * 3.4) * (0.1 + 0.9 * exp(-abs(px.x - sunPx.x) / (uCss.x * 0.3)));

  // ---- night sky: stars and a faint milky way ----
  float starVis = wNight + wDusk * 0.3 * smoothstep(0.5, 0.95, uv.y);
  if (starVis > 0.002) {
    vec2 sp = px - cam * 0.15;
    vec2 band = sp / uCss.y - vec2(0.2, 0.15);
    float across = dot(band, normalize(vec2(-0.55, 1.0)));
    float milky = exp(-across * across * 14.0) * fbm(sp / 140.0 + 4.0, 4);
    vec3 stars = starLayer(sp, 22.0, 0.84, t, 0.55, 1.1)
               + starLayer(sp + 11.0, 70.0, 0.78, t * 0.7, 1.0, 1.9)
               + starLayer(sp + 5.0, 9.0, 0.9, t * 1.3, 0.35, 0.7) * smoothstep(0.25, 0.7, milky) * 1.4;
    col += stars * starVis;
    col += vec3(0.32, 0.30, 0.55) * pow(milky, 1.6) * 0.16 * wNight;
  }

  // ---- meteor ----
  if (uMeteor.w > 0.0) {
    vec2 dir = vec2(cos(uMeteor.z), sin(uMeteor.z));
    vec2 rel = px - uMeteor.xy;
    float along = dot(rel, -dir);
    float side = dot(rel, vec2(-dir.y, dir.x));
    float trail = step(0.0, along) * (1.0 - smoothstep(0.0, 150.0, along));
    col += vec3(0.88, 0.93, 1.0) * trail * exp(-side * side / 1.6) * uMeteor.w * 1.5;
  }

  // ---- sun disk ----
  // a low sun is seen through more air: softer limb and a deeper orange
  float limb = mix(1.5, 6.0, duskShare);
  float sunDisk = 1.0 - smoothstep(sunR - limb, sunR + limb * 0.6, sunDist);
  vec3 sunDiskCol = mix(vec3(1.0, 0.99, 0.94), vec3(1.0, 0.58, 0.34), duskShare);
  sunDiskCol *= 1.0 - 0.12 * smoothstep(0.3, 1.0, sunDist / sunR) * duskShare;
  // max(), not a plain mix: the disk must never read darker than the glow already built up around it
  col = mix(col, max(col, sunDiskCol * 1.15), sunDisk * sunWeight);
  col += sunTint * sunWeight * exp(-sunDist / (sunR * 1.1)) * 0.55;

  // ---- moon: sphere-shaded with maria and craters ----
  float moonR = 42.0 * uOrb;
  float moonMask = 1.0 - smoothstep(moonR - 2.0, moonR + 1.5, moonDist);
  col += vec3(0.72, 0.80, 1.0) * wNight * (exp(-moonDist / (moonR * 1.4)) * 0.28 + exp(-moonDist / (moonR * 7.0)) * 0.1) * (1.0 - moonMask);
  if (wNight > 0.002 && moonDist < moonR + 2.0) {
    vec2 m = (px - moonPx) / moonR;
    float r2 = dot(m, m);
    vec3 n = vec3(m, sqrt(max(0.0, 1.0 - r2)));
    float lambert = clamp(dot(n, normalize(vec3(-0.8, 0.35, 0.42))), 0.0, 1.0);
    float maria = smoothstep(0.42, 0.72, fbm(m * 2.1 + 3.0, 4));
    float craters = smoothstep(0.66, 0.74, noise(m * 9.0)) * 0.12 + smoothstep(0.7, 0.78, noise(m * 19.0 + 7.0)) * 0.08;
    vec3 albedo = vec3(0.94, 0.95, 0.98) * (1.0 - maria * 0.24 - craters);
    vec3 moonCol = albedo * (pow(lambert, 0.75) * 1.08 + 0.04);
    col = mix(col, moonCol, moonMask * wNight);
  }

#ifdef VOLUMETRIC
  // clouds were raymarched at reduced resolution: rgb is in-scattered light, a is transmittance
  vec4 clouds = texture(uClouds, uv);
  col = col * clouds.a + clouds.rgb;
  float near = 1.0 - clouds.a;
#else
  // ---- clouds: far deck, then a near deck lit from the sun or moon ----
  vec3 litCol = vec3(1.0) * wDay + vec3(1.0, 0.64, 0.44) * wDusk + vec3(0.50, 0.55, 0.68) * wNight;
  vec3 shadeCol = vec3(0.66, 0.73, 0.85) * wDay + vec3(0.28, 0.12, 0.26) * wDusk + vec3(0.04, 0.05, 0.09) * wNight;
  float coverage = 0.48 * wDay + 0.5 * wDusk + 0.6 * wNight;
  float deckTop = 1.02;
  float deckLow = mix(0.22, 0.08, wDusk);
  float bandMask = smoothstep(deckLow, deckLow + 0.3, uv.y) * (1.0 - smoothstep(0.92, deckTop, uv.y));
  // keep the sun's disk readable: the deck thins out around it rather than burying it
  bandMask *= mix(1.0, smoothstep(sunR * 1.3, sunR * 5.5, sunDist), 0.85 * sunWeight);

  vec2 lightPx = mix(moonPx, sunPx, sunWeight);

  // sampling at px - offset moves the pattern by +offset, matching how the orbs shift
  vec2 farP = (px - cam * 0.7) / vec2(560.0, 300.0);
  float far = cloudDensity(farP, t * 0.6, coverage + 0.04, max(uOctaves - 1, 3)) * bandMask;
  vec3 farCol = mix(shadeCol, litCol, 0.62);
  col = mix(col, farCol, far * (0.55 * wDay + 0.5 * wDusk + 0.35 * wNight));

  vec2 nearP = (px - cam * 1.4) / vec2(460.0, 270.0) + vec2(3.7, 1.9);
  float near = cloudDensity(nearP, t, coverage, uOctaves) * bandMask;
  if (near > 0.002) {
    vec2 toLight = normalize(lightPx - px) / vec2(460.0, 270.0);
    float occ1 = cloudDensity(nearP + toLight * 26.0, t, coverage, 3);
    float occ2 = cloudDensity(nearP + toLight * 64.0, t, coverage, 3);
    float light = exp(-(occ1 * 1.4 + occ2 * 0.9));
    float rim = pow(1.0 - near, 3.0) * near * 4.0 * exp(-length(lightPx - px) / 380.0);
    vec3 cloudCol = mix(shadeCol, litCol, light) + sunTint * rim * sunWeight * 0.9 + vec3(0.8, 0.86, 1.0) * rim * wNight * 0.4;
    col = mix(col, cloudCol, near * (0.94 * wDay + 0.9 * wDusk + 0.78 * wNight));
  }
#endif

  // ---- crepuscular rays through the gaps ----
  if (sunWeight > 0.01) {
    vec2 d = px - sunPx;
    float angle = atan(d.y, d.x);
    float rays = smoothstep(0.5, 1.0, noise(vec2(angle * 11.0, t * 0.04))) * smoothstep(0.35, 1.0, noise(vec2(angle * 27.0 + 3.0, t * 0.03)));
    float reach = exp(-sunDist / 560.0) * smoothstep(sunR * 1.2, sunR * 3.0, sunDist);
    col += sunTint * rays * reach * (1.0 - near * 0.7) * (0.1 * wDay + 0.3 * wDusk);
  }

  // intro: the sky opens from a dim exposure, like a camera iris
  col *= mix(0.3, 1.0, uIntro);

  // dither to kill banding in the wide gradients
  col += (hash12(gl_FragCoord.xy + fract(t) * 91.0) - 0.5) / 255.0 * 2.0;

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

export const COMPOSITE_FRAGMENT_SHADER = FRAGMENT_SHADER.replace('#version 300 es', '#version 300 es\n#define VOLUMETRIC')

// Volumetric cloud pass: raymarches a cumulus slab through a 3D Perlin-Worley volume with
// Beer-Lambert extinction, a dual-lobe Henyey-Greenstein phase, powder darkening and a cheap
// multiple-scattering term. Rendered at reduced resolution, jittered per frame and blended with
// the previous frame, so few steps still converge to smooth clouds.
export const CLOUD_FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp sampler3D;
out vec4 outColor;

uniform vec2 uRes;
uniform vec2 uCss;
uniform float uTime;
uniform vec3 uLook;
uniform vec2 uSun;
uniform vec2 uMoon;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uIntro;
uniform int uFrame;
uniform float uBlend;
uniform int uSteps;
uniform sampler3D uNoise;
uniform sampler2D uHistory;

const float H0 = 1.6;
const float H1 = 3.2;
const float FAR = 70.0;
const float TAN_HALF_FOV = 0.62;
const float PI4 = 12.566371;

float remap(float v, float l0, float h0, float l1, float h1) {
  return l1 + (v - l0) * (h1 - l1) / (h0 - l0);
}

// interleaved gradient noise: a cheap blue-noise-like jitter that hides step banding
float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (PI4 * pow(1.0 + g2 - 2.0 * g * c, 1.5));
}

vec3 rayDir(vec2 cssPx) {
  vec2 ndc = cssPx / uCss * 2.0 - 1.0;
  float aspect = uCss.x / uCss.y;
  // the horizon sits low in the frame, so clouds recede into perspective instead of looming overhead
  float pitch = 0.36 + uPointer.y * 0.02 + uScroll * 0.1 - (1.0 - uIntro) * 0.1;
  float yaw = uPointer.x * -0.03;
  vec3 d = normalize(vec3(ndc.x * aspect * TAN_HALF_FOV, ndc.y * TAN_HALF_FOV + pitch, 1.0));
  float c = cos(yaw);
  float s = sin(yaw);
  return vec3(c * d.x + s * d.z, d.y, -s * d.x + c * d.z);
}

float density(vec3 p, float coverage, bool detailed) {
  float hf = (p.y - H0) / (H1 - H0);
  if (hf <= 0.0 || hf >= 1.0) return 0.0;
  vec3 q = p + vec3(uTime * 0.06, 0.0, uTime * 0.025);
  float weather = texture(uNoise, vec3(q.xz * 0.035, 0.37)).r;
  float base = texture(uNoise, q * 0.13).r;
  // cumulus profile: flat, dense bases and rounded tops that thin out
  float profile = smoothstep(0.0, 0.1, hf) * smoothstep(1.0, 0.4, hf);
  float cov = clamp(coverage * (0.3 + weather * 0.95), 0.0, 0.9);
  float d = remap(base * profile, 1.0 - cov, 1.0, 0.0, 1.0);
  if (d <= 0.0) return 0.0;
  if (detailed) {
    float detail = texture(uNoise, q * 0.55 + vec3(0.0, uTime * 0.015, 0.0)).g;
    d = remap(d, detail * mix(0.36, 0.16, hf), 1.0, 0.0, 1.0);
  }
  return clamp(d, 0.0, 1.0);
}

void main() {
  vec2 cssPx = gl_FragCoord.xy / uRes * uCss;
  float wDay = uLook.x;
  float wDusk = uLook.y;
  float wNight = uLook.z;
  float sunWeight = wDay + wDusk;
  vec2 cam = vec2(uPointer.x * -18.0, uPointer.y * 12.0 - uScroll * 90.0);

  vec3 rd = rayDir(cssPx);
  vec4 result = vec4(0.0, 0.0, 0.0, 1.0);

  if (rd.y > 0.015) {
    vec3 sunDir = rayDir(uSun + cam * 0.45);
    vec3 moonDir = rayDir(uMoon + cam * 0.45);
    vec3 lightDir = normalize(mix(moonDir, sunDir, sunWeight));

    vec3 lightCol = vec3(1.0, 0.96, 0.9) * 1.55 * wDay + vec3(1.0, 0.5, 0.24) * 1.45 * wDusk + vec3(0.62, 0.7, 0.92) * 0.32 * wNight;
    vec3 ambTop = vec3(0.50, 0.62, 0.80) * wDay + vec3(0.34, 0.17, 0.32) * wDusk + vec3(0.03, 0.04, 0.08) * wNight;
    vec3 ambBase = vec3(0.30, 0.36, 0.47) * wDay + vec3(0.17, 0.07, 0.15) * wDusk + vec3(0.012, 0.016, 0.035) * wNight;
    vec3 haze = vec3(0.74, 0.83, 0.92) * wDay + vec3(0.86, 0.42, 0.34) * wDusk + vec3(0.035, 0.045, 0.1) * wNight;

    float coverage = 0.5 * wDay + 0.54 * wDusk + 0.44 * wNight;
    // a thinner deck right around the sun and moon keeps their disks readable
    coverage *= 1.0 - 0.6 * smoothstep(0.965, 0.995, dot(rd, sunDir)) * sunWeight;
    coverage *= 1.0 - 0.6 * smoothstep(0.975, 0.997, dot(rd, moonDir)) * wNight;

    float tStart = H0 / rd.y;
    float tEnd = min(H1 / rd.y, FAR);
    if (tStart < FAR) {
      float stepLen = (tEnd - tStart) / float(uSteps);
      float t = tStart + stepLen * ign(gl_FragCoord.xy + 5.588238 * float(uFrame % 64));
      float cosTheta = dot(rd, lightDir);
      // capped so the forward-scattering lobe gives a silver lining, not a blown-out wash toward the sun
      float phase = min(mix(hg(cosTheta, 0.55), hg(cosTheta, -0.2), 0.3) * PI4, 2.6);
      vec3 scattered = vec3(0.0);
      float transmittance = 1.0;
      float firstHit = -1.0;

      for (int i = 0; i < 48; i++) {
        if (i >= uSteps) break;
        vec3 p = rd * t;
        float d = density(p, coverage, true);
        if (d > 0.004) {
          if (firstHit < 0.0) firstHit = t;

          float opticalDepth = 0.0;
          vec3 lp = p;
          float lightStep = 0.16;
          for (int j = 0; j < 4; j++) {
            lp += lightDir * lightStep;
            opticalDepth += density(lp, coverage, false) * lightStep;
            lightStep *= 1.7;
          }

          float hf = (p.y - H0) / (H1 - H0);
          float beer = exp(-opticalDepth * 4.2);
          float powder = 1.0 - exp(-opticalDepth * 6.0 - d * 1.5);
          vec3 luminance = lightCol * beer * mix(1.0, powder * 1.6, 0.45) * phase
                         + lightCol * exp(-opticalDepth * 1.1) * 0.08
                         + mix(ambBase, ambTop, hf * hf);

          float sigma = d * 3.4;
          float stepTransmittance = exp(-sigma * stepLen);
          scattered += transmittance * (1.0 - stepTransmittance) * luminance;
          transmittance *= stepTransmittance;
          if (transmittance < 0.02) break;
        }
        t += stepLen;
      }

      if (firstHit > 0.0) {
        // aerial perspective: far clouds melt into the horizon haze
        float fog = 1.0 - exp(-firstHit * 0.028);
        scattered = mix(scattered, haze * (1.0 - transmittance), fog);
        transmittance = mix(transmittance, 1.0, fog * 0.7);
      }

      scattered = 1.0 - exp(-scattered * 0.95);
      // the deck thins into haze near the horizon instead of ending on a hard line
      float horizon = smoothstep(0.015, 0.16, rd.y);
      result = vec4(scattered * horizon, mix(1.0, transmittance, horizon));
    }
  }

  vec4 history = texture(uHistory, gl_FragCoord.xy / uRes);
  outColor = mix(history, result, uBlend);
}
`
