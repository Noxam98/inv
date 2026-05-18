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

function useOrbWorker(canvasRef, wrapRef, reducedRef) {
  useEffect(() => {
    if (reducedRef.current) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    if (typeof canvas.transferControlToOffscreen !== 'function') return;

    if (canvas._heroTeardown) {
      clearTimeout(canvas._heroTeardown);
      canvas._heroTeardown = null;
    }

    let worker = canvas._heroWorker;
    let initialW = 0;
    let initialH = 0;
    if (!worker) {
      initialW = canvas.offsetWidth;
      initialH = canvas.offsetHeight;
      canvas.width = initialW;
      canvas.height = initialH;
      const offscreen = canvas.transferControlToOffscreen();
      worker = new Worker(
        new URL('./heroOrbWorker.js', import.meta.url),
        { type: 'module' },
      );
      canvas._heroWorker = worker;
      worker.postMessage(
        { type: 'init', canvas: offscreen, w: initialW, h: initialH },
        [offscreen],
      );
    }

    const resize = () => {
      worker.postMessage({ type: 'resize', w: canvas.offsetWidth, h: canvas.offsetHeight });
    };

    const onMove = (e) => {
      const cRect = canvas.getBoundingClientRect();
      if (cRect.width === 0 || cRect.height === 0) return;
      const x = (e.clientX - cRect.left) * (canvas.offsetWidth / cRect.width);
      const y = (e.clientY - cRect.top) * (canvas.offsetHeight / cRect.height);
      worker.postMessage({ type: 'mouse', x, y, active: true });
    };
    const onLeave = () => {
      worker.postMessage({ type: 'mouse', x: -9999, y: -9999, active: false });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        worker.postMessage({ type: 'visibility', visible: entry.isIntersecting });
      },
      { rootMargin: '80px' },
    );
    io.observe(wrap);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      canvas._heroTeardown = setTimeout(() => {
        worker.postMessage({ type: 'destroy' });
        worker.terminate();
        delete canvas._heroWorker;
        canvas._heroTeardown = null;
      }, 0);
    };
  }, [canvasRef, wrapRef, reducedRef]);
}

function useOrbParallax(wrapRef, visibleRef, reducedRef) {
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
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [wrapRef, visibleRef, reducedRef]);
}

export default function HeroOrb() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const reducedRef = usePrefersReducedMotion();
  const visibleRef = useVisibility(wrapRef);
  useOrbWorker(canvasRef, wrapRef, reducedRef);
  useOrbParallax(wrapRef, visibleRef, reducedRef);

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
