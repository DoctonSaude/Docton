import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

// --- Interface e Dados de Exemplo ATUALIZADOS ---
interface Transaction {
  id: string;
  serviceName: string;
  patientName: string;
  date: string;
  repassValue: number; // Valor de Repasse (líquido)
  status: 'paid' | 'pending';
}

const mockTransactions: Transaction[] = [
  { id: '1', serviceName: 'Hemograma Completo', patientName: 'Ana Clara Lima', date: '2024-07-20', repassValue: 162.00, status: 'paid' },
  { id: '2', serviceName: 'Consulta Cardiológica', patientName: 'Bruno Martins', date: '2024-07-21', repassValue: 252.00, status: 'paid' },
  { id: '3', serviceName: 'Ultrassom Abdominal', patientName: 'Daniela Ferreira', date: '2024-07-22', repassValue: 198.00, status: 'pending' },
  { id: '4', serviceName: 'Sessão de Fisioterapia', patientName: 'Eduardo Costa', date: '2024-07-23', repassValue: 108.00, status: 'pending' },
   { id: '5', serviceName: 'Consulta de Rotina', patientName: 'Fernanda Lins', date: '2024-06-18', repassValue: 135.00, status: 'paid' },
];
// ------------------------------

export default function EarningsPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const summary = {
      totalPaid: transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.repassValue, 0),
      totalPending: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.repassValue, 0),
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
        <p className="text-gray-500">Acompanhe seus recebimentos e extratos de repasse.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
              <p className="text-sm text-gray-500">Total Recebido (Líquido)</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
          </div>
           <div className="bg-white rounded-xl p-6 shadow-sm border">
              <p className="text-sm text-gray-500">A Receber (Próximo Repasse)</p>
              <p className="text-3xl font-bold text-yellow-600">{formatCurrency(summary.totalPending)}</p>
          </div>
      </div>

       <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Data Início" className="pl-9 pr-3 py-2 border rounded-lg w-40" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'}/>
            </div>
             <ArrowRight className="text-gray-400"/>
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Data Fim" className="pl-9 pr-3 py-2 border rounded-lg w-40" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'}/>
            </div>
            <select className="py-2 px-3 border rounded-lg">
                <option value="all">Todos os Status</option>
                <option value="paid">Pago</option>
                <option value="pending">A Receber</option>
            </select>
        </div>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Exportar Extrato</span>
        </button>
      </div>

      {/* --- TABELA ATUALIZADA --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">Data</th>
                        <th className="px-6 py-3 text-left font-medium text-gray-500">Descrição</th>
                        <th className="px-6 py-3 text-right font-medium text-gray-500">Valor de Repasse</th>
                        <th className="px-6 py-3 text-center font-medium text-gray-500">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(t.date)}</td>
                            <td className="px-6 py-4">
                                <p className="font-semibold text-gray-800">{t.serviceName}</p>
                                <p className="text-xs text-gray-500">Paciente: {t.patientName}</p>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-gray-800">{formatCurrency(t.repassValue)}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {t.status === 'paid' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                                    {t.status === 'paid' ? 'Pago' : 'A Receber'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}