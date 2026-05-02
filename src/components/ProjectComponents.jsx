import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const components = [
  {
    name: 'INDS Blockchain',
    desc: 'Its own network without a block explorer, configurable privacy, without an open API.',
    delay: 0.35,
    mode: 'chain',
  },
  {
    name: 'INDS Wallet',
    desc: 'Completely offline key generation, synchronization only over the network without saving private information.',
    delay: 0.05,
    mode: 'vault',
  },
  {
    name: 'INDS Exchange',
    desc: 'An internal exchanger built into the wallet for fiat/crypto/crypto conversion.',
    delay: 0.6,
    mode: 'flow',
  },
  {
    name: 'INDS Contracts',
    desc: 'Secure implementation of smart contracts for interaction between wallets, cards and exchanges.',
    delay: 0.2,
    mode: 'mesh',
  },
  {
    name: 'INDS Site',
    desc: 'Regular site for users with basic information, wallet download. Closed area with presentation for investors.',
    delay: 0.48,
    mode: 'split',
  },
];

const Section = styled.section`
  padding: 100px 40px;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.accentLight};
  text-align: center;
  margin-bottom: 72px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: 48px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 56px;
  margin-bottom: 72px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;
  }
`;

const RowBottom = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 56px;
  max-width: 66%;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 32px;
    max-width: 100%;
  }
`;

const Card = styled(motion.div)`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ theme }) => theme.colors.accentLight};
  transform-origin: left center;
  z-index: 3;
`;

const ContentMask = styled.div`
  overflow: hidden;
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
`;

const Content = styled(motion.div)`
  position: relative;
  padding: 24px 20px 4px;
  background: transparent;
  border: 1px solid transparent;
  border-top: none;
  transition: border-color 0.35s ease;
  flex: 1;
  width: 100%;

  ${Card}:hover & {
    border-color: rgba(155, 93, 229, 0.4);
  }
`;

const ParticleCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  filter: blur(6px);
  opacity: 0;
  transition: opacity 0.9s ease-out;
`;

const CardInner = styled.div`
  position: relative;
  z-index: 2;
`;

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 14px;
  letter-spacing: 0.3px;
`;

const CardDesc = styled.p`
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.75);
`;

const cardV = (delay) => ({
  hidden: {},
  visible: {
    transition: { delayChildren: delay },
  },
});

const lineV = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const contentV = {
  hidden: { y: '-100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

function ambientValue(mode, v, t, w, h) {
  switch (mode) {
    case 'chain': {
      const phase = v.bx * 0.04 - t * 0.0018;
      const s = Math.sin(phase);
      return Math.max(0, s);
    }
    case 'vault': {
      const cx = w / 2;
      const cy = h / 2;
      const d = Math.hypot(v.bx - cx, v.by - cy);
      const phase = d * 0.08 - t * 0.0022;
      const s = Math.sin(phase);
      return Math.max(0, s);
    }
    case 'flow': {
      const stream1 = Math.sin((v.bx - v.by) * 0.05 - t * 0.0032);
      const stream2 = Math.sin((v.bx + v.by) * 0.05 + t * 0.0032);
      return Math.max(0, Math.max(stream1, stream2));
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

function PolygonField({ hostRef, mode, delay = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');

    const state = {
      w: 0,
      h: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      verts: [],
      cols: 0,
      rows: 0,
      triangles: [],
      mouse: { x: -9999, y: -9999, active: false, vx: 0, vy: 0, lastX: 0, lastY: 0 },
      hoverT: 0,
      raf: 0,
      running: false,
    };

    function rebuild() {
      const rect = host.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = Math.floor(state.w * state.dpr);
      canvas.height = Math.floor(state.h * state.dpr);
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      const step = 22;
      const cols = Math.ceil(state.w / step) + 1;
      const rows = Math.ceil(state.h / step) + 1;
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
            bx,
            by,
            x: bx,
            y: by,
            vx: 0,
            vy: 0,
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
      state.hoverT += state.mouse.active ? 0.08 : -0.05;
      if (state.hoverT < 0) state.hoverT = 0;
      if (state.hoverT > 1) state.hoverT = 1;

      ctx.clearRect(0, 0, state.w, state.h);

      const mx = state.mouse.x;
      const my = state.mouse.y;
      const speed = Math.min(
        Math.hypot(state.mouse.vx, state.mouse.vy) * 0.1,
        1
      );
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

      state.raf = requestAnimationFrame(loop);
    }

    function start() {
      if (!state.raf) {
        state.raf = requestAnimationFrame(loop);
      }
    }

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      state.mouse.vx = x - state.mouse.lastX;
      state.mouse.vy = y - state.mouse.lastY;
      state.mouse.lastX = x;
      state.mouse.lastY = y;
      state.mouse.x = x;
      state.mouse.y = y;
      state.mouse.active = true;
      state.running = true;
      start();
    };
    const onLeave = () => {
      state.mouse.active = false;
      state.running = false;
      state.mouse.x = -9999;
      state.mouse.y = -9999;
      start();
    };
    const onResize = () => {
      rebuild();
      start();
    };

    rebuild();
    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    let kickoffTimeout = 0;
    let kickedOff = false;
    const kickoff = () => {
      if (kickedOff) return;
      kickedOff = true;
      kickoffTimeout = window.setTimeout(() => {
        canvas.style.opacity = '1';
        start();
      }, (delay + 0.9) * 1000);
    };

    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          kickoff();
          io.disconnect();
        }
      }, { rootMargin: '-60px' });
      io.observe(host);
    } else {
      kickoff();
    }

    return () => {
      if (io) io.disconnect();
      if (kickoffTimeout) clearTimeout(kickoffTimeout);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      if (state.raf) cancelAnimationFrame(state.raf);
    };
  }, [hostRef, mode, delay]);

  return <ParticleCanvas ref={canvasRef} />;
}

function CardItem({ name, desc, delay, mode }) {
  const hostRef = useRef(null);
  return (
    <Card
      ref={hostRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={cardV(delay)}
    >
      <TopLine variants={lineV} />
      <PolygonField hostRef={hostRef} mode={mode} delay={delay} />
      <ContentMask>
        <Content variants={contentV}>
          <CardInner>
            <CardName>{name}</CardName>
            <CardDesc>{desc}</CardDesc>
          </CardInner>
        </Content>
      </ContentMask>
    </Card>
  );
}

export default function ProjectComponents() {
  const top = components.slice(0, 3);
  const bottom = components.slice(3);

  return (
    <Section>
      <Title>Project components</Title>
      <Row>
        {top.map((c) => (
          <CardItem key={c.name} {...c} />
        ))}
      </Row>
      <RowBottom>
        {bottom.map((c) => (
          <CardItem key={c.name} {...c} />
        ))}
      </RowBottom>
    </Section>
  );
}
