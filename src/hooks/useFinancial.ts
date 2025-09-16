import { useState, useEffect, useCallback } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  reference?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon: string;
  budget?: number;
  spent?: number;
}

export interface FinancialSummary {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingPayments: number;
  overduePayments: number;
  cashFlow: number;
  yearToDateIncome: number;
  yearToDateExpenses: number;
}

export interface TransactionFilters {
  type: string;
  category: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  amountMin?: number;
  amountMax?: number;
}

export interface ChartData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

/**
 * Hook personalizado para gerenciar dados financeiros
 * Fornece funcionalidades CRUD para transações e categorias
 */
export const useFinancial = (userId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    pendingPayments: 0,
    overduePayments: 0,
    cashFlow: 0,
    yearToDateIncome: 0,
    yearToDateExpenses: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados financeiros
  const fetchFinancialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Em produção viria da API
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 2800.00,
          category: 'Consultas',
          description: 'Consultas cardiológicas - Janeiro',
          date: '2024-01-20',
          status: 'paid',
          paymentMethod: 'PIX',
          reference: 'REF001',
          createdAt: '2024-01-20T10:30:00Z'
        },
        {
          id: '2',
          type: 'income',
          amount: 1500.00,
          category: 'Exames',
          description: 'Ultrassons abdominais',
          date: '2024-01-19',
          status: 'paid',
          paymentMethod: 'Cartão',
          reference: 'REF002',
          createdAt: '2024-01-19T14:20:00Z'
        },
        {
          id: '3',
          type: 'expense',
          amount: 800.00,
          category: 'Aluguel',
          description: 'Aluguel do consultório',
          date: '2024-01-15',
          status: 'paid',
          paymentMethod: 'Transferência',
          reference: 'REF003',
          createdAt: '2024-01-15T09:00:00Z'
        }
      ];
      
      const mockCategories: Category[] = [
        { id: '1', name: 'Consultas', type: 'income', color: '#10B981', icon: 'Activity', budget: 5000 },
        { id: '2', name: 'Exames', type: 'income', color: '#3B82F6', icon: 'FileText', budget: 3000 },
        { id: '3', name: 'Aluguel', type: 'expense', color: '#EF4444', icon: 'Wallet', budget: 1000 },
        { id: '4', name: 'Equipamentos', type: 'expense', color: '#F59E0B', icon: 'CreditCard', budget: 2000 }
      ];
      
      const mockChartData: ChartData[] = [
        { month: 'Ago', income: 8500, expenses: 3200, balance: 5300 },
        { month: 'Set', income: 9200, expenses: 3800, balance: 5400 },
        { month: 'Out', income: 8800, expenses: 3500, balance: 5300 },
        { month: 'Nov', income: 11200, expenses: 4200, balance: 7000 },
        { month: 'Dez', income: 10100, expenses: 3900, balance: 6200 },
        { month: 'Jan', income: 12400, expenses: 4500, balance: 7900 }
      ];
      
      setTransactions(mockTransactions);
      setCategories(mockCategories);
      setChartData(mockChartData);
      
      // Calcular resumo
      calculateSummary(mockTransactions);
      
    } catch (err) {
      setError('Erro ao carregar dados financeiros');
      console.error('Erro ao buscar dados financeiros:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Calcular resumo financeiro
  const calculateSummary = useCallback((transactionList: Transaction[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactionList.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const yearlyTransactions = transactionList.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentYear;
    });
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingPayments = transactionList
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const overduePayments = transactionList
      .filter(t => t.status === 'overdue')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const yearToDateIncome = yearlyTransactions
      .filter(t => t.type === 'income' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const yearToDateExpenses = yearlyTransactions
      .filter(t => t.type === 'expense' && t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setSummary({
      currentBalance: 25750.00, // Mock value
      monthlyIncome,
      monthlyExpenses,
      pendingPayments,
      overduePayments,
      cashFlow: monthlyIncome - monthlyExpenses,
      yearToDateIncome,
      yearToDateExpenses
    });
  }, []);

  // Criar transação
  const createTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      
      // Validar dados
      const validationErrors = validateTransaction(transactionData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      setTransactions(prev => {
        const updated = [newTransaction, ...prev];
        calculateSummary(updated);
        return updated;
      });
      
      return newTransaction;
    } catch (err) {
      setError('Erro ao criar transação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummary]);

  // Atualizar transação
  const updateTransaction = useCallback(async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTransactions(prev => {
        const updated = prev.map(t => 
          t.id === transactionId 
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        );
        calculateSummary(updated);
        return updated;
      });
    } catch (err) {
      setError('Erro ao atualizar transação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummary]);

  // Deletar transação
  const deleteTransaction = useCallback(async (transactionId: string) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTransactions(prev => {
        const updated = prev.filter(t => t.id !== transactionId);
        calculateSummary(updated);
        return updated;
      });
    } catch (err) {
      setError('Erro ao deletar transação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [calculateSummary]);

  // Criar categoria
  const createCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString()
      };
      
      setCategories(prev => [...prev, newCategory]);
      
      return newCategory;
    } catch (err) {
      setError('Erro ao criar categoria');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar categoria
  const updateCategory = useCallback(async (categoryId: string, updates: Partial<Category>) => {
    try {
      setIsLoading(true);
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, ...updates } : c
      ));
    } catch (err) {
      setError('Erro ao atualizar categoria');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Deletar categoria
  const deleteCategory = useCallback(async (categoryId: string) => {
    try {
      setIsLoading(true);
      
      // Verificar se categoria está sendo usada
      const isUsed = transactions.some(t => {
        const category = categories.find(c => c.id === categoryId);
        return category && t.category === category.name;
      });
      
      if (isUsed) {
        throw new Error('Não é possível excluir categoria que possui transações');
      }
      
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      setError('Erro ao deletar categoria');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [transactions, categories]);

  // Filtrar transações
  const filterTransactions = useCallback((filters: TransactionFilters): Transaction[] => {
    return transactions.filter(transaction => {
      // Filtro por tipo
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }
      
      // Filtro por categoria
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }
      
      // Filtro por status
      if (filters.status !== 'all' && transaction.status !== filters.status) {
        return false;
      }
      
      // Filtro por data
      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }
      
      if (filters.dateTo && transaction.date > filters.dateTo) {
        return false;
      }
      
      // Filtro por valor
      if (filters.amountMin && transaction.amount < filters.amountMin) {
        return false;
      }
      
      if (filters.amountMax && transaction.amount > filters.amountMax) {
        return false;
      }
      
      // Filtro por busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesDescription = transaction.description.toLowerCase().includes(searchLower);
        const matchesCategory = transaction.category.toLowerCase().includes(searchLower);
        const matchesReference = transaction.reference?.toLowerCase().includes(searchLower);
        
        if (!matchesDescription && !matchesCategory && !matchesReference) {
          return false;
        }
      }
      
      return true;
    });
  }, [transactions]);

  // Validar transação
  const validateTransaction = useCallback((transaction: Partial<Transaction>): string[] => {
    const errors: string[] = [];
    
    if (!transaction.type) {
      errors.push('Tipo é obrigatório');
    }
    
    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }
    
    if (!transaction.category?.trim()) {
      errors.push('Categoria é obrigatória');
    }
    
    if (!transaction.description?.trim()) {
      errors.push('Descrição é obrigatória');
    }
    
    if (!transaction.date) {
      errors.push('Data é obrigatória');
    }
    
    return errors;
  }, []);

  // Exportar dados
  const exportData = useCallback((format: 'csv' | 'json', data: Transaction[]) => {
    const exportData = data.map(t => ({
      Data: new Date(t.date).toLocaleDateString('pt-BR'),
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Categoria: t.category,
      Descrição: t.description,
      Valor: t.amount,
      Status: t.status,
      'Método de Pagamento': t.paymentMethod || '',
      Referência: t.reference || ''
    }));
    
    if (format === 'csv') {
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacoes-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacoes-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  }, []);

  // Obter alertas financeiros
  const getFinancialAlerts = useCallback(() => {
    const alerts = [];
    
    // Contas vencidas
    const overdueCount = transactions.filter(t => t.status === 'overdue').length;
    if (overdueCount > 0) {
      alerts.push({
        type: 'error',
        title: 'Contas Vencidas',
        message: `${overdueCount} conta${overdueCount > 1 ? 's' : ''} vencida${overdueCount > 1 ? 's' : ''}`,
        count: overdueCount
      });
    }
    
    // Contas a vencer
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueSoonCount = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.status === 'pending' && transactionDate >= today && transactionDate <= nextWeek;
    }).length;
    
    if (dueSoonCount > 0) {
      alerts.push({
        type: 'warning',
        title: 'Contas a Vencer',
        message: `${dueSoonCount} conta${dueSoonCount > 1 ? 's' : ''} vence${dueSoonCount > 1 ? 'm' : ''} nos próximos 7 dias`,
        count: dueSoonCount
      });
    }
    
    // Meta de receita
    if (summary.cashFlow > 0) {
      alerts.push({
        type: 'success',
        title: 'Meta Atingida',
        message: 'Fluxo de caixa positivo este mês',
        count: 0
      });
    }
    
    return alerts;
  }, [transactions, summary]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return {
    transactions,
    categories,
    summary,
    chartData,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    updateCategory,
    deleteCategory,
    filterTransactions,
    validateTransaction,
    exportData,
    getFinancialAlerts,
    refreshData: fetchFinancialData
  };
};