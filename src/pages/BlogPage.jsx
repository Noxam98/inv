import styled from 'styled-components';
import { motion } from 'framer-motion';
import { articles } from '../data/articles';
import BlogCarousel from '../components/BlogCarousel';
import LatestGrid from '../components/LatestGrid';

const Page = styled.div`
  min-height: 100vh;
  padding: 140px 40px 100px;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 110px 16px 60px;
  }
`;

const NewsTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 300;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: clamp(20px, 6vw, 80px);
  text-indent: clamp(20px, 6vw, 80px);
  text-align: center;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 48px;
  line-height: 1;
`;

export default function BlogPage() {
  return (
    <Page>
      <NewsTitle
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        News
      </NewsTitle>
      <BlogCarousel articles={articles} />
      <LatestGrid articles={articles} />
    </Page>
  );
}
