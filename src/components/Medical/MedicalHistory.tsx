import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Download, 
  FileText, 
  User, 
  Stethoscope, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Eye, 
  Lock, 
  ThumbsUp, 
  ThumbsDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// 1. IMPORTAMOS O NOVO MODAL DE DETALHES
import MedicalRecordDetailModal from './MedicalRecordDetailModal';

// --- Interfaces e Dados de Exemplo ---
interface MedicalRecord {
  id: string;
  type: 'consultation' | 'exam' | 'prescription' | 'allergy' | 'chronic';
  date: string;
  title: string;
  description: string;
  doctor: { name: string; specialty: string; crm: string; clinic: string; };
  status: 'active' | 'resolved' | 'monitoring';
  tags: string[];
}

const mockRecords: MedicalRecord[] = [
    { id: '1', type: 'consultation', date: '2024-07-15T14:00:00Z', title: 'Consulta Cardiológica de Rotina', description: 'Avaliação cardiovascular preventiva.', doctor: { name: 'Dr. João Silva', specialty: 'Cardiologia', crm: 'CRM-SP 123456', clinic: 'Clínica CardioVida' }, status: 'resolved', tags: ['cardiologia', 'preventivo'] },
    { id: '2', type: 'exam', date: '2024-07-10T09:30:00Z', title: 'Hemograma Completo', description: 'Exame laboratorial para avaliação geral.', doctor: { name: 'Dra. Maria Santos', specialty: 'Clínica Geral', crm: 'CRM-SP 789012', clinic: 'Lab Diagnóstico Plus' }, status: 'resolved', tags: ['laboratorial', 'sangue'] },
];

const mockAccessRequests = [
    { id: 'req1', doctorName: 'Dr. Ricardo Gomes', clinic: 'Clínica Pro Cuidar', requestDate: '2025-07-16' },
];
const mockActiveAccess = [
    { id: 'acc1', doctorName: 'Dra. Ana Costa', clinic: 'Clínica Alergia & Imunologia', grantedDate: '2025-07-10' },
];

export default function MedicalHistory() {
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [accessRequests, setAccessRequests] = useState(mockAccessRequests);
  const [activeAccess, setActiveAccess] = useState(mockActiveAccess);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  
  // 2. NOVOS ESTADOS PARA CONTROLAR O MODAL DE DETALHES
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // 3. FUNÇÃO PARA ABRIR O MODAL DE DETALHES
  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleApproveAccess = (requestId: string) => {
      const request = accessRequests.find(r => r.id === requestId);
      if (!request) return;
      const newActiveAccess = { ...request, id: `acc-${Date.now()}`, grantedDate: new Date().toISOString().split('T')[0] };
      setActiveAccess(prev => [...prev, newActiveAccess]);
      setAccessRequests(prev => prev.filter(r => r.id !== requestId));
      alert(`Acesso aprovado para ${request.doctorName}.`);
  };
  
  const handleDenyAccess = (requestId: string) => {
      const request = accessRequests.find(r => r.id === requestId);
      if (!request) return;
      setAccessRequests(prev => prev.filter(r => r.id !== requestId));
      alert(`Acesso negado para ${request.doctorName}.`);
  };

  const handleRevokeAccess = (accessId: string) => {
      const access = activeAccess.find(a => a.id === accessId);
      if (!access) return;
      if (window.confirm(`Tem certeza que deseja revogar o acesso de ${access.doctorName}?`)) {
          setActiveAccess(prev => prev.filter(a => a.id !== accessId));
          alert(`Acesso de ${access.doctorName} foi revogado.`);
      }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  const formatDateSimple = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const getTypeIcon = (type: string) => {
    switch(type) {
        case 'consultation': return Stethoscope;
        case 'exam': return Activity;
        default: return FileText;
    }
  };
  const getTypeColor = (type: string) => {
      switch(type) {
        case 'consultation': return 'bg-blue-100 text-blue-800';
        case 'exam': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
  };

  const renderTimeline = () => (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
      <div className="space-y-8">
        {records.map((record) => {
          const TypeIcon = getTypeIcon(record.type);
          return (
            <div key={record.id} className="relative flex items-start space-x-6">
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${getTypeColor(record.type)} border-4 border-white shadow-lg`}>
                <TypeIcon className="w-6 h-6" />
              </div>
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{formatDate(record.date)}</span>
                      <span>{record.doctor.name} ({record.doctor.specialty})</span>
                    </div>
                  </div>
                  {/* 4. BOTÃO DO OLHO NA TIMELINE AGORA ABRE O MODAL */}
                  <button onClick={() => handleViewDetails(record)} className="text-emerald-600 p-2 rounded-lg hover:bg-emerald-50"><Eye className="w-5 h-5" /></button>
                </div>
                <p className="text-gray-600">{record.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderList = () => (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left font-medium text-gray-500">Data</th><th className="px-6 py-3 text-left font-medium text-gray-500">Título</th><th className="px-6 py-3 text-right font-medium text-gray-500">Ações</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
                {records.map(record => (
                    <tr key={record.id}>
                        <td className="px-6 py-4">{formatDate(record.date)}</td>
                        <td className="px-6 py-4 font-semibold">{record.title}</td>
                        <td className="px-6 py-4 text-right">
                          {/* 5. BOTÃO DO OLHO NA LISTA AGORA ABRE O MODAL */}
                          <button onClick={() => handleViewDetails(record)} className="text-emerald-600 p-2 rounded-lg hover:bg-emerald-50"><Eye className="w-5 h-5" /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-full mx-auto space-y-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Meu Prontuário</h1>
            <p className="text-emerald-100">Visualize seu histórico de saúde e gerencie quem pode acessá-lo.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Lock className="w-5 h-5" />Gerenciamento de Acesso</h2>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Solicitações Pendentes</h3>
              {accessRequests.length > 0 ? accessRequests.map(req => (
                <div key={req.id} className="bg-yellow-50 border p-4 rounded-lg flex justify-between items-center">
                  <p><span className="font-semibold">{req.doctorName}</span> da <span className="font-semibold">{req.clinic}</span> solicitou acesso.</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDenyAccess(req.id)} className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-lg text-sm"><ThumbsDown className="w-4 h-4" /> Negar</button>
                    <button onClick={() => handleApproveAccess(req.id)} className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-lg text-sm"><ThumbsUp className="w-4 h-4" /> Aprovar</button>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">Nenhuma solicitação de acesso pendente.</p>}
            </div>
            <div className="border-t my-6"></div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Acessos Ativos</h3>
              {activeAccess.length > 0 ? activeAccess.map(acc => (
                <div key={acc.id} className="bg-gray-50 border p-4 rounded-lg flex justify-between items-center">
                  <p><span className="font-semibold">{acc.doctorName}</span> tem acesso ao seu prontuário.</p>
                  <button onClick={() => handleRevokeAccess(acc.id)} className="text-sm text-red-600 font-semibold hover:underline">Revogar Acesso</button>
                </div>
              )) : <p className="text-sm text-gray-500">Nenhum profissional com acesso ativo.</p>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Seu Histórico de Saúde</h2>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('timeline')} className={`px-3 py-1 text-sm ${viewMode === 'timeline' ? 'bg-emerald-500 text-white' : 'hover:bg-gray-50'}`}>Timeline</button>
                <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'hover:bg-gray-50'}`}>Lista</button>
              </div>
            </div>
            {viewMode === 'timeline' ? renderTimeline() : renderList()}
          </div>
        </div>
      </div>

      {isDetailModalOpen && selectedRecord && (
        <MedicalRecordDetailModal
            record={selectedRecord}
            onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </>
  );
}
