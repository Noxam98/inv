import styled from 'styled-components';

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
  background: ${({ theme }) => theme.colors.bgSection};
  content-visibility: auto;
  contain-intrinsic-size: auto 700px;

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
  gap: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(30, 10, 55, 0.55);
  border: 1px solid rgba(155, 93, 229, 0.18);
  border-radius: 28px;
  padding: 16px 24px 16px 16px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.3s, border-color 0.3s;
  min-height: 96px;

  &:hover {
    background: rgba(45, 15, 80, 0.65);
    border-color: rgba(155, 93, 229, 0.35);
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
`;

const FeatureText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
`;

const PrivacyBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  display: block;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 32px;
`;

const PrivacyItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentLight};
  flex-shrink: 0;
  margin-top: 8px;
`;

const PrivacyText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray};
`;

export default function SecurityFeatures() {
  return (
    <Section>
      <Inner>
        <Grid>
          <div>
            <Title>Security<br />Architecture</Title>
            <FeaturesList>
              {features.map(({ num, text }) => (
                <FeatureItem key={num}>
                  <NumBadge>{num}</NumBadge>
                  <FeatureText>{text}</FeatureText>
                </FeatureItem>
              ))}
            </FeaturesList>
          </div>

          <PrivacyBlock>
            <Title>Security of<br />Development</Title>
            {privacyPoints.map((point, i) => (
              <PrivacyItem key={i}>
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
