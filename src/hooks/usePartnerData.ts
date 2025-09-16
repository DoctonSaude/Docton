import { useState, useEffect } from 'react';

interface PartnerMetrics {
  appointments: number;
  revenue: number;
  patients: number;
  occupancyRate: number;
}

interface PartnerData {
  metrics: PartnerMetrics;
  chartData: any[];
  transactions: any[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date;
}

/**
 * Hook personalizado para gerenciar dados do dashboard do parceiro
 * Simula integração com API e atualização em tempo real
 */
export const usePartnerData = (partnerId: string, filters: any) => {
  const [data, setData] = useState<PartnerData>({
    metrics: {
      appointments: 0,
      revenue: 0,
      patients: 0,
      occupancyRate: 0
    },
    chartData: [],
    transactions: [],
    isLoading: true,
    error: null,
    lastUpdate: new Date()
  });

  // Simulação de chamada à API
  const fetchPartnerData = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data baseado nos filtros
      const mockData = {
        metrics: {
          appointments: Math.floor(Math.random() * 200) + 50,
          revenue: Math.floor(Math.random() * 20000) + 5000,
          patients: Math.floor(Math.random() * 150) + 30,
          occupancyRate: Math.floor(Math.random() * 40) + 60
        },
        chartData: generateChartData(),
        transactions: generateTransactions(),
        isLoading: false,
        error: null,
        lastUpdate: new Date()
      };
      
      setData(mockData);
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar dados do parceiro'
      }));
    }
  };

  // Gera dados do gráfico baseado no período selecionado
  const generateChartData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => ({
      month,
      appointments: Math.floor(Math.random() * 30) + 40,
      revenue: Math.floor(Math.random() * 5000) + 8000
    }));
  };

  // Gera transações mock
  const generateTransactions = () => {
    const types = ['appointment', 'payment', 'service'];
    const statuses = ['completed', 'pending', 'cancelled'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `trans_${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      description: `Transação ${i + 1}`,
      amount: Math.floor(Math.random() * 500) + 50,
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  };

  // Atualização automática dos dados
  useEffect(() => {
    fetchPartnerData();
    
    // Configura atualização automática a cada 30 segundos
    const interval = setInterval(() => {
      setData(prev => ({ ...prev, lastUpdate: new Date() }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [partnerId, filters]);

  // Função para forçar atualização
  const refreshData = () => {
    fetchPartnerData();
  };

  return {
    ...data,
    refreshData
  };
};