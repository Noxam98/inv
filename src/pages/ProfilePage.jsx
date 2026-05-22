import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 40px;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 48px 56px;
  text-align: center;
  max-width: 440px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 32px 24px;
  }
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceHigh};
  border: 1px solid rgba(155, 93, 229, 0.3);
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const IdLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 8px;
`;

const IdValue = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 36px;
  font-family: monospace;
`;

const LogoutBtn = styled(motion.button)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  background: rgba(220, 60, 60, 0.12);
  border: 1px solid rgba(220, 60, 60, 0.3);
  padding: 12px 32px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(220, 60, 60, 0.22);
  }
`;

export default function ProfilePage() {
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);

  // Extract anonymous handle from the user's email if present
  const email = session?.user?.email;
  const userHandle = email ? email.split('@')[0] : 'anonymous';

  return (
    <Page>
      <Card
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Avatar>👤</Avatar>
        <IdLabel>Your ID</IdLabel>
        <IdValue>{userHandle}</IdValue>
        <LogoutBtn whileTap={{ scale: 0.97 }} onClick={signOut}>
          Log Out
        </LogoutBtn>
      </Card>
    </Page>
  );
}

