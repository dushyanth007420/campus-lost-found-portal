import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Verifying administrative access...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
