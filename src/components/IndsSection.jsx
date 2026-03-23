import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnimatedDiv, StaggerDiv, fadeUp, slideLeft, slideRight } from './AnimatedSection';

const Section = styled.section`
  padding: 100px 40px;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  display: block;
  margin-bottom: 24px;
`;

const Question = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(40px, 5vw, 80px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1;
  letter-spacing: 2px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Para = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray};

  strong {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 20px 0;
`;

export default function IndsSection() {
  return (
    <Section>
      <Grid>
        <AnimatedDiv variants={slideLeft}>
          <Label>What is INDS?</Label>
          <Question>INDS ?</Question>
        </AnimatedDiv>
        <AnimatedDiv variants={slideRight}>
          <Body>
            <Para>
              <strong>INDS is</strong> not just a wallet or blockchain, but the basis for a new
              ethical standard of digital freedom. We combine the strongest points of anonymity,
              security, and control — excluding everything weak that prevented crypto finance from
              being mature.
            </Para>
            <Divider />
            <Para>
              The path will be difficult, but the result is an untouchable system that is not
              subject to any source of power except its owner.
            </Para>
          </Body>
        </AnimatedDiv>
      </Grid>
    </Section>
  );
}
