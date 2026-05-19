import styled from 'styled-components';
import StageCard from './StageCard';

const stages = [
  {
    items: [
      {
        bold: 'Development',
        rest: ' of a mini-application TG, a website and a website for developers.',
      },
      { bold: 'INDS Wallet', rest: ' prototype (desktop)' },
    ],
  },
  {
    items: [
      { bold: 'Development', rest: ' of blockchain architecture' },
      { bold: 'Testnet', rest: ' and demonstration of p2p functions' },
    ],
  },
  {
    items: [
      { bold: 'Implementation', rest: ' of a built-in exchanger' },
      { bold: 'Release', rest: ' of the mobile version of the wallet' },
    ],
  },
  {
    items: [
      { bold: 'Implementation', rest: ' of smart contracts' },
      { bold: 'Optional', rest: ' — external integrations via API' },
    ],
  },
];

const Section = styled.section`
  padding: 100px 40px;
  overflow: visible;
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: 56px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: 40px;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 4vw, 52px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
`;

const Note = styled.p`
  margin-top: 14px;
  max-width: 540px;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(180, 180, 195, 0.65);
`;

/* Sum of SHAPES ratios in StageCard ≈ 4.266 — height derived from
   viewport width so cards together fit horizontally without overflow. */
const Strip = styled.div`
  --card-h: clamp(240px, 22vw, 380px);

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  & > * + * {
    margin-left: calc(-0.45 * var(--card-h));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: stretch;
    padding: 0 16px;

    & > * + * {
      margin-left: 0;
    }
  }
`;

export default function Stages() {
  return (
    <Section>
      <Inner>
        <SectionHeader>
          <Title>Stages of development</Title>
          <Note>
            External integrations — possible SDKs for trusted apps, or bridges to
            featured dApps in the process under development.
          </Note>
        </SectionHeader>
      </Inner>

      <Strip>
        {stages.map((stage, i) => (
          <StageCard key={i} {...stage} index={i} />
        ))}
      </Strip>
    </Section>
  );
}
