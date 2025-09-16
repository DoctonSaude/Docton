/**
 * Utilitários para gestão financeira
 */

import { Transaction, Category } from '../hooks/useFinancial';

/**
 * Formatar valor monetário para exibição
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formatar data para exibição
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatar data e hora para exibição
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calcular porcentagem
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Obter cor do status da transação
 */
export const getTransactionStatusColor = (status: string): string => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Traduzir status da transação
 */
export const translateTransactionStatus = (status: string): string => {
  switch (status) {
    case 'paid': return 'Pago';
    case 'pending': return 'Pendente';
    case 'overdue': return 'Vencido';
    default: return status;
  }
};

/**
 * Traduzir tipo de transação
 */
export const translateTransactionType = (type: string): string => {
  switch (type) {
    case 'income': return 'Receita';
    case 'expense': return 'Despesa';
    default: return type;
  }
};

/**
 * Calcular total por categoria
 */
export const calculateCategoryTotals = (transactions: Transaction[], categories: Category[]) => {
  return categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category === category.name);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = categoryTransactions.length;
    
    return {
      ...category,
      total,
      count,
      percentage: 0 // Será calculado depois com o total geral
    };
  });
};

/**
 * Calcular resumo mensal
 */
export const calculateMonthlySummary = (transactions: Transaction[], month: number, year: number) => {
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
  });
  
  const income = monthlyTransactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = monthlyTransactions
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pending = monthlyTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const overdue = monthlyTransactions
    .filter(t => t.status === 'overdue')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    pending,
    overdue,
    transactionCount: monthlyTransactions.length
  };
};

/**
 * Gerar dados para gráfico de fluxo de caixa
 */
export const generateCashFlowData = (transactions: Transaction[], months: number = 6) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
    const summary = calculateMonthlySummary(transactions, date.getMonth(), date.getFullYear());
    
    data.push({
      month: monthName,
      income: summary.income,
      expenses: summary.expenses,
      balance: summary.balance
    });
  }
  
  return data;
};

/**
 * Validar dados de transação
 */
export const validateTransactionData = (data: Partial<Transaction>): string[] => {
  const errors: string[] = [];
  
  if (!data.type) {
    errors.push('Tipo de transação é obrigatório');
  }
  
  if (!data.amount || data.amount <= 0) {
    errors.push('Valor deve ser maior que zero');
  }
  
  if (!data.category?.trim()) {
    errors.push('Categoria é obrigatória');
  }
  
  if (!data.description?.trim()) {
    errors.push('Descrição é obrigatória');
  } else if (data.description.trim().length < 3) {
    errors.push('Descrição deve ter pelo menos 3 caracteres');
  }
  
  if (!data.date) {
    errors.push('Data é obrigatória');
  } else {
    const transactionDate = new Date(data.date);
    const today = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(today.getFullYear() + 1);
    
    if (transactionDate > maxFutureDate) {
      errors.push('Data não pode ser mais de 1 ano no futuro');
    }
  }
  
  return errors;
};

/**
 * Validar dados de categoria
 */
export const validateCategoryData = (data: Partial<Category>): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push('Nome da categoria é obrigatório');
  } else if (data.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!data.type) {
    errors.push('Tipo de categoria é obrigatório');
  }
  
  if (!data.color) {
    errors.push('Cor é obrigatória');
  } else if (!/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.push('Cor deve estar no formato hexadecimal (#RRGGBB)');
  }
  
  if (data.budget && data.budget < 0) {
    errors.push('Orçamento não pode ser negativo');
  }
  
  return errors;
};

/**
 * Exportar transações para CSV
 */
