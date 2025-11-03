
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  // Check if user is authenticated and if their role is in the allowedRoles array
  const isAuthorized = user && allowedRoles.includes(user.role || '');

  return isAuthorized ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;
