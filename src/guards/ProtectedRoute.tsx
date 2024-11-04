// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
