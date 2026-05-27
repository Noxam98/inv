import { Navigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuthStore } from '../store/authStore';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(0.9) translate(-50%, -50%); opacity: 0.5; }
  50% { transform: scale(1.1) translate(-50%, -50%); opacity: 0.8; }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #07010f;
  z-index: 9999;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid rgba(199, 125, 255, 0.1);
  border-top-color: #c77dff;
  border-radius: 50%;
  animation: ${rotate} 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  box-shadow: 0 0 20px rgba(199, 125, 255, 0.15);
`;

const GlowingOrb = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(155, 93, 229, 0.22) 0%, rgba(88, 19, 133, 0) 70%);
  border-radius: 50%;
  filter: blur(24px);
  animation: ${pulse} 2s ease-in-out infinite;
  pointer-events: none;
`;

const LoaderText = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.25em;
  color: #c77dff;
  text-transform: uppercase;
  opacity: 0.75;
  margin-top: 10px;
`;

export default function ProtectedRoute({ children }) {
  const session = useAuthStore((s) => s.session);
  const ready = useAuthStore((s) => s.ready);
  const location = useLocation();

  if (!ready) {
    return (
      <LoaderOverlay>
        <GlowingOrb />
        <Spinner />
        <LoaderText>Verifying identity...</LoaderText>
      </LoaderOverlay>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  return children;
}

