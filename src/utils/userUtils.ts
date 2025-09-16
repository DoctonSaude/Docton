/**
 * Utilitários para gerenciamento de usuários
 */

import { User } from '../hooks/useUsers';

/**
 * Formatar telefone automaticamente
 */
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
  }
  
  return value;
};

/**
 * Validar e-mail
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ... (outras funções existentes podem permanecer) ...

/**
 * Obter cor do status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Obter cor do papel
 */
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800';
    case 'moderator': return 'bg-blue-100 text-blue-800';
    case 'user': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Traduzir status
 */
export const translateStatus = (status: string): string => {
  switch (status) {
    case 'active': return 'Ativo';
    case 'inactive': return 'Inativo';
    case 'pending': return 'Pendente';
    default: return status;
  }
};

/**
 * Traduzir papel
 */
export const translateRole = (role: string): string => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'moderator': return 'Moderador';
    case 'user': return 'Usuário';
    default: return role;
  }
};

/**
 * Exportar usuários para CSV
 */
export const exportUsersToCSV = (users: User[]): void => {
  const headers = ['ID', 'Nome', 'Email', 'Status', 'Papel'];
  const rows = users.map(user => [
    user.id,
    user.name,
    user.email,
    translateStatus(user.status),
    translateRole(user.role)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `usuarios-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};