import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  allowedRoles: Array<'admin' | 'partner' | 'patient' | 'guest'>
};

export function ProtectedRoute({ allowedRoles }: Props) {
  const { role, loading } = useAuth();

  if (loading) {
    return null; // O App.tsx já mostra um ecrã de "a carregar"
  }

  const userIsAuthenticated = !!role;

  // Se a rota é para convidados ('guest') e o utilizador está logado, redireciona
  if (allowedRoles.includes('guest') && userIsAuthenticated) {
    // Redireciona para o dashboard correto baseado no papel do utilizador
    return <Navigate to={`/${role}`} replace />;
  }

  // Se a rota é protegida e o utilizador não tem o papel correto, redireciona
  if (!allowedRoles.includes('guest') && (!userIsAuthenticated || !allowedRoles.includes(role))) {
    return <Navigate to="/login" replace />;
  }

  // Se tudo estiver correto, renderiza a próxima rota/página
  return <Outlet />;
}
