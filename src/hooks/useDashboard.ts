import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Users, Briefcase, CreditCard, AlertTriangle } from 'lucide-react';

// 1. Adicionamos a propriedade `boardMeeting` à nossa interface
interface DashboardData {
  metrics: any[];
  chartData: any[];
  tableData: any[];
  notifications: any[];
  todoList: any[];
  formationStatus: any;
  boardMeeting: any; // <-- ADICIONADO
}

interface DashboardFilters {
  dateRange: string;
  category: string;
  status: string;
  search: string;
}

interface DashboardPreferences {
  autoRefresh: boolean;
  refreshInterval: number;
  visibleMetrics: string[];
  tablePageSize: number;
  sidebarCollapsed: boolean;
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>({
    metrics: [],
    chartData: [],
    tableData: [],
    notifications: [],
    todoList: [],
    formationStatus: {},
    boardMeeting: {}, // <-- ADICIONADO
  });
  
  // O resto do hook não precisa de alterações, apenas o objeto mockData
  const [filters, setFilters] = useState<DashboardFilters>({ dateRange: '30', category: 'all', status: 'all', search: '' });
  const [preferences, setPreferences] = useState<DashboardPreferences>({ autoRefresh: true, refreshInterval: 300000, visibleMetrics: ['revenue', 'users', 'employees', 'spending', 'overdue'], tablePageSize: 10, sidebarCollapsed: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setIsLoading(true);
      setError(null);
      const cacheKey = `dashboard-${JSON.stringify(filters)}`;
      if (useCache && cache.has(cacheKey)) {
        setData(cache.get(cacheKey));
        setLastUpdate(new Date());
        setIsLoading(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: DashboardData = {
        metrics: [
          { id: 'revenue', title: 'Bank balance', value: 'R$ 143.624', change: 12.5, changeType: 'positive', trend: [65, 78, 82, 95, 88, 92, 100], color: 'bg-blue-500', icon: DollarSign },
          { id: 'users', title: 'New clients', value: '8.549', change: 8.2, changeType: 'positive', trend: [45, 52, 48, 61, 55, 67, 73], color: 'bg-green-500', icon: Users },
          { id: 'employees', title: 'Employees', value: '1.234', change: 2.1, changeType: 'positive', trend: [85, 78, 82, 75, 88, 72, 68], color: 'bg-indigo-500', icon: Briefcase },
          { id: 'spending', title: 'Card spending', value: 'R$ 12.450', change: -5.1, changeType: 'negative', trend: [25, 28, 32, 35, 38, 42, 45], color: 'bg-orange-500', icon: CreditCard },
          { id: 'overdue', title: 'Invoices overdue', value: '6', change: 0, changeType: 'neutral', trend: [50, 40, 60, 55, 70, 65, 60], color: 'bg-red-500', icon: AlertTriangle }
        ],
        todoList: [
            { id: 1, text: 'Run payroll', dueDate: '6:00 PM', isCompleted: false, isUrgent: true, isNew: false, group: 'Today' },
            { id: 2, text: 'Review website designs', dueDate: '7:00 PM', isCompleted: false, isUrgent: false, isNew: true, group: 'Today' },
            { id: 3, text: 'Company party', dueDate: 'Tomorrow', isCompleted: false, isUrgent: false, isNew: false, group: 'Upcoming' },
            { id: 4, text: 'Submit blog post', dueDate: '15.01.2025', isCompleted: true, isUrgent: false, isNew: false, group: 'Upcoming' },
        ],
        formationStatus: {
            progress: 76,
            statusText: "In progress",
        },
        // 2. Adicionamos os dados para a reunião
        boardMeeting: {
            date: 'Jan 15, 2025',
            time: '10:00 - 11:00 AM',
            attendees: [
                { id: 'avatar1', src: 'https://i.pravatar.cc/40?img=1' },
                { id: 'avatar2', src: 'https://i.pravatar.cc/40?img=2' },
                { id: 'avatar3', src: 'https://i.pravatar.cc/40?img=3' },
                { id: 'avatar4', src: 'https://i.pravatar.cc/40?img=4' },
            ]
        },
        chartData: [ /* ... */ ],
        tableData: [ /* ... */ ],
        notifications: [ /* ... */ ]
      };
      
      const filteredData = { ...mockData };
      setCache(prev => new Map(prev.set(cacheKey, filteredData)));
      setData(filteredData);
      setLastUpdate(new Date());
      
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [filters, cache]);

  // O resto do hook permanece igual
  const updatePreferences = useCallback((newPreferences: Partial<DashboardPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('dashboard-preferences', JSON.stringify(updated));
  }, [preferences]);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) { console.error(error); }
    }
  }, []);

  useEffect(() => {
    if (!preferences.autoRefresh) return;
    const interval = setInterval(() => {
      fetchData(false);
    }, preferences.refreshInterval);
    return () => clearInterval(interval);
  }, [preferences.autoRefresh, preferences.refreshInterval, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportData = useCallback(() => { /* ... */ }, []);

  return { data, filters, preferences, isLoading, error, lastUpdate, setFilters, updatePreferences, refreshData: () => fetchData(false), exportData };
};