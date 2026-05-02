import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ─── keyframes ─── */
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-18px) rotate(1.5deg); }
  66%       { transform: translateY(-8px)  rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.06); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const spinRev = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

const shimmer = keyframes`
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
`;

/* ─── wrapper ─── */
const Wrap = styled.div`
  position: absolute;
  right: 6%;
  top: 50%;
  transform: translateY(-50%);
  width: min(480px, 42vw);
  aspect-ratio: 1;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 1024px) {
    width: min(340px, 44vw);
    right: 2%;
  }
  @media (max-width: 768px) {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    & * {
      animation: none !important;
    }
  }
`;

/* ─── outer glow halo (gradient does the feathering, no blur filter) ─── */
const Halo = styled.div`
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(88, 19, 133, 0.35) 0%,
    rgba(88, 19, 133, 0.22) 22%,
    rgba(88, 19, 133, 0.10) 45%,
    rgba(88, 19, 133, 0.04) 65%,
    transparent             82%
  );
  animation: ${pulse} 4s ease-in-out infinite;
  will-change: opacity, transform;
`;

/* ─── parallax wrapper for cursor reaction ─── */
const Parallax = styled.div`
  position: absolute;
  inset: 0;
  transform: translate(var(--orb-tx, 0px), var(--orb-ty, 0px));
  will-change: transform;
`;

/* ─── orb core ─── */
const OrbFloat = styled.div`
  position: absolute;
  inset: 0;
  animation: ${float} 7s ease-in-out infinite;
  will-change: transform;
`;

const Orb = styled.div`
  position: absolute;
  inset: 15%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%,
    rgb(180, 120, 255) 0%,
    rgb(88,  19,  133) 35%,
    rgb(40,   5,   70) 65%,
    rgb(10,   0,   20) 100%
  );
  box-shadow:
    0 0 60px  rgba(140, 60, 220, 0.6),
    0 0 120px rgba(88,  19, 133, 0.4),
    0 0 200px rgba(60,  10, 100, 0.25),
    inset 0 0 40px rgba(200, 150, 255, 0.15);
  animation: ${pulse} 4s ease-in-out infinite;
  will-change: transform, opacity;

  /* glare */
  &::before {
    content: '';
    position: absolute;
    top: 12%;
    left: 18%;
    width: 30%;
    height: 20%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%);
    filter: blur(6px);
  }

  /* shimmer band */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg,
      transparent 30%,
      rgba(200,150,255,0.12) 50%,
      transparent 70%
    );
    background-size: 200% 200%;
    animation: ${shimmer} 5s ease infinite;
  }
`;

/* ─── orbit rings ─── */
const Ring = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(155, 93, 229, ${({ $op }) => $op ?? 0.3});
  animation: ${({ $rev }) => $rev ? spinRev : spin}
             ${({ $dur }) => $dur ?? 12}s linear infinite;
  will-change: transform;
`;

const Ring1 = styled(Ring)`
  inset: 2%;
  border-top-color:   rgba(200, 120, 255, 0.6);
  border-right-color: rgba(200, 120, 255, 0.2);
`;

const Ring2 = styled(Ring)`
  inset: -4%;
  border-bottom-color: rgba(155, 93, 229, 0.5);
  border-left-color:   rgba(155, 93, 229, 0.15);
  transform: rotateX(65deg);
`;

const Ring3 = styled(Ring)`
  inset: -12%;
  border-top-color:  rgba(120, 60, 200, 0.35);
  border-right-color: transparent;
  $op: 0.12;
`;

/* ─── particles canvas ─── */
const Canvas = styled.canvas`
  position: absolute;
  inset: -40%;
  width: 180%;
  height: 180%;
  pointer-events: none;
`;

/* ─── hooks ─── */
function usePrefersReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    ref.current = mq.matches;
    const onChange = (e) => { ref.current = e.matches; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return ref;
}

function useVisibility(targetRef) {
  const visibleRef = useRef(true);
  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { rootMargin: '80px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetRef]);
  return visibleRef;
}

function useParticles(canvasRef, mouseRef, visibleRef, reducedRef) {
  useEffect(() => {
    if (reducedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W0 = canvas.width;
    const H0 = canvas.height;
    const particles = Array.from({ length: 55 }, () => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * (Math.min(W0, H0) * 0.36);
      return {
        angle,
        radius,
        speed:  (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size:   Math.random() * 1.8 + 0.4,
        alpha:  Math.random() * 0.6 + 0.2,
        pulse:  Math.random() * Math.PI * 2,
        pulseS: Math.random() * 0.02 + 0.01,
        ox: 0,
        oy: 0,
      };
    });

    const R  = 110;
    const R2 = R * R;
    const TAU = Math.PI * 2;

    function draw() {
      if (!visibleRef.current) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      ctx.clearRect(0, 0, W, H);

      const mouse = mouseRef.current;
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

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, mouseRef, visibleRef, reducedRef]);
}

function useOrbParallax(wrapRef, mouseRef, visibleRef, reducedRef) {
  useEffect(() => {
    if (reducedRef.current) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e) => {
      if (!visibleRef.current) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(window.innerWidth, window.innerHeight) * 0.45;
      target.x = Math.max(-1, Math.min(1, dx / reach));
      target.y = Math.max(-1, Math.min(1, dy / reach));

      const canvas = wrap.querySelector('canvas');
      if (canvas) {
        const cRect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: (e.clientX - cRect.left) * (canvas.width / cRect.width),
          y: (e.clientY - cRect.top) * (canvas.height / cRect.height),
          active: true,
        };
      }
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    const tick = () => {
      if (visibleRef.current) {
        current.x += (target.x - current.x) * 0.06;
        current.y += (target.y - current.y) * 0.06;
        wrap.style.setProperty('--orb-tx', `${current.x * 26}px`);
        wrap.style.setProperty('--orb-ty', `${current.y * 18}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [wrapRef, mouseRef, visibleRef, reducedRef]);
}

export default function HeroOrb() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const reducedRef = usePrefersReducedMotion();
  const visibleRef = useVisibility(wrapRef);
  useParticles(canvasRef, mouseRef, visibleRef, reducedRef);
  useOrbParallax(wrapRef, mouseRef, visibleRef, reducedRef);

  return (
    <Wrap ref={wrapRef}>
      <Parallax>
        <Halo />
        <Canvas ref={canvasRef} />
        <OrbFloat>
          <Ring1 $dur={10} />
          <Ring2 $dur={16} $rev />
          <Ring3 $dur={22} />
          <Orb />
        </OrbFloat>
      </Parallax>
    </Wrap>
  );
}
