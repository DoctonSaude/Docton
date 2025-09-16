import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  BarChart2,
  PieChart,
  FileText,
  Search,
  Download,
  CheckCircle,
  Clock,
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Trash2,
  Edit,
  Users,
  Briefcase
} from 'lucide-react';

import TransactionFormModal from '../Financial/TransactionFormModal';

// --- Interfaces e Dados de Exemplo ---
interface Transaction {
  id: string;
  description: string;
  client: string;
  date: string;
  value: number;
  type: 'Entrada' | 'Saída';
  status: 'Concluído' | 'Pendente';
}

const mockTransactions: Transaction[] = [
    { id: '#1', description: 'Pagamento Consulta #1234', client: 'João Silva', date: '28/04/2025', value: 280.00, type: 'Entrada', status: 'Concluído' },
    { id: '#2', description: 'Pagamento Exame #5678', client: 'Maria Oliveira', date: '27/04/2025', value: 150.00, type: 'Entrada', status: 'Concluído' },
    { id: '#3', description: 'Pagamento Parceiro #304', client: 'Clínica São Lucas', date: '26/04/2025', value: -1280.00, type: 'Saída', status: 'Concluído' },
    { id: '#4', description: 'Pagamento Consulta #1236', client: 'Ana Pereira', date: '25/04/2025', value: 320.00, type: 'Entrada', status: 'Pendente' },
    { id: '#5', description: 'Pagamento Exame #5680', client: 'Roberto Costa', date: '24/04/2025', value: 430.00, type: 'Entrada', status: 'Concluído' },
];

const kpis = { revenue: 282000.00, expenses: 180400.00, profit: 101600.00, margin: 36 };

// --- Componentes de Gráfico ---
const RevenueChart = () => {
    const data = [ { month: 'Jan', revenue: 45000, expense: 29000, profit: 16000 }, { month: 'Fev', revenue: 38000, expense: 27000, profit: 11000 }, { month: 'Mar', revenue: 46000, expense: 30000, profit: 16000 }, { month: 'Abr', revenue: 50000, expense: 32000, profit: 18000 }, { month: 'Mai', revenue: 48000, expense: 31000, profit: 17000 }, { month: 'Jun', revenue: 52000, expense: 33000, profit: 19000 } ];
    const maxVal = 60000;
    return (
        <div className="h-80 flex items-end gap-4 p-4 border-t mt-4">
            {data.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center">
                    <div className="flex items-end h-full w-full">
                        <div title={`Receita: R$${d.revenue}`} className="bg-blue-500 w-1/3 rounded-t-md" style={{height: `${(d.revenue/maxVal)*100}%`}}></div>
                        <div title={`Despesas: R$${d.expense}`} className="bg-red-500 w-1/3 rounded-t-md" style={{height: `${(d.expense/maxVal)*100}%`}}></div>
                        <div title={`Lucro: R$${d.profit}`} className="bg-green-500 w-1/3 rounded-t-md" style={{height: `${(d.profit/maxVal)*100}%`}}></div>
                    </div>
                    <span className="text-xs font-semibold mt-2">{d.month}</span>
                </div>
            ))}
        </div>
    );
};

const DistributionChart = () => (
    <div className="h-80 flex items-center justify-center p-4 border-t mt-4">
        <div className="w-48 h-48 rounded-full flex items-center justify-center" style={{background: `conic-gradient(#4299E1 0% 45%, #48BB78 45% 70%, #F6AD55 70% 90%, #9F7AEA 90% 100%)`}}>
            <div className="w-24 h-24 bg-white rounded-full"></div>
        </div>
        <div className="ml-6 space-y-2 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Consultas 45%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Exames 25%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400"></div>Procedimentos 20%</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div>Planos 10%</div>
        </div>
    </div>
);

const ChartPlaceholder = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <div className="bg-white rounded-lg border p-6 h-full flex flex-col">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <div className="h-full bg-gray-50 flex items-center justify-center rounded-lg mt-4">
            <Icon className="w-12 h-12 text-gray-300"/>
        </div>
    </div>
);

