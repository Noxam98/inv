import styled, { keyframes } from 'styled-components';
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

const glassShine = keyframes`
  0%   { transform: translateX(-120%) rotate(20deg); }
  100% { transform: translateX(320%)  rotate(20deg); }
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

  /* shine sweep */
  &::before {
    content: '';
    position: absolute;
    top: -60%; left: -50%;
    width: 35%; height: 220%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.055),
      transparent
    );
    opacity: 0;
    pointer-events: none;
  }
  &:hover::before {
    opacity: 1;
    animation: ${glassShine} 0.65s ease forwards;
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

const CardContent = styled.div`
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
    content: '';
    margin-top: 8px;
    flex-shrink: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(200, 200, 200, 0.4);
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
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

export default function ProblemsDecisions() {
  return (
    <Section>
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
            <CardContent>
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
            <CardContent>
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
