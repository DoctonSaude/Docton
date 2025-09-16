import React, { useState } from 'react';
import { 
  Star,
  Users,
  DollarSign,
  TrendingUp,
  BarChart2,
  CheckCircle
} from 'lucide-react';

// --- Interface e Dados de Exemplo ---
interface Subscriber {
  id: string;
  patientName: string;
  planName: 'Básico' | 'Premium';
  status: 'active' | 'canceled';
  subscriptionDate: string;
}

const mockSubscribers: Subscriber[] = [
    { id: '1', patientName: 'Ana Clara Lima', planName: 'Básico', status: 'active', subscriptionDate: '2025-07-15' },
    { id: '2', patientName: 'Bruno Martins', planName: 'Premium', status: 'active', subscriptionDate: '2025-07-14' },
    { id: '3', patientName: 'Carlos Eduardo Souza', planName: 'Básico', status: 'active', subscriptionDate: '2025-07-12' },
    { id: '4', patientName: 'Daniela Ferreira', planName: 'Básico', status: 'canceled', subscriptionDate: '2025-06-20' },
];

const kpis = {
    totalSubscribers: 1342,
    mrr: 28540.58, // Monthly Recurring Revenue
    basicSubscribers: 1210,
    premiumSubscribers: 132,
};
// ------------------------------------

export default function AdminSubscriptionsPage() {
  const [subscribers, setSubscribers] = useState(mockSubscribers);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Planos e Assinaturas</h1>
        <p className="text-gray-500">Acompanhe a performance dos planos de assinatura da plataforma.</p>
      </div>

      {/* --- KPIs de Assinaturas --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Total de Assinantes Ativos</p><p className="text-3xl font-bold text-blue-600">{kpis.totalSubscribers.toLocaleString('pt-BR')}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Receita Mensal Recorrente</p><p className="text-3xl font-bold text-green-600">{formatCurrency(kpis.mrr)}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Assinantes - Plano Básico</p><p className="text-3xl font-bold text-gray-800">{kpis.basicSubscribers.toLocaleString('pt-BR')}</p></div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Assinantes - Plano Premium</p><p className="text-3xl font-bold text-gray-800">{kpis.premiumSubscribers.toLocaleString('pt-BR')}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Gráfico (Placeholder) --- */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Crescimento de Assinantes</h2>
              <div className="h-80 bg-gray-50 flex items-center justify-center rounded-lg">
                  <BarChart2 className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-400 ml-4">Gráfico de evolução de assinantes (MRR)</p>
              </div>
          </div>

          {/* --- Atividade Recente --- */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
              <div className="space-y-4">
                  {subscribers.slice(0, 4).map(sub => (
                      <div key={sub.id} className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-gray-800">{sub.patientName}</p>
                              <p className="text-xs text-gray-500">Assinou o Plano <span className="font-bold">{sub.planName}</span></p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}