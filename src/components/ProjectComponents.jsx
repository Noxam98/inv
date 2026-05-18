import { useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const components = [
  {
    name: 'INDS Blockchain',
    desc: 'Its own network without a block explorer, configurable privacy, without an open API.',
    delay: 0.35,
  },
  {
    name: 'INDS Wallet',
    desc: 'Completely offline key generation, synchronization only over the network without saving private information.',
    delay: 0.05,
  },
  {
    name: 'INDS Exchange',
    desc: 'An internal exchanger built into the wallet for fiat/crypto/crypto conversion.',
    delay: 0.6,
  },
  {
    name: 'INDS Contracts',
    desc: 'Secure implementation of smart contracts for interaction between wallets, cards and exchanges.',
    delay: 0.2,
  },
  {
    name: 'INDS Site',
    desc: [
      'Regular site for users with basic information, wallet download.',
      'Closed area with presentation for investors.',
    ],
    delay: 0.48,
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
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
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
  transition: transform 0.35s ease, box-shadow 0.35s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 40px rgba(155, 93, 229, 0.18);
  }
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
  transition: box-shadow 0.35s ease;

  ${Card}:hover & {
    box-shadow: 0 0 14px rgba(199, 125, 255, 0.7);
  }
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
  transition: border-color 0.35s ease, background 0.35s ease;
  flex: 1;
  width: 100%;

  ${Card}:hover & {
    border-color: rgba(155, 93, 229, 0.4);
    background: linear-gradient(180deg, rgba(88, 19, 133, 0.10), transparent 60%);
  }
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
  transition: color 0.35s ease;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const CardDesc = styled.p`
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.75);
`;

const CardDescList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardDescItem = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.75);

  &::before {
    content: '•';
    flex-shrink: 0;
    width: 8px;
    color: inherit;
    font-size: 16px;
    line-height: 1.3;
  }
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

function CardItem({ name, desc, delay }) {
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
      <ContentMask>
        <Content variants={contentV}>
          <CardInner>
            <CardName>{name}</CardName>
            {Array.isArray(desc) ? (
              <CardDescList>
                {desc.map((line, i) => (
                  <CardDescItem key={i}>{line}</CardDescItem>
                ))}
              </CardDescList>
            ) : (
              <CardDesc>{desc}</CardDesc>
            )}
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
