import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileVideo } from 'lucide-react';
import { AnimatedDiv, fadeUp } from './AnimatedSection';
import { videos } from '../data/videos';

const Section = styled.section`
  padding: 60px 0 0;
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
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 24px;
`;

const List = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled(motion.create(Link))`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  border-radius: 18px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: background 0.25s, border-color 0.25s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 0% 50%, rgba(88, 19, 133, 0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(155, 93, 229, 0.35);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 16px;
    padding: 16px 18px;
  }
`;

const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2a1a6e 0%, #1a0f4a 100%);
  border: 1px solid rgba(100, 80, 220, 0.4);
  box-shadow:
    0 4px 20px rgba(60, 30, 180, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #7b9fff;
  transition: box-shadow 0.25s, transform 0.25s;

  ${Card}:hover & {
    box-shadow:
      0 6px 28px rgba(100, 60, 220, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const VideoLabel = styled.div`
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(155, 93, 229, 0.7);
  margin-bottom: 4px;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const VideoTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;

  ${Card}:hover & {
    color: ${({ theme }) => theme.colors.accentLight};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 15px;
  }
`;

const VideoMeta = styled.div`
  font-size: 12px;
  color: rgba(178, 178, 178, 0.5);
  font-family: monospace;
`;

const ArrowWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: rgba(178, 178, 178, 0.4);
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;

  ${Card}:hover & {
    border-color: rgba(155, 93, 229, 0.5);
    color: ${({ theme }) => theme.colors.accentLight};
    transform: translateX(3px);
  }
`;

const itemVariant = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
};

export default function VideoGuides() {
  return (
    <Section>
      <AnimatedDiv variants={fadeUp}>
        <Title>How to get started</Title>
      </AnimatedDiv>

      <List
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {videos.map(({ id, title, duration, label }, i) => (
          <Card key={id} to={`/video/${id}`} variants={itemVariant} custom={i}>
            <IconWrap>
              <FileVideo size={32} strokeWidth={1.2} />
            </IconWrap>
            <Info>
              <VideoLabel>{label}</VideoLabel>
              <VideoTitle>{title}</VideoTitle>
              <VideoMeta>{duration}</VideoMeta>
            </Info>
            <ArrowWrap>→</ArrowWrap>
          </Card>
        ))}
      </List>
    </Section>
  );
}
