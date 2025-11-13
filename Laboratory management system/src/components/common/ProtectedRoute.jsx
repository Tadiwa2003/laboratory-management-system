import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { canAccess } from '../../utils/roles';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !canAccess(user, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

