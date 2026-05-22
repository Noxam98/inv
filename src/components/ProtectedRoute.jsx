import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const session = useAuthStore((s) => s.session);
  const ready = useAuthStore((s) => s.ready);
  const location = useLocation();

  if (!ready) return null;

  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }


  return children;
}