export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  const headers = [
    'Data',
    'Tipo',
    'Categoria',
    'Descrição',
    'Valor',
    'Status',
    'Método de Pagamento',
    'Referência'
  ];
  
  const rows = transactions.map(t => [
    formatDate(t.date),
    translateTransactionType(t.type),
    t.category,
    t.description,
    formatCurrency(t.amount),
    translateTransactionStatus(t.status),
    t.paymentMethod || '',
    t.reference || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transacoes-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exportar transações para JSON
 */
export const exportTransactionsToJSON = (transactions: Transaction[]): void => {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalTransactions: transactions.length,
    transactions: transactions.map(t => ({
      id: t.id,
      data: formatDate(t.date),
      tipo: translateTransactionType(t.type),
      categoria: t.category,
      descricao: t.description,
      valor: t.amount,
      status: translateTransactionStatus(t.status),
      metodoPagamento: t.paymentMethod || '',
      referencia: t.reference || '',
      criadoEm: formatDateTime(t.createdAt)
    }))
  };
  
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `transacoes-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Gerar relatório financeiro completo
 */
export const generateFinancialReport = (transactions: Transaction[], categories: Category[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySummary = calculateMonthlySummary(transactions, currentMonth, currentYear);
  const categoryTotals = calculateCategoryTotals(transactions, categories);
  const cashFlowData = generateCashFlowData(transactions);
  
  // Calcular tendências
  const lastMonthSummary = calculateMonthlySummary(transactions, currentMonth - 1, currentYear);
  const incomeGrowth = lastMonthSummary.income > 0 
    ? ((monthlySummary.income - lastMonthSummary.income) / lastMonthSummary.income) * 100 
    : 0;
  
  const expenseGrowth = lastMonthSummary.expenses > 0 
    ? ((monthlySummary.expenses - lastMonthSummary.expenses) / lastMonthSummary.expenses) * 100 
    : 0;
  
  return {
    period: `${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    summary: {
      ...monthlySummary,
      incomeGrowth,
      expenseGrowth
    },
    categoryBreakdown: categoryTotals,
    cashFlowTrend: cashFlowData,
    alerts: {
      overdueTransactions: transactions.filter(t => t.status === 'overdue').length,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      highExpenseCategories: categoryTotals
        .filter(c => c.budget && c.total > c.budget * 0.8)
        .map(c => c.name)
    },
    generatedAt: new Date().toISOString()
  };
};

/**
 * Calcular projeção financeira
 */
export const calculateFinancialProjection = (transactions: Transaction[], months: number = 3) => {
  const recentTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return transactionDate >= threeMonthsAgo;
  });
  
  const avgMonthlyIncome = recentTransactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0) / 3;
  
  const avgMonthlyExpenses = recentTransactions
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0) / 3;
  
  const projections = [];
  
  for (let i = 1; i <= months; i++) {
    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + i);
    
    projections.push({
      month: projectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      projectedIncome: avgMonthlyIncome,
      projectedExpenses: avgMonthlyExpenses,
      projectedBalance: avgMonthlyIncome - avgMonthlyExpenses
    });
  }
  
  return projections;
};

/**
 * Detectar padrões de gastos
 */
export const detectSpendingPatterns = (transactions: Transaction[]) => {
  const patterns = [];
  
  // Analisar gastos por categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  // Identificar categorias com gastos altos
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    const percentage = (amount / totalExpenses) * 100;
    
    if (percentage > 30) {
      patterns.push({
        type: 'high_category_spending',
        category,
        percentage: percentage.toFixed(1),
        amount,
        message: `${percentage.toFixed(1)}% dos gastos são em ${category}`
      });
    }
  });
  
  // Analisar frequência de transações
  const transactionsByDay = transactions.reduce((acc, t) => {
    const day = new Date(t.date).getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const maxDay = Object.entries(transactionsByDay).reduce((max, [day, count]) => 
    count > max.count ? { day: parseInt(day), count } : max, { day: 0, count: 0 });
  
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  patterns.push({
    type: 'transaction_frequency',
    day: maxDay.day,
    count: maxDay.count,
    message: `Maior atividade financeira às ${dayNames[maxDay.day]}s`
  });
  
  return patterns;
};