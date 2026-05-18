import styled from "styled-components";
import StageCard from "./StageCard";

const stages = [
  {
    num: "1",
    items: [
      "Development of a mini-application TG, a website and a website for developers",
      "INDS Wallet prototype (desktop)",
    ],
  },
  {
    num: "2",
    items: [
      "Release of the mobile version of the wallet",
      "Implementation of smart contracts",
      "Optional external integrations via API",
      "Bridges to featured dApps",
    ],
  },
  {
    num: "3",
    items: [
      "Development of blockchain architecture",
      "Testnet and demonstration of p2p functions",
      "Implementation of a built-in exchanger",
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
  max-width: 980px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 56px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 4vw, 52px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
`;

const Strip = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  max-width: 1280px;
  margin: 0 auto;

  & > * + * {
    margin-left: -190px;
  }

  @media (max-width: 1034px) {
    flex-direction: column;
    width: 100%;
    max-width: none;
    
    & > * {
      flex: 0 0 auto;
    }
    
    & > * + * {
      margin-top: -48px;
      margin-left: 0;
    }
    
    & > *:first-child {
      align-self: flex-start;
    }
    & > *:nth-child(2) {
      align-self: center;
    }
    & > *:last-child {
      align-self: flex-end;
    }
  }
`;

export default function Stages() {
  return (
    <Section>
      <Inner>
        <SectionHeader>
          <Title>Stages of development</Title>
        </SectionHeader>

        <Strip>
          {stages.map((stage, i) => (
            <StageCard key={stage.num} {...stage} index={i} />
          ))}
        </Strip>
      </Inner>
    </Section>
  );
}
