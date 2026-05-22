import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedDiv } from '../components/AnimatedSection';
import { fadeUp } from '../utils/animations';

const SAFE_LOGO = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/69282444c1ad22c4373085d1_s%20donation%202.svg';

const ETH_ADDRESS = '0xd0a48a8C8a09dE30e9037c9060468A028aA99FF9';

const Page = styled.div`
  min-height: 100vh;
  padding: 120px 40px 80px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 20px 60px;
  }
`;

const Greeting = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4vw, 56px);
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 48px;

  span {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const Block = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 40px 44px;
  margin-bottom: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 20px;
  }
`;

const Para = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 16px;

  strong { color: ${({ theme }) => theme.colors.white}; }

  &:last-child { margin-bottom: 0; }
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  display: block;
  margin-bottom: 16px;
`;

const AddressBlock = styled.div`
  background: ${({ theme }) => theme.colors.bgSection};
  border: 1px solid rgba(155, 93, 229, 0.3);
  border-radius: 12px;
  padding: 20px 24px;
  margin-top: 20px;
`;

const AddressLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  margin-bottom: 10px;
`;

const Address = styled.div`
  font-size: 14px;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.white};
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CopyBtn = styled.button`
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  border: 1px solid rgba(155, 93, 229, 0.3);
  padding: 4px 12px;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 0.2s;
  cursor: pointer;
  background: none;
  font-family: inherit;

  &:hover { background: rgba(155, 93, 229, 0.1); }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ListItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray};

  &::before {
    content: '›';
    color: ${({ theme }) => theme.colors.accentLight};
    flex-shrink: 0;
    font-size: 16px;
    margin-top: 1px;
  }
`;

const SafeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const SafeLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  border: 1px solid rgba(155, 93, 229, 0.3);
  padding: 10px 24px;
  border-radius: 12px;
  transition: background 0.2s;
  display: inline-block;

  &:hover { background: rgba(155, 93, 229, 0.1); }
`;

const FollowBlock = styled(Block)`
  background: linear-gradient(135deg, rgba(88,19,133,0.2), rgba(88,19,133,0.05));
  border-color: rgba(155, 93, 229, 0.2);
`;

const FollowItem = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray};
  padding-left: 20px;
  position: relative;
  margin-bottom: 14px;

  &::before {
    content: '${({ n }) => n}';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.accentLight};
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 13px;
  }
`;

const Signature = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
  margin-top: 32px;
  font-style: italic;
`;

function handleCopy() {
  navigator.clipboard.writeText(ETH_ADDRESS);
}

export default function InvestPage() {
  return (
    <Page>
      <Greeting
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Dear <span>Investor,</span>
      </Greeting>

      <AnimatedDiv variants={fadeUp}>
        <Block>
          <Label>Pre-financing stage</Label>
          <Para>
            We hereby inform you that at this stage of the project development{' '}
            <strong>INDS (Invite D Security)</strong> we offer a transparent and secure way to
            pre-process financing, until the legal registration of the project.
          </Para>
          <Para>
            This approach allows you to quickly raise funds without the cost of legal registration
            at the start and ensures the protection of the interests of both parties through
            technical and documentary measures.
          </Para>
          <Para>For this purpose, the following is used:</Para>

          <AddressBlock>
            <AddressLabel>Personal address · Ethereum:</AddressLabel>
            <Address>
              <span>{ETH_ADDRESS}</span>
              <CopyBtn onClick={handleCopy}>Copy</CopyBtn>
            </Address>
          </AddressBlock>
        </Block>
      </AnimatedDiv>

      <AnimatedDiv variants={fadeUp} custom={1}>
        <Block>
          <SafeRow>
            <img src={SAFE_LOGO} alt="Safe" style={{ width: 40, opacity: 0.9 }} />
            <div>
              <Label style={{ marginBottom: 4 }}>
                <a href="https://safe.global" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                  safe.global
                </a>{' '}provides:
              </Label>
            </div>
          </SafeRow>
          <Grid2 style={{ marginTop: 20 }}>
            <ListItem>
              Joint control of funds: any transactions are possible only with the confirmation of
              all participants (2 out of 2)
            </ListItem>
            <ListItem>
              Inability to withdraw or use funds without mutual consent
            </ListItem>
            <ListItem>
              High level of security and independence from centralized platforms
            </ListItem>
            <ListItem>
              Investment volume and refund mechanisms in case of non-fulfillment of conditions
            </ListItem>
          </Grid2>

          <Grid2 style={{ marginTop: 12 }}>
            <ListItem>Intended investor rights</ListItem>
            <ListItem>Purpose and terms of use of funds</ListItem>
          </Grid2>

          <div style={{ marginTop: 24 }}>
            <SafeLink href="https://safe.global" target="_blank" rel="noreferrer">
              Open Safe.global →
            </SafeLink>
          </div>
        </Block>
      </AnimatedDiv>

      <AnimatedDiv variants={fadeUp} custom={2}>
        <FollowBlock>
          <Label>Follow up</Label>
          <FollowItem n="1.">
            The funds will be officially transferred to the company's account and legally formalized.
          </FollowItem>
          <FollowItem n="2.">
            After collecting the minimum investment capital, a legal entity will be registered.
          </FollowItem>
          <FollowItem n="3.">
            You will receive the status of an early investor with fixed rights, according to the
            following legal agreement.
          </FollowItem>

          <Signature>
            Sincerely,<br />
            Project team INDS
          </Signature>
        </FollowBlock>
      </AnimatedDiv>
    </Page>
  );
}
