import styled from 'styled-components';

const ARCH_BG = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/6956e785c056bc4abe2b4714_%D0%A1%D0%BE%D1%87%D0%B5%D1%82%D0%B0%D0%BD%D0%B8%D0%B5%202%20(1).svg';
const FRAME_IMG = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/6952833e793fda23ba2f2dbb_framebolllweb%201%20(2).svg';

const Section = styled.section`
  position: relative;
  padding: 100px 40px;
  background: #000000;
  background-image: url(${ARCH_BG});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Left = styled.div``;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  display: block;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(36px, 5vw, 72px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 32px;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray};
  max-width: 480px;
`;

const Right = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    width: 480px;
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    img { width: 100%; }
  }
`;

export default function Architecture() {
  return (
    <Section>
      <Inner>
        <Left>
          <Label>System design</Label>
          <Title>Architecture</Title>
          <Text>
            INDS is built on a modular architecture where each component operates independently
            and communicates through secured channels. Privacy is not an add-on — it is baked
            into the foundation of every layer: network, keys, encryption, smart contracts,
            UI and exchange.
          </Text>
        </Left>
        <Right>
          <img src={FRAME_IMG} alt="INDS Architecture diagram" />
        </Right>
      </Inner>
    </Section>
  );
}
