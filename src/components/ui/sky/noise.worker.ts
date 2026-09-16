// Builds a tileable 3D noise volume for the volumetric clouds, off the main thread.
// R: Perlin-Worley (cloud body), G: Worley fbm (edge erosion detail).

const GRADIENTS = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
]

function hash(x: number, y: number, z: number, seed: number) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177) + Math.imul(seed, 1442695041)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

const wrap = (v: number, period: number) => ((v % period) + period) % period
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function perlin(x: number, y: number, z: number, period: number, seed: number) {
  x *= period
  y *= period
  z *= period
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz

  const corner = (dx: number, dy: number, dz: number) => {
    const g = GRADIENTS[Math.floor(hash(wrap(ix + dx, period), wrap(iy + dy, period), wrap(iz + dz, period), seed) * 12) % 12]
    return g[0] * (fx - dx) + g[1] * (fy - dy) + g[2] * (fz - dz)
  }

  const u = fade(fx)
  const v = fade(fy)
  const w = fade(fz)
  return lerp(
    lerp(lerp(corner(0, 0, 0), corner(1, 0, 0), u), lerp(corner(0, 1, 0), corner(1, 1, 0), u), v),
    lerp(lerp(corner(0, 0, 1), corner(1, 0, 1), u), lerp(corner(0, 1, 1), corner(1, 1, 1), u), v),
    w,
  )
}

function worley(x: number, y: number, z: number, cells: number, seed: number) {
  x *= cells
  y *= cells
  z *= cells
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz
  let nearest = 9

  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = wrap(ix + dx, cells)
        const cy = wrap(iy + dy, cells)
        const cz = wrap(iz + dz, cells)
        const px = dx + hash(cx, cy, cz, seed) - fx
        const py = dy + hash(cx, cy, cz, seed + 1) - fy
        const pz = dz + hash(cx, cy, cz, seed + 2) - fz
        const d = px * px + py * py + pz * pz
        if (d < nearest) nearest = d
      }
    }
  }
  return 1 - Math.min(Math.sqrt(nearest), 1)
}

function build(size: number) {
  const data = new Uint8Array(size * size * size * 2)
  let i = 0
  for (let z = 0; z < size; z++) {
    const nz = z / size
    for (let y = 0; y < size; y++) {
      const ny = y / size
      for (let x = 0; x < size; x++) {
        const nx = x / size
        const p = (perlin(nx, ny, nz, 4, 1) * 0.5 + perlin(nx, ny, nz, 8, 2) * 0.25 + perlin(nx, ny, nz, 16, 3) * 0.125) / 0.875
        const p01 = Math.min(Math.max(p * 0.75 + 0.5, 0), 1)
        const w = worley(nx, ny, nz, 4, 10) * 0.625 + worley(nx, ny, nz, 8, 20) * 0.25 + worley(nx, ny, nz, 16, 30) * 0.125
        const perlinWorley = Math.min(Math.max((p01 - (w - 1)) / (2 - w), 0), 1)
        const detail = worley(nx, ny, nz, 8, 40) * 0.625 + worley(nx, ny, nz, 16, 50) * 0.25 + worley(nx, ny, nz, 32, 60) * 0.125
        data[i++] = Math.round(perlinWorley * 255)
        data[i++] = Math.round(detail * 255)
      }
    }
  }
  return data
}

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<number>) => void) | null
  postMessage: (message: Uint8Array, transfer: Transferable[]) => void
}

scope.onmessage = (event) => {
  const data = build(event.data)
  scope.postMessage(data, [data.buffer])
}
