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


const Section = styled.section`
  position: relative;
  padding: 80px 40px;
  content-visibility: auto;
  contain-intrinsic-size: auto 700px;

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

function Fx({ mode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof canvas.transferControlToOffscreen !== 'function') return;
    const host = canvas.parentElement;
    if (!host) return;

    if (canvas._fxTeardown) {
      clearTimeout(canvas._fxTeardown);
      canvas._fxTeardown = null;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let worker = canvas._fxWorker;
    if (!worker) {
      const rect = host.getBoundingClientRect();
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const offscreen = canvas.transferControlToOffscreen();
      worker = new Worker(
        new URL('./fxWorker.js', import.meta.url),
        { type: 'module' },
      );
      canvas._fxWorker = worker;
      worker.postMessage(
        { type: 'init', canvas: offscreen, mode, w: rect.width, h: rect.height, dpr },
        [offscreen],
      );
    }

    const resize = () => {
      const r = host.getBoundingClientRect();
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      worker.postMessage({ type: 'resize', w: r.width, h: r.height, dpr });
    };
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(
      ([entry]) => {
        worker.postMessage({ type: 'visibility', visible: entry.isIntersecting });
      },
      { rootMargin: '60px' },
    );
    io.observe(host);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', resize);
      canvas._fxTeardown = setTimeout(() => {
        worker.postMessage({ type: 'destroy' });
        worker.terminate();
        delete canvas._fxWorker;
        canvas._fxTeardown = null;
      }, 0);
    };
  }, [mode]);
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
            <Fx mode="problem" />
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
            <Fx mode="decision" />
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
