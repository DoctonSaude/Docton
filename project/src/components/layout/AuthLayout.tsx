import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../ui/Logo';

export const AuthLayout: React.FC = () => {
  const { user } = useAuth();

  // If user is already authenticated, redirect to appropriate dashboard
  if (user) {
    if (user.role === 'patient') return <Navigate to="/patient/dashboard" />;
    if (user.role === 'professional') return <Navigate to="/professional/dashboard" />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Logo size="large" />
        </div>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <Outlet />
        </div>
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 Docton. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};