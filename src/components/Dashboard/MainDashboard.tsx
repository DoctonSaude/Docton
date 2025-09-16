import React from 'react';
import { Users, BarChart3, DollarSign, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

// --- Dados de Exemplo (Temporários) ---
const adminMetrics = {
    gmv: 258430.50,
    doctonRevenue: 38764.57,
    newPatients: 182,
    newPartners: 12,
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};
// ------------------------------------

// Componente para o card de métrica
const MetricCard = ({ title, value, icon: Icon, color, change }: { title: string, value: string, icon: React.ElementType, color: string, change?: string }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm text-gray-500">{title}</p>
                <span className="text-3xl font-bold text-gray-800">{value}</span>
                 {change && (
                    <div className="flex items-center gap-1 text-sm mt-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>{change}</span>
                    </div>
                 )}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);


export default function MainDashboard() {
  return (
    <div className="p-6 space-y-6">
       {/* --- Cabeçalho --- */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>

      {/* --- Métricas Principais --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
            title="Faturamento Bruto (GMV)"
            value={formatCurrency(adminMetrics.gmv)}
            icon={DollarSign}
            color="bg-blue-600"
            change="+12.5% vs mês anterior"
        />
        <MetricCard 
            title="Receita Docton (Take Rate)"
            value={formatCurrency(adminMetrics.doctonRevenue)}
            icon={TrendingUp}
            color="bg-green-600"
            change="+15.2%"
        />
         <MetricCard 
            title="Novos Pacientes (Mês)"
            value={adminMetrics.newPatients.toString()}
            icon={Users}
            color="bg-purple-600"
            change="+8.1%"
        />
         <MetricCard 
            title="Novos Parceiros (Mês)"
            value={adminMetrics.newPartners.toString()}
            icon={Briefcase}
            color="bg-orange-500"
            change="+5"
        />
      </div>

      {/* --- Gráficos de Performance --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Evolução do Faturamento</h2>
              <div className="h-80 bg-gray-50 flex items-center justify-center rounded-lg">
                  <p className="text-gray-400">Gráfico de Linhas/Barras</p>
              </div>
          </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Serviços Mais Vendidos</h2>
              <div className="h-80 bg-gray-50 flex items-center justify-center rounded-lg">
                  <p className="text-gray-400">Gráfico de Pizza/Donut</p>
              </div>
          </div>
      </div>
      
       <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Parceiros com Melhor Desempenho</h2>
          <div className="h-64 bg-gray-50 flex items-center justify-center rounded-lg">
              <p className="text-gray-400">Tabela/Lista de Parceiros</p>
          </div>
      </div>

    </div>
  );
}