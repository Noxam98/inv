import { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const VIEWPORT = { once: true, margin: '-60px' };
const LABEL_INITIAL = { opacity: 0, y: 8 };
const LABEL_VISIBLE = { opacity: 1, y: 0 };
const LABEL_TRANSITION = { duration: 0.5 };

const cardEnter = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Section = styled.section`
  position: relative;
`;

const Label = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Card = styled(motion.create(Link))`
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 22px 22px 18px;
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(60, 20, 110, 0.32), rgba(15, 5, 30, 0.55));
  border: 1px solid rgba(155, 93, 229, 0.18);
  text-decoration: none;
  overflow: hidden;
  transition: border-color 0.25s, background 0.25s;
  min-height: 130px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 0%, rgba(155, 93, 229, 0.18) 0%, transparent 60%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(180, 130, 255, 0.45);
    background: linear-gradient(160deg, rgba(80, 30, 140, 0.42), rgba(20, 8, 45, 0.65));
  }
`;

const Icon = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2a1066 0%, #170840 100%);
  border: 1px solid rgba(120, 80, 220, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(180, 150, 255, 0.95);
  box-shadow:
    0 6px 20px rgba(60, 30, 180, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;

const IconLabel = styled.span`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.55);
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`;

const CardTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: 17px;
  letter-spacing: 0.3px;
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.25s;

  ${Card}:hover & { color: ${({ theme }) => theme.colors.accentLight}; }
`;

const CardDate = styled.span`
  font-size: 12px;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.45);
`;

const OpenPill = styled.span`
  align-self: flex-start;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(155, 93, 229, 0.3);
  border-radius: 999px;
  padding: 6px 18px;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.25s, color 0.25s, border-color 0.25s;
  margin-top: 4px;

  ${Card}:hover & {
    background: rgba(120, 60, 200, 0.25);
    color: ${({ theme }) => theme.colors.accentLight};
    border-color: rgba(180, 130, 255, 0.55);
  }
`;

function LatestGrid({ articles }) {
  return (
    <Section>
      <Label
        initial={LABEL_INITIAL}
        whileInView={LABEL_VISIBLE}
        viewport={VIEWPORT}
        transition={LABEL_TRANSITION}
      >
        Latest
      </Label>

      <Grid>
        {articles.map((a, i) => (
          <Card
            key={a.slug}
            to={`/blog/${a.slug}`}
            variants={cardEnter}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            custom={i}
          >
            <Icon>
              <FileText size={28} strokeWidth={1.4} />
              <IconLabel>Article</IconLabel>
            </Icon>
            <Body>
              <CardTitle>{a.title}</CardTitle>
              <CardDate>{a.date}</CardDate>
              <OpenPill>open</OpenPill>
            </Body>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

export default memo(LatestGrid);
