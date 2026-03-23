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
  gap: 60px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px 20px;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMid};
  }
`;

const Num = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 32px;
  font-weight: 700;
  color: rgba(155, 93, 229, 0.4);
  margin-bottom: 12px;
  letter-spacing: 1px;
`;

const FeatureText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray};
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
            <Label>Core principles</Label>
            <Title>Security<br />Architecture</Title>
            <FeaturesList>
              {features.map(({ num, text }) => (
                <FeatureItem key={num}>
                  <Num>{num}</Num>
                  <FeatureText>{text}</FeatureText>
                </FeatureItem>
              ))}
            </FeaturesList>
          </div>

          <PrivacyBlock>
            <Label>Privacy</Label>
            <Title>Zero Trust<br />by Design</Title>
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
