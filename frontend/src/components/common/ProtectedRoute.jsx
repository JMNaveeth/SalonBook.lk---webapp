import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
