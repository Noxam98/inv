import styled from 'styled-components';
import { motion } from 'framer-motion';

const EMAIL_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70dbc4f27a13914a1135_Email%20logo%201%20(1).svg';
const TG_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70dd9016c01fabcdcdb7_telegram%20logo%201%20(1).svg';
const WA_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70d9dda4c0abe487a436_whatsup%20logo%201%20(1).svg';
const YT_ICON = 'https://cdn.prod.website-files.com/692480ace4527d1f718a15fa/692d70d56eed2074c7926dde_youtube%20logo%201%20(1).svg';

const contacts = [
  { icon: EMAIL_ICON, label: 'Email', href: '#', description: 'Send a direct message' },
  { icon: TG_ICON, label: 'Telegram', href: '#', description: 'Fastest response' },
  { icon: WA_ICON, label: 'WhatsApp', href: '#', description: 'Business inquiries' },
  { icon: YT_ICON, label: 'YouTube', href: '#', description: 'Follow our channel' },
];

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 40px 80px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 100px 20px 60px;
    align-items: flex-start;
  }
`;

const Inner = styled.div`
  max-width: 680px;
  width: 100%;
`;

const Heading = styled(motion.h1)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 16px;
`;

const Sub = styled(motion.p)`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 56px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ContactCard = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px 20px;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s, transform 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMid};
    border-color: rgba(155, 93, 229, 0.35);
    transform: translateY(-3px);
  }
`;

const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(155, 93, 229, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.85;
  }
`;

const CardText = styled.div``;

const CardLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 4px;
`;

const CardDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`;

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 + 0.3 },
  }),
};

export default function ChatPage() {
  return (
    <Page>
      <Inner>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          You have paid attention to the project.<br />We are ready to discuss.
        </Heading>
        <Sub
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          If interest in participation is formed, we expect feedback.
        </Sub>
        <Grid>
          {contacts.map(({ icon, label, href, description }, i) => (
            <ContactCard
              key={label}
              href={href}
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{ scale: 1.02 }}
            >
              <IconWrap>
                <img src={icon} alt={label} />
              </IconWrap>
              <CardText>
                <CardLabel>{label}</CardLabel>
                <CardDesc>{description}</CardDesc>
              </CardText>
            </ContactCard>
          ))}
        </Grid>
      </Inner>
    </Page>
  );
}
