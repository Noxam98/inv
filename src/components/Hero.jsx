import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import HeroOrb from './HeroOrb';

const HERO_BG = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/694b9246acf807f75f979f61_web%2019206.png';

/* ─── section ─── */
const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #000;
  overflow: hidden;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url(${HERO_BG});
  background-size: cover;
  background-position: left top;

  -webkit-mask-image: radial-gradient(
    ellipse 90% 90% at 10% 10%,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.6) 35%,
    rgba(0,0,0,0.2) 60%,
    transparent     80%
  );
  mask-image: radial-gradient(
    ellipse 90% 90% at 10% 10%,
    rgba(0,0,0,0.9) 0%,
    rgba(0,0,0,0.6) 35%,
    rgba(0,0,0,0.2) 60%,
    transparent     80%
  );
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 130px 40px 90px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 110px 20px 70px;
  }
`;

/* ─── tag ─── */
const Tag = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  border: 1px solid rgba(155, 93, 229, 0.35);
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 28px;
  backdrop-filter: blur(8px);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accentLight};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.accentLight};
  }
`;

/* ─── animated heading ─── */
const HeadingWrap = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(32px, 5vw, 72px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
  max-width: 740px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 28px;
  overflow: hidden;
`;

const Line = styled.div`
  overflow: hidden;
  display: block;
`;

const Word = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
`;

/* ─── text blocks ─── */
const Subtitle = styled(motion.p)`
  font-size: clamp(14px, 1.8vw, 17px);
  color: ${({ theme }) => theme.colors.gray};
  max-width: 520px;
  line-height: 1.8;
  margin-bottom: 14px;
`;

const Description = styled(motion.p)`
  font-size: 13px;
  color: rgba(178, 178, 178, 0.65);
  max-width: 600px;
  line-height: 1.8;
  margin-bottom: 44px;
`;

/* ─── scroll hint ─── */
const scrollBounce = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50%       { transform: translateY(6px); opacity: 1; }
`;

const ScrollHint = styled(motion.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(178,178,178,0.5);

  svg {
    animation: ${scrollBounce} 1.8s ease-in-out infinite;
  }
`;

/* ─── variants ─── */
const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const wordV = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUpV = (delay = 0) => ({
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } },
});

/* ─── helpers ─── */
const lines = [
  ['Invite', 'D', 'Security', '—'],
  ['Autonomous', 'Secure'],
  ['Financial', 'System'],
];

export default function Hero() {
  return (
    <Section>
      <HeroBg />
      <HeroOrb />

      <Container>
        <Tag
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Project INDS
        </Tag>

        {/* split-word heading */}
        <HeadingWrap>
          {lines.map((words, li) => (
            <Line key={li}>
              <motion.span
                style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em' }}
                variants={containerV}
                initial="hidden"
                animate="visible"
                custom={li}
              >
                {words.map((w, wi) => (
                  <Word key={wi} variants={wordV}>
                    {w}
                  </Word>
                ))}
              </motion.span>
            </Line>
          ))}
        </HeadingWrap>

        <Subtitle
          variants={fadeUpV(0.85)}
          initial="hidden"
          animate="visible"
        >
          The INDS project is being created as the basis for an independent,
          fully decentralized and ethical digital financial system. It does not
          depend on states, banks, corporations, or political decisions.
        </Subtitle>

        <Description
          variants={fadeUpV(1.05)}
          initial="hidden"
          animate="visible"
        >
          INDS is not just a crypto wallet or blockchain — it is a technical standard
          that provides the user with protection, control and privacy without the need
          to trust external participants.
        </Description>

        <ScrollHint
          variants={fadeUpV(1.25)}
          initial="hidden"
          animate="visible"
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5"/>
            <rect x="6.5" y="5" width="3" height="5" rx="1.5" fill="currentColor" fillOpacity="0.6"/>
          </svg>
          Scroll
        </ScrollHint>
      </Container>
    </Section>
  );
}
