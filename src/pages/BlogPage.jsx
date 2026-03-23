import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VideoGuides from '../components/VideoGuides';

const posts = [
  {
    slug: 'networking-for-business-success',
    title: 'The Power of Networking in Business',
    date: 'October 5, 2023',
    excerpt: 'Networking is a powerful tool for business growth. Building genuine relationships with peers, mentors, and industry leaders opens doors that skills alone cannot.',
  },
  {
    slug: 'financial-management-tips',
    title: 'Financial Management Tips for Small Businesses',
    date: 'October 4, 2023',
    excerpt: 'Cash flow management is essential for maintaining business operations. Learn the key strategies used by leading fintech founders.',
  },
  {
    slug: 'digital-marketing-trends-2023',
    title: 'Top Digital Marketing Trends for Businesses',
    date: 'October 3, 2023',
    excerpt: 'Consumers expect personalized experiences. Hyper-personalization powered by AI is no longer optional — it is the baseline.',
  },
  {
    slug: 'blockchain-privacy-deep-dive',
    title: 'Blockchain Privacy: A Deep Dive',
    date: 'September 28, 2023',
    excerpt: 'Most blockchains are pseudonymous, not anonymous. We break down the difference and why it matters for financial sovereignty.',
  },
  {
    slug: 'decentralized-wallets-explained',
    title: 'Decentralized Wallets: What You Need to Know',
    date: 'September 20, 2023',
    excerpt: 'Non-custodial wallets put you in full control of your keys — and your funds. Here is everything you need to know before you start.',
  },
  {
    slug: 'kyc-alternatives',
    title: 'KYC-Free Finance: Is It Possible?',
    date: 'September 12, 2023',
    excerpt: 'The future of finance is permissionless. We explore the technical and ethical foundations of KYC-free systems.',
  },
];

const Page = styled.div`
  min-height: 100vh;
  padding: 120px 40px 80px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 20px 60px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Tag = styled(motion.span)`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentLight};
  margin-bottom: 8px;
`;

const Title = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(36px, 5vw, 72px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: ${({ theme }) => theme.colors.white};
`;

const ScrollBox = styled(motion.div)`
  height: 50vh;
  min-height: 320px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 8px;

  /* custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 93, 229, 0.4) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(155, 93, 229, 0.4);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(155, 93, 229, 0.7);
  }
`;

const PostCard = styled(motion.article)`
  border-radius: 12px;
  overflow: hidden;
  transition: background 0.2s, border-color 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: rgba(88, 19, 133, 0.1);
    border-color: rgba(155, 93, 229, 0.2);
  }

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 0;

    &:hover {
      border-radius: 12px;
    }
  }
`;

const PostLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 12px;
    padding: 16px;
  }
`;

const PostDate = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.grayDark};
  text-transform: uppercase;
  flex-shrink: 0;
  width: 110px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const PostContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PostTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: 0.3px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;

  ${PostCard}:hover & {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const PostExcerpt = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Arrow = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.gray};
  flex-shrink: 0;
  transition: color 0.2s, transform 0.2s;

  ${PostCard}:hover & {
    color: ${({ theme }) => theme.colors.accentLight};
    transform: translateX(5px);
  }
`;

const cardVariant = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.35, delay: i * 0.07 },
  }),
};

export default function BlogPage() {
  return (
    <Page>
      <Header>
        <Tag
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          N E W S
        </Tag>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Blog
        </Title>
      </Header>

      <ScrollBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {posts.map(({ slug, title, date, excerpt }, i) => (
          <PostCard
            key={slug}
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <PostLink to={`/blog/${slug}`}>
              <PostDate>{date}</PostDate>
              <PostContent>
                <PostTitle>{title}</PostTitle>
                <PostExcerpt>{excerpt}</PostExcerpt>
              </PostContent>
              <Arrow>→</Arrow>
            </PostLink>
          </PostCard>
        ))}
      </ScrollBox>

      <VideoGuides />
    </Page>
  );
}
