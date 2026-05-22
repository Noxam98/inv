import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articles } from '../data/articles';

const Page = styled.div`
  min-height: 100vh;
  padding: 120px 40px 80px;
  max-width: 800px;
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
  font-size: clamp(28px, 4.5vw, 52px);
  font-weight: 600;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 16px;
  line-height: 1.15;
`;

const Meta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 48px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.grayDark};
`;

const ArticleBody = styled(motion.article)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 44px 48px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 28px 20px;
  }
`;

const Excerpt = styled.p`
  font-size: 17px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 28px;
  font-weight: 300;
  border-left: 2px solid ${({ theme }) => theme.colors.accent};
  padding-left: 20px;
`;

const Paragraph = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 120px 20px;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 18px;
`;

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <NotFound>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
        Article not found.{' '}
        <Link to="/blog" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Back to Blog
        </Link>
      </NotFound>
    );
  }

  // Fallback rich content body
  const paragraph1 = `In a digital ecosystem where privacy is typically treated as an after-thought, the INDS architecture provides a refreshing alternative by building decentralized sovereignty directly into the core code. Our approach shifts from the typical 'trust-based' web-services model to a mathematically verified system that puts full control back into the hands of the end-user.`;

  const paragraph2 = `This milestone represents a major step forward in establishing our roadmap. By focusing on air-gapped cryptographic signing, offline key management, and protocol-level anonymity, the initial development phases eliminate the typical threats and single points of failure present in traditional fintech operations.`;

  const paragraph3 = `As we move closer to our subsequent milestones, we will continue our rigorous technical audits and verification processes. We believe that secure financial environments are not just a luxury, but a fundamental digital right for individuals globally. Stay tuned for future developer previews and technical updates.`;

  return (
    <Page>
      <Back to="/blog">← Back to blog</Back>

      <Label>{article.label}</Label>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {article.title}
      </Title>
      <Meta>
        <MetaItem>{article.date}</MetaItem>
        <MetaItem>·</MetaItem>
        <MetaItem>Read time: 3 mins</MetaItem>
      </Meta>

      <ArticleBody
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Excerpt>{article.excerpt}</Excerpt>
        <Paragraph>{paragraph1}</Paragraph>
        <Paragraph>{paragraph2}</Paragraph>
        <Paragraph>{paragraph3}</Paragraph>
      </ArticleBody>
    </Page>
  );
}
