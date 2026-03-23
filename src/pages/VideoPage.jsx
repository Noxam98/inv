import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { videos } from '../data/videos';

const Page = styled.div`
  min-height: 100vh;
  padding: 120px 40px 80px;
  max-width: 960px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 20px 60px;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 40px;
  transition: color 0.2s;

  &:hover { color: ${({ theme }) => theme.colors.white}; }
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

const Title = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
  line-height: 1.2;
`;

const Meta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 36px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.grayDark};
`;

const VideoWrap = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: #0a0015;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 40px;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Description = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 32px 36px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 20px;
  }
`;

const DescLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  margin-bottom: 16px;
`;

const DescText = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.gray};
  white-space: pre-line;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 120px 20px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 18px;
`;

export default function VideoPage() {
  const { id } = useParams();
  const video = videos.find((v) => v.id === id);

  if (!video) {
    return (
      <NotFound>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
        Video not found.{' '}
        <Link to="/blog" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Back to Blog
        </Link>
      </NotFound>
    );
  }

  return (
    <Page>
      <Back to="/blog">← Back to blog</Back>

      <Label>{video.label}</Label>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {video.title}
      </Title>
      <Meta>
        <MetaItem>{video.date}</MetaItem>
        <MetaItem>·</MetaItem>
        <MetaItem>{video.duration}</MetaItem>
      </Meta>

      <VideoWrap
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </VideoWrap>

      <Description
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <DescLabel>About this video</DescLabel>
        <DescText>{video.description}</DescText>
      </Description>
    </Page>
  );
}
