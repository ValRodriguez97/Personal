import { Navigate, Outlet } from 'react-router-dom';
import { useRole } from '@/app/context/RoleContext';

export function ProtectedRoute() {
  const { isAuthenticated } = useRole();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
