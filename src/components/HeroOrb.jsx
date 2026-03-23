import { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

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
`;

/* ─── outer glow halo ─── */
const Halo = styled.div`
  position: absolute;
  inset: -30%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(88,19,133,0.35) 0%, transparent 65%);
  animation: ${pulse} 4s ease-in-out infinite;
  filter: blur(40px);
`;

/* ─── orb core ─── */
const OrbFloat = styled.div`
  position: absolute;
  inset: 0;
  animation: ${float} 7s ease-in-out infinite;
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

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;

    const particles = Array.from({ length: 55 }, () => {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * (Math.min(W, H) * 0.36);
      return {
        angle,
        radius,
        speed:  (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size:   Math.random() * 1.8 + 0.4,
        alpha:  Math.random() * 0.6 + 0.2,
        pulse:  Math.random() * Math.PI * 2,
        pulseS: Math.random() * 0.02 + 0.01,
      };
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.angle  += p.speed;
        p.pulse  += p.pulseS;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 120, 255, ${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
}

export default function HeroOrb() {
  const canvasRef = useRef(null);
  useParticles(canvasRef);

  return (
    <Wrap>
      <Halo />
      <Canvas ref={canvasRef} />
      <OrbFloat>
        <Ring1 $dur={10} />
        <Ring2 $dur={16} $rev />
        <Ring3 $dur={22} />
        <Orb />
      </OrbFloat>
    </Wrap>
  );
}
