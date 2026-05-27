import styled from 'styled-components';
import { motion } from 'framer-motion';

const features = [
  { num: '01', text: 'Key generation — on the device, without access to the network' },
  { num: '02', text: 'Lack of a block browser (exchange by tx-hashes, without an open list)' },
  { num: '03', text: 'No KYC and logs' },
  { num: '04', text: 'No open API — external whitelist connections (on request)' },
  { num: '05', text: 'TBD consensus (preliminarily — hybrid proof)' },
  { num: '06', text: 'Modules: network, keys, encryption, smart contracts, UI, exchange.' },
];

const privacyPoints = [
  'No IP tracking, cookies, telemetry, feedback',
  'Closed-source, but with internal audits and verification',
  'Protection at the architecture level: exclusion of third-party access, isolation of key operations',
  'Possibility of a secure local backup',
];

const Section = styled.section`
  padding: 100px 40px;
  background: transparent;
  content-visibility: auto;
  contain-intrinsic-size: auto 700px;
  overflow: visible;

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
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 56px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, auto);
  grid-auto-flow: column;
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    grid-auto-flow: row;
  }
`;

const NumBadge = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: rgba(68, 4, 98, 0.55);
  border: 1px solid rgba(155, 93, 229, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(30, 10, 55, 0.55);
  border: 1px solid rgba(155, 93, 229, 0.18);
  border-radius: 28px;
  padding: 16px 24px 16px 16px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  min-height: 96px;
  cursor: pointer;
  will-change: transform, opacity;

  &:hover {
    background: rgba(45, 15, 80, 0.65);
    border-color: rgba(199, 125, 255, 0.45);
    box-shadow: 0 12px 30px -10px rgba(155, 93, 229, 0.35);
  }

  &:hover ${NumBadge} {
    background: rgba(155, 93, 229, 0.85);
    border-color: #c77dff;
    box-shadow: 0 0 15px rgba(199, 125, 255, 0.4);
    transform: scale(1.06) rotate(3deg);
  }
`;

const FeatureText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
`;

const PrivacyBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 32px;
`;

const Dot = styled(motion.div)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentLight};
  flex-shrink: 0;
  margin-top: 8px;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
`;

const PrivacyText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray};
  transition: color 0.3s;
`;

const PrivacyItem = styled(motion.div)`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  cursor: pointer;

  &:hover ${Dot} {
    transform: scale(1.6);
    background-color: #fff;
    box-shadow: 0 0 10px #c77dff, 0 0 20px #c77dff;
  }

  &:hover ${PrivacyText} {
    color: #fff;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const privacyContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const privacyItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SecurityFeatures() {
  return (
    <Section>
      <Inner>
        <Grid>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Title variants={titleVariants}>Security<br />Architecture</Title>
            <FeaturesList>
              {features.map(({ num, text }) => (
                <FeatureItem
                  key={num}
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.015 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <NumBadge>{num}</NumBadge>
                  <FeatureText>{text}</FeatureText>
                </FeatureItem>
              ))}
            </FeaturesList>
          </motion.div>

          <PrivacyBlock
            variants={privacyContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Title variants={titleVariants}>Security of<br />Development</Title>
            {privacyPoints.map((point, i) => (
              <PrivacyItem
                key={i}
                variants={privacyItemVariants}
              >
                <Dot />
                <PrivacyText>{point}</PrivacyText>
              </PrivacyItem>
            ))}
          </PrivacyBlock>
        </Grid>
      </Inner>
    </Section>
  );
}

