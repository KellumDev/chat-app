import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, token } = useAppSelector((state) => state.auth);
  if (!user || !token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
