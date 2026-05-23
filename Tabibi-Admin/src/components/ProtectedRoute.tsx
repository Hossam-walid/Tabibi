import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role, isAdmin } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    let defaultPath = '/login';
    if (role === 'RECEPTIONIST') {
      defaultPath = '/reception-appointments';
    } else if (role === 'DOCTOR') {
      defaultPath = '/doctor-dashboard';
    } else if (role === 'ADMIN' || role === 'OWNER') {
      defaultPath = '/admin-dashboard';
    } else if (role === 'MEMBER') {
      defaultPath = '/';
    }

    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
