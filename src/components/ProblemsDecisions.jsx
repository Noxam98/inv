import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PROBLEM_IMG = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/69536ce0b3fe81495eff919e_Problem.svg';
const DECISION_IMG = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/69536cd93cea1d9753bc8bd3_Decision.svg';

const problems = [
  'Surveillance, forced KYC, blocking and sanctions',
  'Vulnerabilities in solutions positioned as "anonymous" (e.g., Monero, Zcash, Tornado Cash)',
  'Lack of reliable physical protection of user funds',
  'Lack of ethical, but completely closed (by code) and at the same time trusting solutions',
  'Problems of loss of access if a physical device is lost',
];

const decisions = [
  'Own blockchain with custom consensus',
  'Desktop and mobile non-custodial wallet',
  'Built-in exchanger with fiat/crypto conversion',
  'Smart contracts (optional, hybrid)',
  'Privacy at the level of architecture, not interface',
  'No KYC, logs, open IP footprints',
  'Ethical protection against objectionable content or use',
];

/* скрытый SVG с фильтром — рефракция как у стекла */
function LiquidGlassDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
      <defs>
        <filter id="lg-refract" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="3" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feBlend in="blurred" in2="SourceGraphic" mode="normal" />
        </filter>
      </defs>
    </svg>
  );
}

const Section = styled.section`
  position: relative;
  padding: 80px 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled(motion.div)`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 20px 18px;
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);

  background: rgba(68, 4, 98, 0.15);
  border: 1px solid rgba(155, 93, 229, 0.18);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(180,120,255,0.07);

  /* top edge highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(155,93,229,0.25), transparent);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 14px 14px;
  }
`;

const ColHeader = styled.div`
  margin-bottom: 12px;
  padding-left: 28px;
`;

/* слой-линза поверх фона карточки */
const GlassLayer = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  filter: url(#lg-refract);
  background: rgba(68, 4, 98, 0.15);
  z-index: 0;
`;

const FxCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
  mix-blend-mode: screen;
  filter: hue-rotate(var(--pd-scroll-hue, 0deg)) saturate(var(--pd-scroll-sat, 1));
  transition: filter 0.4s ease;
`;

function ProblemFx() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const glitches = [];

    function resize() {
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnGlitch() {
      glitches.push({
        y: Math.random() * h,
        height: 2 + Math.random() * 6,
        speed: 1 + Math.random() * 2,
        life: 1,
        offset: (Math.random() - 0.5) * 20,
      });
    }

    function loop(t) {
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, w, h);
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.0008);
      grad.addColorStop(0, `rgba(220, 50, 60, ${0.022 + pulse * 0.018})`);
      grad.addColorStop(0.5, `rgba(180, 40, 90, ${0.014 + pulse * 0.014})`);
      grad.addColorStop(1, 'rgba(100, 20, 60, 0.018)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 3; i++) {
        const sy = (((t * 0.05) + i * h / 3) % (h + 60)) - 30;
        ctx.fillStyle = `rgba(255, 80, 60, 0.018)`;
        ctx.fillRect(0, sy, w, 1);
      }

      if (Math.random() < 0.012) spawnGlitch();
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
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.fillRect(x, y, 1, 1);
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <FxCanvas ref={canvasRef} />;
}

function DecisionFx() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const ripples = [];

    function resize() {
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnRipple() {
      ripples.push({
        x: 30 + Math.random() * (w - 60),
        y: 30 + Math.random() * (h - 60),
        r: 0,
        life: 1,
      });
    }

    function loop(t) {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < 3; i++) {
        const phase = t * 0.0008 + i * 1.4;
        const yOff = Math.sin(phase) * 40;
        const grad = ctx.createLinearGradient(0, h * 0.3 + yOff, w, h * 0.7 + yOff);
        const a = 0.025;
        grad.addColorStop(0, 'rgba(155, 93, 229, 0)');
        grad.addColorStop(0.5, `rgba(180, 130, 255, ${a})`);
        grad.addColorStop(1, 'rgba(155, 93, 229, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      if (Math.random() < 0.018) spawnRipple();
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

      raf = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <FxCanvas ref={canvasRef} />;
}

const CardContent = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

const ColTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(200, 180, 255, 0.85);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled(motion.li)`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.9);

  &::before {
    content: '-';
    flex-shrink: 0;
    color: #fff;
    font-weight: 600;
    line-height: 1.55;
  }
`;

const itemV = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const cardV = (delay) => ({
  hidden:  { opacity: 0 },
  visible: { opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

const cardContentV = (delay) => ({
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.6, delay: delay + 0.05, ease: [0.22, 1, 0.36, 1] } },
});

function useScrollHue(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / vh;
      const clamped = Math.max(-1.2, Math.min(1.2, progress));
      const hue = clamped * 90;
      const sat = 1 + Math.abs(clamped) * 0.3;
      el.style.setProperty('--pd-scroll-hue', `${hue}deg`);
      el.style.setProperty('--pd-scroll-sat', sat.toFixed(2));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}

export default function ProblemsDecisions() {
  const sectionRef = useRef(null);
  useScrollHue(sectionRef);
  return (
    <Section ref={sectionRef}>
      <LiquidGlassDefs />
      <Inner>
        <Grid>
          <Column
            $type="problem"
            variants={cardV(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <GlassLayer $type="problem" />
            <ProblemFx />
            <CardContent
              variants={cardContentV(0)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <ColHeader>
                <ColTitle>Problem</ColTitle>
              </ColHeader>
              <List>
                {problems.map((p, i) => (
                  <ListItem key={i} $type="problem" custom={i} variants={itemV} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {p}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Column>

          <Column
            $type="decision"
            variants={cardV(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <GlassLayer $type="decision" />
            <DecisionFx />
            <CardContent
              variants={cardContentV(0.12)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <ColHeader>
                <ColTitle>Decision</ColTitle>
              </ColHeader>
              <List>
                {decisions.map((d, i) => (
                  <ListItem key={i} $type="decision" custom={i} variants={itemV} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {d}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Column>
        </Grid>
      </Inner>
    </Section>
  );
}
