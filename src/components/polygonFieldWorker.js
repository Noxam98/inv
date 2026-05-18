/* eslint-disable no-restricted-globals */

function ambientValue(mode, v, t, w, h) {
  switch (mode) {
    case 'chain': {
      const phase = v.bx * 0.04 - t * 0.0018;
      return Math.max(0, Math.sin(phase));
    }
    case 'vault': {
      const cx = w / 2;
      const cy = h / 2;
      const d = Math.hypot(v.bx - cx, v.by - cy);
      const phase = d * 0.08 - t * 0.0022;
      return Math.max(0, Math.sin(phase));
    }
    case 'flow': {
      const s1 = Math.sin((v.bx - v.by) * 0.05 - t * 0.0032);
      const s2 = Math.sin((v.bx + v.by) * 0.05 + t * 0.0032);
      return Math.max(0, Math.max(s1, s2));
    }
    case 'mesh': {
      const period = 1200 + (v.seed * 180) % 600;
      const localT = (t + v.seed * period * 7) % period;
      const n = localT / period;
      const sparkle = n < 0.2 ? Math.sin((n / 0.2) * Math.PI) : 0;

      const cycle = 2800;
      const ringT = (t % cycle) / cycle;
      const originSeed = Math.floor(t / cycle);
      const ox = 0.5 + 0.45 * Math.sin(originSeed * 1.37);
      const oy = 0.5 + 0.45 * Math.cos(originSeed * 2.11);
      const cx = ox * w;
      const cy = oy * h;
      const d = Math.hypot(v.bx - cx, v.by - cy);
      const ringRadius = ringT * Math.max(w, h) * 1.4;
      const ringWidth = 36;
      const ring = Math.max(0, 1 - Math.abs(d - ringRadius) / ringWidth);
      const ringFade = ringT < 0.85 ? 1 : 1 - (ringT - 0.85) / 0.15;

      return Math.max(sparkle * 0.85, ring * ringFade * 0.9);
    }
    case 'split': {
      const edge = w / 2;
      if (v.bx < edge) {
        const slow = 0.5 + 0.5 * Math.sin(v.by * 0.04 - t * 0.0008);
        return slow * 0.18;
      }
      const phase = v.by * 0.07 - t * 0.0028;
      return Math.max(0, Math.sin(phase));
    }
    default:
      return 0;
  }
}

let canvas = null;
let ctx = null;
let mode = 'chain';
let state = null;
let raf = 0;
let running = false;

function rebuild(w, h, dpr) {
  state.w = w;
  state.h = h;
  state.dpr = dpr;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const step = 22;
  const cols = Math.ceil(w / step) + 1;
  const rows = Math.ceil(h / step) + 1;
  state.cols = cols;
  state.rows = rows;

  const verts = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const jitterX = (i === 0 || i === cols - 1) ? 0 : (Math.random() - 0.5) * step * 0.35;
      const jitterY = (j === 0 || j === rows - 1) ? 0 : (Math.random() - 0.5) * step * 0.35;
      const bx = i * step - step / 2 + jitterX;
      const by = j * step - step / 2 + jitterY;
      verts.push({
        bx, by,
        x: bx, y: by,
        vx: 0, vy: 0,
        seed: Math.random() * Math.PI * 2,
      });
    }
  }
  state.verts = verts;

  const tris = [];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      if ((i + j) % 2 === 0) {
        tris.push([a, b, d]);
        tris.push([a, d, c]);
      } else {
        tris.push([a, b, c]);
        tris.push([b, d, c]);
      }
    }
  }
  state.triangles = tris;
}

function loop(t) {
  if (!state || !running) {
    raf = 0;
    return;
  }
  state.hoverT += state.mouse.active ? 0.08 : -0.05;
  if (state.hoverT < 0) state.hoverT = 0;
  if (state.hoverT > 1) state.hoverT = 1;

  ctx.clearRect(0, 0, state.w, state.h);

  const mx = state.mouse.x;
  const my = state.mouse.y;
  const speed = Math.min(Math.hypot(state.mouse.vx, state.mouse.vy) * 0.1, 1);
  const R = 420;
  const DEAD = 22;

  for (const v of state.verts) {
    const dx = mx - v.bx;
    const dy = my - v.by;
    const d = Math.hypot(dx, dy);

    let tx = v.bx;
    let ty = v.by;
    if (state.mouse.active && d < R) {
      const far = 1 - d / R;
      const nearMask = Math.min(d / DEAD, 1);
      const nearEase = nearMask * nearMask * (3 - 2 * nearMask);
      const strength = far * nearEase * 6 * (0.7 + speed * 0.5);
      const dEff = Math.max(d, 1);
      tx = v.bx - (dx / dEff) * strength;
      ty = v.by - (dy / dEff) * strength;
    }

    v.x += (tx - v.x) * 0.12;
    v.y += (ty - v.y) * 0.12;
  }

  const prox = new Array(state.verts.length);
  const amb = new Array(state.verts.length);
  for (let k = 0; k < state.verts.length; k++) {
    const v = state.verts[k];
    const dx = mx - v.x;
    const dy = my - v.y;
    const d = Math.hypot(dx, dy);
    prox[k] = d < 520 ? 1 - d / 520 : 0;
    amb[k] = ambientValue(mode, v, t, state.w, state.h);
  }

  for (const tri of state.triangles) {
    const v0 = state.verts[tri[0]];
    const v1 = state.verts[tri[1]];
    const v2 = state.verts[tri[2]];
    const avgProx = (prox[tri[0]] + prox[tri[1]] + prox[tri[2]]) / 3;
    const avgAmb = (amb[tri[0]] + amb[tri[1]] + amb[tri[2]]) / 3;
    const p = Math.max(
      Math.pow(avgProx, 1.5) * state.hoverT * 0.55,
      avgAmb * 0.5,
    );

    const r = Math.floor(14 + p * 100);
    const g = Math.floor(6 + p * 45);
    const b = Math.floor(26 + p * 130);
    const a = 0.04 + p * 0.55;

    const color = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  raf = requestAnimationFrame(loop);
}

function startLoop() {
  if (!raf && running) {
    raf = requestAnimationFrame(loop);
  }
}

function stopLoop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

self.onmessage = (e) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d');
      mode = msg.mode;
      state = {
        w: 0, h: 0, dpr: 1,
        verts: [], cols: 0, rows: 0, triangles: [],
        mouse: { x: -9999, y: -9999, active: false, vx: 0, vy: 0 },
        hoverT: 0,
      };
      rebuild(msg.w, msg.h, msg.dpr);
      break;
    }
    case 'resize': {
      if (state) rebuild(msg.w, msg.h, msg.dpr);
      break;
    }
    case 'mouse': {
      if (state) {
        state.mouse.x = msg.x;
        state.mouse.y = msg.y;
        state.mouse.vx = msg.vx;
        state.mouse.vy = msg.vy;
        state.mouse.active = msg.active;
      }
      break;
    }
    case 'start': {
      running = true;
      startLoop();
      break;
    }
    case 'stop': {
      running = false;
      stopLoop();
      break;
    }
    case 'destroy': {
      stopLoop();
      state = null;
      canvas = null;
      ctx = null;
      self.close();
      break;
    }
  }
};
