import React, { useState } from 'react';
import {
  Download,
  BarChart2,
  LineChart,
  PieChart,
  Users,
  Briefcase,
  DollarSign
} from 'lucide-react';

// --- Componentes de Gráfico (com dados de exemplo) ---

const ChartPlaceholder = ({ title, icon: Icon, description }: { title: string, icon: React.ElementType, description: string }) => (
    <div className="bg-white rounded-lg border p-6 h-full flex flex-col">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="flex-grow h-64 bg-gray-50 flex items-center justify-center rounded-lg mt-4">
            <div className="text-center">
                <Icon className="w-12 h-12 text-gray-300 mx-auto"/>
                <p className="text-gray-400 mt-2 text-sm">{description}</p>
            </div>
        </div>
    </div>
);

const RevenueChart = () => {
    const data = [ { month: 'Jan', revenue: 45000, expense: 29000 }, { month: 'Fev', revenue: 38000, expense: 27000 }, { month: 'Mar', revenue: 46000, expense: 30000 }, { month: 'Abr', revenue: 50000, expense: 32000 }, { month: 'Mai', revenue: 48000, expense: 31000 }, { month: 'Jun', revenue: 52000, expense: 33000 } ];
    const maxVal = 60000;
    return (
        <div className="h-64 flex items-end gap-4 p-4 border-t mt-4">
            {data.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center">
                    <div className="flex items-end h-full w-full">
                        <div title={`Receita: R$${d.revenue}`} className="bg-blue-400 w-1/2 rounded-t-md" style={{height: `${(d.revenue/maxVal)*100}%`}}></div>
                        <div title={`Despesa: R$${d.expense}`} className="bg-red-400 w-1/2 rounded-t-md" style={{height: `${(d.expense/maxVal)*100}%`}}></div>
                    </div>
                    <span className="text-xs font-semibold mt-2">{d.month}</span>
                </div>
            ))}
        </div>
    );
};

const DistributionChart = () => (
    <div className="h-64 flex items-center justify-center p-4 border-t mt-4">
        <div className="w-40 h-40 rounded-full flex items-center justify-center" style={{background: `conic-gradient(#4299E1 0% 45%, #48BB78 45% 70%, #F6AD55 70% 90%, #9F7AEA 90% 100%)`}}>
            <div className="w-20 h-20 bg-white rounded-full"></div>
        </div>
        <div className="ml-6 space-y-2 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Consultas 45%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Exames 25%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div>Procedimentos 20%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div>Planos 10%</div>
        </div>
    </div>
);


export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('geral');
  const [timeFilter, setTimeFilter] = useState('6m');

  const handleExport = () => {
      alert(`Exportando relatório da aba "${activeTab}" para o período selecionado...`);
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'geral':
              return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg border p-6"><h3 className="font-bold">Crescimento de Usuários</h3><ChartPlaceholder title="" icon={LineChart} description="Novos Usuários" /></div>
                      <div className="bg-white rounded-lg border p-6"><h3 className="font-bold">Agendamentos</h3><ChartPlaceholder title="" icon={BarChart2} description="Confirmados vs Realizados"/></div>
                      <div className="bg-white rounded-lg border p-6"><h3 className="font-bold">Distribuição de Serviços</h3><DistributionChart /></div>
                      <div className="bg-white rounded-lg border p-6"><h3 className="font-bold">Usuários por Plano</h3><ChartPlaceholder title="" icon={PieChart} description="Distribuição de Planos"/></div>
                      <div className="bg-white rounded-lg border p-6"><h3 className="font-bold">Receita Mensal</h3><RevenueChart /></div>
                      <div className="bg-white rounded-lg border p-6"><h3 className="font-bold">Taxa de Retenção</h3><ChartPlaceholder title="" icon={LineChart} description="Retenção ao longo do tempo"/></div>
                  </div>
              );
          case 'users':
              return <ChartPlaceholder title="Relatórios de Usuários" icon={Users} description="Análise detalhada de usuários" />;
          case 'services':
              return <ChartPlaceholder title="Relatórios de Serviços" icon={Briefcase} description="Análise detalhada de serviços"/>;
          case 'financial':
              return <ChartPlaceholder title="Relatórios Financeiros" icon={DollarSign} description="Análise detalhada de finanças"/>;
          default:
              return null;
      }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Relatórios e Estatísticas</h1>
                <p className="text-gray-500">Visualize métricas e relatórios detalhados sobre o desempenho da plataforma Docton.</p>
            </div>
            <div className="flex items-center gap-2">
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="p-2 border rounded-lg bg-white text-sm">
                    <option value="6m">Últimos 6 meses</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="7d">Últimos 7 dias</option>
                    <option value="all">Todo o período</option>
                </select>
                <button onClick={handleExport} className="bg-white border rounded-lg px-4 py-2 font-semibold flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Download size={16}/> Exportar
                </button>
            </div>
        </div>
        
        <div className="flex border-b">
            <button onClick={() => setActiveTab('geral')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'geral' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Geral</button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Usuários</button>
            <button onClick={() => setActiveTab('services')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'services' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Serviços</button>
            <button onClick={() => setActiveTab('financial')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'financial' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Financeiro</button>
        </div>

        {renderContent()}
    </div>
  );
}