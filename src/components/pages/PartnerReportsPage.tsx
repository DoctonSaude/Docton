import React, { useState } from 'react';
import { 
  Download,
  Calendar,
  BarChart2,
  LineChart,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  PieChart,
  Heart,
  Smile,
  Frown
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

const GrowthChart = () => {
    const dataPoints = [35, 40, 0, -20, 0, -30, 80, 30, 10, -15, -25];
    return (
        <div className="h-80 w-full bg-white p-4 rounded-b-lg">
            <svg viewBox="0 0 500 200" className="w-full h-full">
                <line x1="0" y1="100" x2="500" y2="100" stroke="#e5e7eb" strokeDasharray="4" />
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={dataPoints.map((p, i) => `${(i * 500) / (dataPoints.length - 1)},${100 - p}`).join(' ')} />
                {dataPoints.map((p, i) => ( <circle key={i} cx={(i * 500) / (dataPoints.length - 1)} cy={100 - p} r="3" fill="#3b82f6" /> ))}
            </svg>
        </div>
    );
};
// ------------------------------------

export default function PartnerReportsPage() {
  const [activeTab, setActiveTab] = useState('crescimento');
  const [timeFilter, setTimeFilter] = useState('monthly');

  const kpis = {
      atendimentos: 436,
      receita: 65600.00,
      satisfacao: 4.7,
      crescimento: 15
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const handleExport = () => alert(`Exportando relatório da aba "${activeTab}"...`);

  // --- Funções de Renderização para cada Aba ---
  const renderResumoTab = () => ( <ChartPlaceholder title="Resumo Geral" icon={BarChart2} description="Principais métricas consolidadas." /> );
  const renderServicosTab = () => ( <ChartPlaceholder title="Desempenho por Serviço" icon={PieChart} description="Gráficos de receita e volume por serviço." /> );
  const renderSatisfacaoTab = () => ( <ChartPlaceholder title="Análise de Satisfação" icon={Smile} description="Evolução da nota média e principais feedbacks." /> );
  const renderProfissionaisTab = () => ( <ChartPlaceholder title="Desempenho por Profissional" icon={Users} description="Métricas individuais de cada profissional da equipe." /> );
  const renderCrescimentoTab = () => (
    <div className="bg-white rounded-b-lg border border-t-0 p-6">
        <h3 className="font-bold">Tendência de Crescimento</h3>
        <p className="text-sm text-gray-500">Variação percentual mês a mês</p>
        <GrowthChart />
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Relatórios e Indicadores</h1>
                <p className="text-gray-500">Visualize dados e métricas de desempenho.</p>
            </div>
            <div className="flex items-center gap-2">
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="p-2 border rounded-lg bg-white text-sm">
                    <option value="monthly">Mês Atual</option>
                    <option value="quarterly">Últimos 3 meses</option>
                    <option value="semiannual">Últimos 6 meses</option>
                </select>
                <button className="bg-white border rounded-lg px-4 py-2 font-semibold flex items-center gap-2 text-sm">
                    <Calendar size={16}/> Personalizado
                </button>
                <button onClick={handleExport} className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold flex items-center gap-2 text-sm">
                    <Download size={16}/> Exportar
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Atendimentos</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.atendimentos}</p><p className="text-xs text-gray-400">No período selecionado</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Receita Total</p><p className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(kpis.receita)}</p><p className="text-xs text-gray-400">No período selecionado</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Satisfação</p><p className="text-3xl font-bold text-gray-800 mt-2 flex items-center gap-1">{kpis.satisfacao} <Star size={20} className="text-yellow-400 fill-current"/></p><p className="text-xs text-gray-400">Média de avaliação dos pacientes</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Crescimento</p><p className="text-3xl font-bold text-green-600 mt-2 flex items-center gap-1"><TrendingUp size={20}/> +{kpis.crescimento}%</p><p className="text-xs text-gray-400">Comparado ao período anterior</p></div>
        </div>

        <div className="bg-white rounded-t-lg border-b">
            <div className="flex">
                <button onClick={() => setActiveTab('resumo')} className={`px-4 py-3 font-semibold text-sm ${activeTab === 'resumo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Resumo</button>
                <button onClick={() => setActiveTab('servicos')} className={`px-4 py-3 font-semibold text-sm ${activeTab === 'servicos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Serviços</button>
                <button onClick={() => setActiveTab('satisfacao')} className={`px-4 py-3 font-semibold text-sm ${activeTab === 'satisfacao' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Satisfação</button>
                <button onClick={() => setActiveTab('profissionais')} className={`px-4 py-3 font-semibold text-sm ${activeTab === 'profissionais' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Profissionais</button>
                <button onClick={() => setActiveTab('crescimento')} className={`px-4 py-3 font-semibold text-sm ${activeTab === 'crescimento' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Crescimento</button>
            </div>
        </div>

        {activeTab === 'resumo' && renderResumoTab()}
        {activeTab === 'servicos' && renderServicosTab()}
        {activeTab === 'satisfacao' && renderSatisfacaoTab()}
        {activeTab === 'profissionais' && renderProfissionaisTab()}
        {activeTab === 'crescimento' && renderCrescimentoTab()}
    </div>
  );
}
    