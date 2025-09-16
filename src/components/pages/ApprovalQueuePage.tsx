import React, { useState } from 'react';
import { 
  ShieldCheck,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Briefcase
} from 'lucide-react';

// --- Interface para os Dados (Temporário) ---
interface PendingPartner {
  id: string;
  name: string;
  cnpj: string;
  contactPerson: string;
  contactEmail: string;
  createdAt: string;
  documentUrl?: string;
}

// --- Dados de Exemplo ---
const mockPendingPartners: PendingPartner[] = [
    { id: '3', name: 'Fisio Center', cnpj: '34.567.890/0001-70', contactPerson: 'Mariana Lima', contactEmail: 'mariana.lima@fisio.com', createdAt: '2025-07-16', documentUrl: '#' },
    { id: '5', name: 'Clínica Odonto Feliz', cnpj: '56.789.012/0001-50', contactPerson: 'Juliana Alves', contactEmail: 'juliana@odontofeliz.com', createdAt: '2025-07-15', documentUrl: '#' },
    { id: '6', name: 'Laboratório Vital', cnpj: '67.890.123/0001-40', contactPerson: 'Marcos Ribeiro', contactEmail: 'marcos.r@vital.com', createdAt: '2025-07-14' },
];
// ------------------------------

export default function ApprovalQueuePage() {
  const [pending, setPending] = useState(mockPendingPartners);

  const handleDecision = (partnerId: string, decision: 'approve' | 'reject') => {
      alert(`Parceiro ${partnerId} foi ${decision === 'approve' ? 'APROVADO' : 'REPROVADO'}.`);
      setPending(prev => prev.filter(p => p.id !== partnerId));
  };
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6">
      {/* --- Cabeçalho --- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            Aprovações Pendentes
        </h1>
        <p className="text-gray-500">Analise e aprove os novos parceiros que se cadastraram na plataforma.</p>
      </div>
      
      {/* --- Tabela de Parceiros Pendentes --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {pending.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Parceiro</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Contato</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Data do Pedido</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-500">Documentação</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pending.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-gray-800">{p.name}</p>
                                    <p className="text-xs text-gray-500">CNPJ: {p.cnpj}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-800">{p.contactPerson}</p>
                                    <p className="text-xs text-gray-500">{p.contactEmail}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                                <td className="px-6 py-4 text-center">
                                    {p.documentUrl ? (
                                        <a href={p.documentUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-semibold">Ver Documento</a>
                                    ) : (
                                        <span className="text-gray-400">Não enviado</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleDecision(p.id, 'reject')} className="p-2 text-red-600 hover:bg-red-100 rounded-lg" title="Reprovar">
                                            <ThumbsDown className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleDecision(p.id, 'approve')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" title="Aprovar">
                                            <ThumbsUp className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center p-12 text-gray-500">
                <CheckCircle className="mx-auto w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">Nenhuma pendência!</h3>
                <p>Não há novos parceiros aguardando aprovação no momento.</p>
            </div>
        )}
      </div>
    </div>
  );
}