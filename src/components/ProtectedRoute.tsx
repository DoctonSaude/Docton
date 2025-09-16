import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Props = {
  allowedRoles: Array<'admin' | 'partner' | 'patient'>
  layout?: React.ReactElement
}

export function ProtectedRoute({ allowedRoles, layout }: Props) {
  const { user, role, loading } = useAuth()

  if (loading) return <div className="p-8 text-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/login" replace />

  const content = <Outlet />
  return layout ? React.cloneElement(layout, {}, content) : content
}
