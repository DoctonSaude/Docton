import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'admin' | 'user' | 'moderator';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface UserFilters {
  search: string;
  status: string;
  role: string;
  department: string;
  dateRange: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  newThisMonth: number;
  activeToday: number;
}

/**
 * Hook personalizado para gerenciar usuários
 * Fornece funcionalidades CRUD e estatísticas
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuários
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Em produção viria da API
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'João Silva Santos',
          email: 'joao.silva@empresa.com',
          status: 'active',
          role: 'admin',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-01-20T14:22:00Z',
          phone: '(11) 99999-1234',
          department: 'Tecnologia'
        },
        {
          id: '2',
          name: 'Maria Oliveira Costa',
          email: 'maria.oliveira@empresa.com',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-10T09:15:00Z',
          lastLogin: '2024-01-20T16:45:00Z',
          phone: '(11) 98888-5678',
          department: 'Marketing'
        },
        {
          id: '3',
          name: 'Pedro Henrique Lima',
          email: 'pedro.lima@empresa.com',
          status: 'inactive',
          role: 'moderator',
          createdAt: '2024-01-08T14:20:00Z',
          lastLogin: '2024-01-18T11:30:00Z',
          phone: '(11) 97777-9012',
          department: 'Vendas'
        }
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar usuário
  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      setError('Erro ao criar usuário');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar usuário
  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, ...updates }
          : user
      ));
    } catch (err) {
      setError('Erro ao atualizar usuário');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Deletar usuário
  const deleteUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Erro ao deletar usuário');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtrar usuários
  const filterUsers = useCallback((filters: UserFilters): User[] => {
    return users.filter(user => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(searchLower);
        const matchesEmail = user.email.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesEmail) return false;
      }
      
      // Filtro de status
      if (filters.status !== 'all' && user.status !== filters.status) return false;
      
      // Filtro de role
      if (filters.role !== 'all' && user.role !== filters.role) return false;
      
      // Filtro de departamento
      if (filters.department !== 'all' && user.department !== filters.department) return false;
      
      // Filtro de data
      if (filters.dateRange !== 'all') {
        const userDate = new Date(user.createdAt);
        const now = new Date();
        const daysAgo = new Date(now.getTime() - parseInt(filters.dateRange) * 24 * 60 * 60 * 1000);
        if (userDate < daysAgo) return false;
      }
      
      return true;
    });
  }, [users]);

  // Calcular estatísticas
  const getStats = useCallback((): UserStats => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      newThisMonth: users.filter(u => new Date(u.createdAt) >= thisMonth).length,
      activeToday: users.filter(u => u.lastLogin && new Date(u.lastLogin) >= today).length
    };
  }, [users]);

  // Validar dados do usuário
  const validateUser = useCallback((userData: Partial<User>): string[] => {
    const errors: string[] = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('E-mail inválido');
    }
    
    if (userData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(userData.phone)) {
      errors.push('Telefone inválido');
    }
    
    return errors;
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    filterUsers,
    getStats,
    validateUser,
    refreshUsers: fetchUsers
  };
};