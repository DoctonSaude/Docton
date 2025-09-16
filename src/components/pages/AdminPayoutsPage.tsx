import React, { useState } from 'react';
import {
  Landmark,
  DollarSign,
  Send,
  Download,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';

import PayoutDetailModal from './PayoutDetailModal';

// --- Interfaces e Dados de Exemplo ---
interface Payout {
  id: string;
  partnerName: string;
  pendingAmount: number;
  transactionCount: number;
  bankInfo: { bank: string; agency: string; account: string; };
  status: 'Pendente' | 'Pago';
  paymentDate?: string;
}

const mockPayouts: Payout[] = [
    { id: 'p2', partnerName: 'Clínica CardioVida', pendingAmount: 8750.50, transactionCount: 32, bankInfo: { bank: 'Itaú Unibanco', agency: '1234', account: '56789-0' }, status: 'Pendente' },
    { id: 'p3', partnerName: 'Fisio Center', pendingAmount: 3240.00, transactionCount: 25, bankInfo: { bank: 'Bradesco', agency: '4321', account: '98765-1' }, status: 'Pendente' },
    { id: 'p1', partnerName: 'Laboratório Diagnóstico Plus', pendingAmount: 12820.00, transactionCount: 45, bankInfo: { bank: 'Banco do Brasil', agency: '3322', account: '11223-4' }, status: 'Pago', paymentDate: '15/07/2025' },
];

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  
  const handleMarkAsPaid = (payoutId: string, file: File) => {
      setPayouts(prev => prev.map(p => 
          p.id === payoutId 
          ? { ...p, status: 'Pago', paymentDate: new Date().toLocaleDateString('pt-BR') } 
          : p
      ));
      setSelectedPayout(null);
      alert(`Repasse para ${payouts.find(p=>p.id === payoutId)?.partnerName} marcado como pago. Comprovativo "${file.name}" anexado.`);
  };

  const filteredPayouts = payouts.filter(p => activeTab === 'pending' ? p.status === 'Pendente' : p.status === 'Pago');
  
  const totalPending = payouts
    .filter(p => p.status === 'Pendente')
    .reduce((sum, p) => sum + p.pendingAmount, 0);
  
  const pendingCount = payouts.filter(p => p.status === 'Pendente').length;

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Repasses</h1>
          <p className="text-gray-500">Gerencie e processe os pagamentos pendentes para os parceiros.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Total a Repassar</p><p className="text-3xl font-bold text-orange-600">{formatCurrency(totalPending)}</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Parceiros com Pagamentos Pendentes</p><p className="text-3xl font-bold text-blue-600">{pendingCount}</p></div>
        </div>

        <div className="flex border-b">
            <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Repasses Pendentes</button>
            <button onClick={() => setActiveTab('paid')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'paid' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Histórico de Repasses</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Parceiro</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Valor</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Data do Pagamento</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                  {filteredPayouts.map(p => (
                      <tr key={p.id}>
                          <td className="px-6 py-4 font-semibold">{p.partnerName}</td>
                          <td className="px-6 py-4 font-bold text-gray-800">{formatCurrency(p.pendingAmount)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {p.status === 'Pago' ? <CheckCircle size={14}/> : <Clock size={14}/>} {p.status}
                            </span>
                          </td>
                           <td className="px-6 py-4">{p.paymentDate || '---'}</td>
                          <td className="px-6 py-4 text-right">
                              <button onClick={() => setSelectedPayout(p)} className="bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                                  <Eye size={16}/>
                                  {p.status === 'Pendente' ? 'Realizar Pagamento' : 'Ver Detalhes'}
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedPayout && (
          <PayoutDetailModal 
            payout={selectedPayout}
            onClose={() => setSelectedPayout(null)}
            onMarkAsPaid={handleMarkAsPaid}
          />
      )}
    </>
  );
}