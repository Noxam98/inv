import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedDiv, fadeUp } from './AnimatedSection';

const components = [
  {
    name: 'NDS Blockchain',
    desc: 'Its own network without a block explorer, configurable privacy, without an open API.',
    icon: '⛓',
  },
  {
    name: 'INDS Wallet',
    desc: 'Completely offline key generation, synchronization only over the network without saving private information.',
    icon: '🔐',
  },
  {
    name: 'INDS Exchange',
    desc: 'An internal exchanger built into the wallet for fiat/crypto/crypto conversion.',
    icon: '⇄',
  },
  {
    name: 'INDS Contracts',
    desc: 'Secure implementation of smart contracts for interaction between wallets, cards and exchanges.',
    icon: '📄',
  },
  {
    name: 'INDS Site',
    desc: 'Regular site for users with basic information, wallet download. Closed area with presentation for investors.',
    icon: '🌐',
  },
];

const Section = styled.section`
  padding: 100px 40px;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Header = styled.div`
  margin-bottom: 56px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  display: block;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 32px 28px;
  transition: background 0.3s, border-color 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMid};
    border-color: rgba(155, 93, 229, 0.3);
  }
`;

const Icon = styled.div`
  font-size: 28px;
  margin-bottom: 16px;
`;

const CardName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 12px;
`;

const CardDesc = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray};
`;

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function ProjectComponents() {
  return (
    <Section>
      <AnimatedDiv variants={fadeUp}>
        <Header>
          <Label>Architecture</Label>
          <Title>Project components</Title>
        </Header>
      </AnimatedDiv>
      <motion.div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {components.map(({ name, desc, icon }, i) => (
          <Card key={name} variants={cardVariant} custom={i} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Icon>{icon}</Icon>
            <CardName>{name}</CardName>
            <CardDesc>{desc}</CardDesc>
          </Card>
        ))}
      </motion.div>
    </Section>
  );
}
