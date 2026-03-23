import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedDiv, StaggerDiv, fadeUp, slideLeft, slideRight, staggerContainer, fadeIn } from '../components/AnimatedSection';

const Page = styled.div`
  min-height: 100vh;
  padding: 120px 40px 80px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 20px 60px;
  }
`;

const Hero = styled.div`
  margin-bottom: 72px;
`;

const HeroText = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.white};
  max-width: 760px;
  margin-bottom: 24px;

  em {
    font-style: italic;
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const SubText = styled(motion.p)`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.gray};
  max-width: 680px;
`;

const GoalSection = styled.section`
  margin-bottom: 64px;
`;

const SectionLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: 1px;
  margin-bottom: 32px;
`;

const GoalGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const GoalCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 28px 24px;
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray};
  transition: background 0.3s, border-color 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMid};
    border-color: rgba(155, 93, 229, 0.3);
  }

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentLight};
    margin-bottom: 10px;
  }
`;

const ManifestoBlock = styled.div`
  background: linear-gradient(135deg, rgba(88,19,133,0.18), rgba(88,19,133,0.04));
  border: 1px solid rgba(155, 93, 229, 0.2);
  border-radius: 20px;
  padding: 40px 44px;
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 20px;
  }
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Pillar = styled(motion.div)`
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &::before {
    content: '✓';
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(93, 229, 160, 0.1);
    border: 1px solid rgba(93, 229, 160, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #5de5a0;
    flex-shrink: 0;
  }
`;

const Closing = styled(motion.p)`
  font-size: clamp(18px, 2.5vw, 26px);
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 300;
  margin-top: 48px;

  em {
    color: ${({ theme }) => theme.colors.accentLight};
    font-style: italic;
  }
`;

const goals = [
  {
    strong: 'Encryption',
    text: 'Your actions are encrypted, and you remain in charge.',
  },
  {
    strong: 'Ownership',
    text: 'Control over the funds belongs only to you.',
  },
  {
    strong: 'Architecture-level privacy',
    text: 'Privacy is implemented at the architectural level, not as an additional function.',
  },
  {
    strong: 'Reliability',
    text: 'Technologies work stably, scalable and transparent for the user.',
  },
];

const pillars = [
  'Security at the protocol level',
  'Legal flexibility',
  'Scalability',
  'Integrations under strict control',
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function AboutPage() {
  return (
    <Page>
      <Hero>
        <HeroText
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          INDS (Invite D Security) is a technology project that{' '}
          <em>creates a new model of financial access.</em>
        </HeroText>
        <SubText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          We are developing our own infrastructure: blockchain, a non-custodial wallet, and a
          system of digital tools where the user manages his funds independently — without
          intermediaries and dependence on external solutions.
        </SubText>
      </Hero>

      <GoalSection>
        <AnimatedDiv variants={fadeUp}>
          <SectionLabel>Our mission</SectionLabel>
          <SectionTitle>Our goal is to create an environment where:</SectionTitle>
        </AnimatedDiv>

        <GoalGrid
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {goals.map(({ strong, text }, i) => (
            <GoalCard key={strong} variants={cardVariant} custom={i}>
              <strong>{strong}</strong>
              {text}
            </GoalCard>
          ))}
        </GoalGrid>

        <AnimatedDiv variants={fadeUp} custom={1} style={{ marginTop: 32 }}>
          <p style={{ fontSize: 16, color: '#fff', fontFamily: 'inherit', lineHeight: 1.6 }}>
            <strong style={{ fontFamily: 'var(--font-heading, Oswald, sans-serif)', fontSize: 18, letterSpacing: 1 }}>
              We do not create a temporary product.
            </strong>
            <br />
            We are creating infrastructure.
          </p>
        </AnimatedDiv>
      </GoalSection>

      <AnimatedDiv variants={fadeUp}>
        <ManifestoBlock>
          <SectionLabel>Foundation</SectionLabel>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: '#b2b2b2', marginBottom: 20 }}>
            INDS is not just a wallet or blockchain. It is a system focused on long-term
            sustainability, technical rigor and responsibility to the user.
          </p>
          <p style={{ fontSize: 14, color: '#b2b2b2', marginBottom: 16 }}>
            The project is built taking into account:
          </p>
          <PillarsGrid>
            {pillars.map((p, i) => (
              <Pillar
                key={p}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {p}
              </Pillar>
            ))}
          </PillarsGrid>
        </ManifestoBlock>
      </AnimatedDiv>

      <Closing
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        We believe that financial instruments{' '}
        <em>should work for people</em>, not the other way around.
      </Closing>
    </Page>
  );
}