// --- Componentes de Modal ---
const DeleteConfirmModal = ({ transaction, onConfirm, onCancel }: { transaction: Transaction, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir a transação "{transaction.description}"?</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

const ReportGenerationModal = ({ reportTitle, onClose }: { reportTitle: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Gerando Relatório</h2>
            <p className="text-gray-600 my-2">Seu relatório de <span className="font-semibold">{reportTitle}</span> está sendo preparado e será baixado automaticamente.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-gray-200 rounded-lg font-semibold">Fechar</button>
        </div>
    </div>
);


export default function AdminFinancialsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('6m');
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleOpenAddModal = () => { setEditingTransaction(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (transaction: Transaction) => { setEditingTransaction(transaction); setIsFormModalOpen(true); setActiveDropdown(null); };
  const handleDelete = (transaction: Transaction) => { setDeletingTransaction(transaction); setActiveDropdown(null); };

  const handleSaveTransaction = (data: any) => {
      if (editingTransaction) {
          setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? data : t));
      } else {
          const newTransaction = { ...data, id: `#${Math.floor(Math.random() * 1000)}` };
          setTransactions(prev => [newTransaction, ...prev]);
      }
  };

  const handleDeleteTransaction = () => {
      if (!deletingTransaction) return;
      setTransactions(prev => prev.filter(t => t.id !== deletingTransaction.id));
      setDeletingTransaction(null);
  };
  
  const handleGenerateReport = (title: string) => {
      setGeneratingReport(title);
      setTimeout(() => setGeneratingReport(null), 2000);
  };
  const handleExport = () => {
      alert(`Exportando relatório da aba "${activeTab}"...`);
  };

  const renderVisaoGeralTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6"><h3 className="font-bold mb-4">Receita x Despesa</h3><RevenueChart /></div>
        <div className="bg-white rounded-lg border p-6"><h3 className="font-bold mb-4">Distribuição da Receita</h3><DistributionChart /></div>
    </div>
  );

  const renderTransacoesTab = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Histórico de Transações</h2>
            <div className="flex items-center gap-2">
                <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Pesquisar..." className="pl-9 pr-3 py-2 border rounded-lg"/></div>
                <button onClick={handleExport} className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold border hover:bg-gray-50 flex items-center gap-2 text-sm"><Download size={16}/> Exportar</button>
                <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm"><Plus size={16}/> Nova Transação</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left font-medium text-gray-500">ID</th><th className="px-6 py-3 text-left font-medium text-gray-500">Descrição</th><th className="px-6 py-3 text-left font-medium text-gray-500">Cliente</th><th className="px-6 py-3 text-left font-medium text-gray-500">Data</th><th className="px-6 py-3 text-left font-medium text-gray-500">Valor</th><th className="px-6 py-3 text-left font-medium text-gray-500">Tipo</th><th className="px-6 py-3 text-left font-medium text-gray-500">Status</th><th className="px-6 py-3 text-left font-medium text-gray-500">Ações</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                    {transactions.map(t => (
                        <tr key={t.id}>
                            <td className="px-6 py-4 font-semibold">{t.id}</td><td className="px-6 py-4">{t.description}</td><td className="px-6 py-4">{t.client}</td><td className="px-6 py-4">{t.date}</td>
                            <td className={`px-6 py-4 font-semibold ${t.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>{t.value >= 0 ? '+' : ''}{formatCurrency(t.value)}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${t.type === 'Entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.type}</span></td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${t.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
                            <td className="px-6 py-4">
                                <div className="relative">
                                    <button onClick={() => setActiveDropdown(activeDropdown === t.id ? null : t.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"><MoreHorizontal size={16}/></button>
                                    {activeDropdown === t.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                                            <a onClick={() => handleOpenEditModal(t)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={14}/> Editar</a>
                                            <a onClick={() => handleDelete(t)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><Trash2 size={14}/> Excluir</a>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
  
  const renderRelatoriosTab = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border"><h3 className="font-bold mb-2">Relatório de Receitas</h3><p className="text-sm text-gray-500 mb-4">Detalhe de todas as receitas.</p><button onClick={() => handleGenerateReport('Receitas')} className="font-semibold text-blue-600">Gerar Relatório</button></div>
          <div className="bg-white p-6 rounded-lg border"><h3 className="font-bold mb-2">Relatório de Despesas</h3><p className="text-sm text-gray-500 mb-4">Detalhe de todas as despesas.</p><button onClick={() => handleGenerateReport('Despesas')} className="font-semibold text-blue-600">Gerar Relatório</button></div>
          <div className="bg-white p-6 rounded-lg border"><h3 className="font-bold mb-2">Balanço Financeiro</h3><p className="text-sm text-gray-500 mb-4">Balanço completo com indicadores.</p><button onClick={() => handleGenerateReport('Balanço Financeiro')} className="font-semibold text-blue-600">Gerar Relatório</button></div>
          <div className="bg-white p-6 rounded-lg border"><h3 className="font-bold mb-2">Pagamentos a Parceiros</h3><p className="text-sm text-gray-500 mb-4">Detalhe dos pagamentos a parceiros.</p><button onClick={() => handleGenerateReport('Pagamentos a Parceiros')} className="font-semibold text-blue-600">Gerar Relatório</button></div>
          <div className="bg-white p-6 rounded-lg border"><h3 className="font-bold mb-2">Relatório de Impostos</h3><p className="text-sm text-gray-500 mb-4">Resumo de impostos por categoria.</p><button onClick={() => handleGenerateReport('Impostos')} className="font-semibold text-blue-600">Gerar Relatório</button></div>
          <div className="bg-white p-6 rounded-lg border"><h3 className="font-bold mb-2">Relatório Personalizado</h3><p className="text-sm text-gray-500 mb-4">Crie um relatório com dados específicos.</p><button onClick={() => handleGenerateReport('Personalizado')} className="font-semibold text-blue-600">Criar Relatório</button></div>
      </div>
  );

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div><h1 className="text-2xl font-bold text-gray-800">Gestão Financeira</h1><p className="text-gray-500">Acompanhe o desempenho financeiro da plataforma.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Receita Total</p><DollarSign className="text-green-500"/></div><p className="text-3xl font-bold mt-2">{formatCurrency(kpis.revenue)}</p><p className="text-xs text-green-500 flex items-center gap-1"><ArrowUp size={12}/>+12,5%</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Despesas</p><DollarSign className="text-red-500"/></div><p className="text-3xl font-bold mt-2">{formatCurrency(kpis.expenses)}</p><p className="text-xs text-red-500 flex items-center gap-1"><ArrowUp size={12}/>+8,2%</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Lucro</p><DollarSign className="text-green-500"/></div><p className="text-3xl font-bold mt-2">{formatCurrency(kpis.profit)}</p><p className="text-xs text-green-500 flex items-center gap-1"><ArrowUp size={12}/>+18,7%</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Margem de Lucro</p><TrendingUp className="text-green-500"/></div><p className="text-3xl font-bold mt-2">{kpis.margin}%</p><p className="text-xs text-green-500 flex items-center gap-1"><ArrowUp size={12}/>+2,5%</p></div>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex border-b"><button onClick={() => setActiveTab('overview')} className={`px-4 py-2 font-semibold ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Visão Geral</button><button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 font-semibold ${activeTab === 'transactions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Transações</button><button onClick={() => setActiveTab('reports')} className={`px-4 py-2 font-semibold ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Relatórios</button></div>
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="p-2 border rounded-lg bg-white"><option value="6m">Último mês</option></select>
        </div>
        {activeTab === 'overview' && renderVisaoGeralTab()}
        {activeTab === 'transactions' && renderTransacoesTab()}
        {activeTab === 'reports' && renderRelatoriosTab()}
      </div>

      {isFormModalOpen && <TransactionFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveTransaction} transaction={editingTransaction} />}
      {deletingTransaction && <DeleteConfirmModal transaction={deletingTransaction} onCancel={() => setDeletingTransaction(null)} onConfirm={handleDeleteTransaction} />}
      {generatingReport && <ReportGenerationModal reportTitle={generatingReport} onClose={() => setGeneratingReport(null)} />}
    </>
  );
}