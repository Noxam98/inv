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
  content-visibility: auto;
  contain-intrinsic-size: auto 900px;

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
  padding: 24px 20px  4px;
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

function PolygonField({ hostRef, mode, delay = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    if (typeof canvas.transferControlToOffscreen !== 'function') return;

    if (canvas._pfTeardown) {
      clearTimeout(canvas._pfTeardown);
      canvas._pfTeardown = null;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let worker = canvas._pfWorker;
    if (!worker) {
      const rect = host.getBoundingClientRect();
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      const offscreen = canvas.transferControlToOffscreen();
      worker = new Worker(
        new URL('./polygonFieldWorker.js', import.meta.url),
        { type: 'module' },
      );
      canvas._pfWorker = worker;
      worker.postMessage(
        { type: 'init', canvas: offscreen, mode, w: rect.width, h: rect.height, dpr },
        [offscreen],
      );
    }

    const sendResize = () => {
      const rect = host.getBoundingClientRect();
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      worker.postMessage({ type: 'resize', w: rect.width, h: rect.height, dpr });
    };

    let lastX = 0;
    let lastY = 0;
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const vx = x - lastX;
      const vy = y - lastY;
      lastX = x;
      lastY = y;
      worker.postMessage({ type: 'mouse', x, y, vx, vy, active: true });
    };
    const onLeave = () => {
      worker.postMessage({ type: 'mouse', x: -9999, y: -9999, vx: 0, vy: 0, active: false });
    };

    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', sendResize);

    let kickoffTimeout = 0;
    let kickedOff = canvas._pfStarted;
    const kickoff = () => {
      if (kickedOff) return;
      kickedOff = true;
      kickoffTimeout = window.setTimeout(() => {
        canvas.style.opacity = '1';
        canvas._pfStarted = true;
        worker.postMessage({ type: 'start' });
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
      window.removeEventListener('resize', sendResize);
      canvas._pfTeardown = setTimeout(() => {
        worker.postMessage({ type: 'destroy' });
        worker.terminate();
        delete canvas._pfWorker;
        canvas._pfStarted = false;
        canvas._pfTeardown = null;
      }, 0);
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
