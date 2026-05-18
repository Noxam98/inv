/* eslint-disable no-restricted-globals */

let canvas = null;
let ctx = null;
let mode = null;
let w = 0;
let h = 0;
let dpr = 1;
let raf = 0;
let running = false;

const glitches = [];
const ripples = [];

function setSize(W, H, D) {
  w = W;
  h = H;
  dpr = D;
  canvas.width = Math.floor(W * D);
  canvas.height = Math.floor(H * D);
  ctx.setTransform(D, 0, 0, D, 0, 0);
}

function drawProblem(t) {
  ctx.clearRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.0008);
  grad.addColorStop(0, `rgba(220, 50, 60, ${0.022 + pulse * 0.018})`);
  grad.addColorStop(0.5, `rgba(180, 40, 90, ${0.014 + pulse * 0.014})`);
  grad.addColorStop(1, 'rgba(100, 20, 60, 0.018)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 3; i++) {
    const sy = (((t * 0.05) + (i * h) / 3) % (h + 60)) - 30;
    ctx.fillStyle = `rgba(255, 80, 60, 0.018)`;
    ctx.fillRect(0, sy, w, 1);
  }

  if (Math.random() < 0.012) {
    glitches.push({
      y: Math.random() * h,
      height: 2 + Math.random() * 6,
      life: 1,
      offset: (Math.random() - 0.5) * 20,
    });
  }
  for (let i = glitches.length - 1; i >= 0; i--) {
    const g = glitches[i];
    ctx.fillStyle = `rgba(255, 90, 100, ${0.035 * g.life})`;
    ctx.fillRect(g.offset, g.y, w, g.height);
    ctx.fillStyle = `rgba(80, 200, 255, ${0.022 * g.life})`;
    ctx.fillRect(g.offset + 4, g.y + 1, w, g.height);
    g.life -= 0.06;
    if (g.life <= 0) glitches.splice(i, 1);
  }

  ctx.fillStyle = 'rgba(255, 100, 110, 0.025)';
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
}

function drawDecision(t) {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < 3; i++) {
    const phase = t * 0.0008 + i * 1.4;
    const yOff = Math.sin(phase) * 40;
    const grad = ctx.createLinearGradient(0, h * 0.3 + yOff, w, h * 0.7 + yOff);
    grad.addColorStop(0, 'rgba(155, 93, 229, 0)');
    grad.addColorStop(0.5, 'rgba(180, 130, 255, 0.025)');
    grad.addColorStop(1, 'rgba(155, 93, 229, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  if (Math.random() < 0.018) {
    ripples.push({
      x: 30 + Math.random() * (w - 60),
      y: 30 + Math.random() * (h - 60),
      r: 0,
      life: 1,
    });
  }
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    rp.r += 1.2;
    rp.life -= 0.005;
    if (rp.life <= 0) {
      ripples.splice(i, 1);
      continue;
    }
    ctx.strokeStyle = `rgba(190, 140, 255, ${rp.life * 0.16})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function loop(t) {
  if (!running) {
    raf = 0;
    return;
  }
  if (mode === 'problem') drawProblem(t);
  else if (mode === 'decision') drawDecision(t);
  raf = requestAnimationFrame(loop);
}

self.onmessage = (e) => {
  const msg = e.data;
  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d');
      mode = msg.mode;
      setSize(msg.w, msg.h, msg.dpr);
      break;
    }
    case 'resize': {
      if (canvas) setSize(msg.w, msg.h, msg.dpr);
      break;
    }
    case 'visibility': {
      if (msg.visible) {
        running = true;
        if (!raf) raf = requestAnimationFrame(loop);
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
      glitches.length = 0;
      ripples.length = 0;
      self.close();
      break;
    }
  }
};
