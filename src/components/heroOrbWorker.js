/* eslint-disable no-restricted-globals */

let canvas = null;
let ctx = null;
let particles = [];
let mouse = { x: -9999, y: -9999, active: false };
let raf = 0;
let running = false;

const R = 110;
const R2 = R * R;
const TAU = Math.PI * 2;

function rebuild() {
  const W = canvas.width;
  const H = canvas.height;
  particles = Array.from({ length: 55 }, () => {
    const angle = Math.random() * TAU;
    const radius = 80 + Math.random() * (Math.min(W, H) * 0.36);
    return {
      angle,
      radius,
      speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * TAU,
      pulseS: Math.random() * 0.02 + 0.01,
      ox: 0,
      oy: 0,
    };
  });
}

function draw() {
  if (!running) {
    raf = 0;
    return;
  }
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  ctx.clearRect(0, 0, W, H);

  const active = mouse.active;
  const mx = mouse.x;
  const my = mouse.y;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.angle += p.speed;
    p.pulse += p.pulseS;
    const baseX = cx + Math.cos(p.angle) * p.radius;
    const baseY = cy + Math.sin(p.angle) * p.radius;

    let tx = 0, ty = 0, proxBoost = 0;
    if (active) {
      const dx = mx - baseX;
      const dy = my - baseY;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        const d = Math.sqrt(d2) || 1;
        const f = 1 - d / R;
        tx = -(dx / d) * f * 26;
        ty = -(dy / d) * f * 26;
        proxBoost = f * 0.6;
      }
    }
    p.ox += (tx - p.ox) * 0.12;
    p.oy += (ty - p.oy) * 0.12;

    const x = baseX + p.ox;
    const y = baseY + p.oy;
    let a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse)) + proxBoost;
    if (a > 1) a = 1;
    const rCh = (180 + proxBoost * 50) | 0;
    const gCh = (120 + proxBoost * 60) | 0;

    ctx.beginPath();
    ctx.arc(x, y, p.size + proxBoost * 1.4, 0, TAU);
    ctx.fillStyle = `rgba(${rCh},${gCh},255,${a})`;
    ctx.fill();
  }

  raf = requestAnimationFrame(draw);
}

self.onmessage = (e) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d');
      canvas.width = msg.w;
      canvas.height = msg.h;
      rebuild();
      break;
    }
    case 'resize': {
      if (!canvas) return;
      canvas.width = msg.w;
      canvas.height = msg.h;
      rebuild();
      break;
    }
    case 'mouse': {
      mouse.x = msg.x;
      mouse.y = msg.y;
      mouse.active = msg.active;
      break;
    }
    case 'visibility': {
      if (msg.visible) {
        running = true;
        if (!raf) raf = requestAnimationFrame(draw);
      } else {
        running = false;
      }
      break;
    }
    case 'destroy': {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      canvas = null;
      ctx = null;
      particles = [];
      self.close();
      break;
    }
  }
};
