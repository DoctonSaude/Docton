import React, { useState } from 'react';
import { 
  Trophy, 
  Plus, 
  Search, 
  Users, 
  Check,
  GitMerge,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  MoreHorizontal,
  Info
} from 'lucide-react';

import ChallengeFormModal from './ChallengeFormModal';
import ChallengeProgressModal from './ChallengeProgressModal';

// --- Interfaces e Dados de Exemplo ---
interface Challenge {
  id: string;
  title: string;
  category: string;
  participants: number;
  completionRate?: number;
  period?: string;
  status: 'Ativo' | 'Finalizado' | 'Agendado' | 'Rascunho' | 'Pendente';
  sponsorship?: 'Patrocinado' | 'Docton';
  points: number;
  duration: number;
  createdBy?: string;
  type?: 'Parceiro' | 'Interno';
  creationDate?: string;
}

const mockAllChallenges: Challenge[] = [
    { id: '1', title: '30 Dias de Caminhada', category: 'Atividade Física', participants: 248, completionRate: 68, period: '01/04/2025 - 30/04/2025', status: 'Ativo', sponsorship: 'Patrocinado', points: 150, duration: 30 },
    { id: '2', title: 'Beba 2L de Água por Dia', category: 'Hidratação', participants: 356, completionRate: 72, period: '15/04/2025 - 15/05/2025', status: 'Ativo', sponsorship: 'Docton', points: 100, duration: 30 },
    { id: '3', title: 'Monitore sua Glicose', category: 'Monitoramento', participants: 125, completionRate: 45, period: '01/03/2025 - 31/03/2025', status: 'Finalizado', sponsorship: 'Patrocinado', points: 120, duration: 30 },
    { id: '4', title: '21 Dias sem Açúcar', category: 'Alimentação', participants: 189, completionRate: 39, period: '10/04/2025 - 30/04/2025', status: 'Ativo', sponsorship: 'Docton', points: 200, duration: 21 },
    { id: '5', title: 'Meditação Diária', category: 'Saúde Mental', participants: 278, completionRate: 51, period: '01/05/2025 - 31/05/2025', status: 'Agendado', sponsorship: 'Patrocinado', points: 75, duration: 30 },
    { id: '6', title: 'Semana Sem Açúcar', category: 'Nutrição', participants: 0, status: 'Rascunho', points: 200, duration: 7, period: 'N/A' },
];

const mockPending: Challenge[] = [
    { id: 'p1', title: 'Exercícios para Coluna', category: 'Fisioterapia', createdBy: 'Clínica Postura Correta', type: 'Parceiro', creationDate: '26/04/2025', status: 'Pendente', participants: 0, points: 120, duration: 10 },
    { id: 'p2', title: 'Controle de Pressão Arterial', category: 'Monitoramento', createdBy: 'Dr. Carlos Cardoso', type: 'Parceiro', creationDate: '27/04/2025', status: 'Pendente', participants: 0, points: 90, duration: 30 },
];

const kpis = { total: 15, participants: 1247, completionRate: 63, sponsored: 8 };

const DeleteConfirmModal = ({ challenge, onConfirm, onCancel }: { challenge: Challenge, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir o desafio "{challenge.title}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

export default function AdminChallengesPage() {
  const [allChallenges, setAllChallenges] = useState(mockAllChallenges);
  const [pendingChallenges, setPendingChallenges] = useState(mockPending);
  const [activeTab, setActiveTab] = useState('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deletingChallenge, setDeletingChallenge] = useState<Challenge | null>(null);
  const [viewingProgress, setViewingProgress] = useState<Challenge | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleOpenAddModal = () => { setEditingChallenge(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (challenge: Challenge) => { setEditingChallenge(challenge); setIsFormModalOpen(true); setActiveDropdown(null); };
  const handleSaveChallenge = (challengeData: any) => {
    if (editingChallenge) {
      const listToUpdate = editingChallenge.status === 'Pendente' ? setPendingChallenges : setAllChallenges;
      listToUpdate(prev => prev.map(c => c.id === editingChallenge.id ? { ...c, ...challengeData } : c));
    } else {
      const newChallenge = { ...challengeData, id: Date.now().toString(), participants: 0, status: 'Rascunho' as 'Rascunho' };
      setAllChallenges(prev => [newChallenge, ...prev]);
    }
  };
  const handleDeleteChallenge = () => {
      if (!deletingChallenge) return;
      setAllChallenges(prev => prev.filter(c => c.id !== deletingChallenge.id));
      setDeletingChallenge(null);
  };
  const handleApprove = (challengeId: string) => {
      const challengeToApprove = pendingChallenges.find(c => c.id === challengeId);
      if (!challengeToApprove) return;
      setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
      setAllChallenges(prev => [{...challengeToApprove, status: 'Rascunho'}, ...prev]);
      alert(`Desafio "${challengeToApprove.title}" foi aprovado.`);
  };
  const handleReject = (challengeId: string) => {
      const challengeToReject = pendingChallenges.find(c => c.id === challengeId);
      if (!challengeToReject || !window.confirm(`Tem certeza que deseja rejeitar o desafio "${challengeToReject.title}"?`)) return;
      setPendingChallenges(prev => prev.filter(c => c.id !== challengeId));
      alert('Desafio rejeitado.');
  };
  const handleViewProgress = (challenge: Challenge) => { setViewingProgress(challenge); setActiveDropdown(null); };
  const handleDelete = (challenge: Challenge) => { setDeletingChallenge(challenge); setActiveDropdown(null); };


  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Desafios</h1>
          <p className="text-gray-500">Gerencie todos os desafios de saúde da plataforma.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Total de Desafios</p><Trophy className="w-5 h-5 text-yellow-500"/></div><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.total}</p><p className="text-xs text-gray-400">5 ativos, 3 agendados, 7 finalizados</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Participantes</p><Users className="w-5 h-5 text-blue-500"/></div><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.participants.toLocaleString('pt-BR')}</p><p className="text-xs text-green-500">+15% comparado ao mês anterior</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Taxa de Conclusão</p><Check className="w-5 h-5 text-green-500"/></div><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.completionRate}%</p><p className="text-xs text-green-500">+5% comparado ao mês anterior</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex justify-between items-center"><p className="text-sm text-gray-500">Desafios Patrocinados</p><GitMerge className="w-5 h-5 text-purple-500"/></div><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.sponsored}</p><p className="text-xs text-gray-400">53% do total de desafios</p></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex border-b">
              <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Todos os Desafios</button>
              <button onClick={() => setActiveTab('pending')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Pendentes de Aprovação</button>
          </div>
          <div className="flex items-center gap-2">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Pesquisar desafios..." className="pl-9 pr-3 py-2 border rounded-lg"/></div>
              <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Novo Desafio</button>
          </div>
        </div>
        
        {activeTab === 'all' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Título</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Categoria</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Participantes</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 w-1/6">Taxa de Conclusão</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Período</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Patrocínio</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {allChallenges.map(c => (
                            <tr key={c.id}>
                                <td className="px-6 py-4 font-semibold">{c.title}</td>
                                <td className="px-6 py-4">{c.category}</td>
                                <td className="px-6 py-4">{c.participants}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: `${c.completionRate}%`}}></div></div>
                                        <span className="font-semibold text-gray-600">{c.completionRate}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.period}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full font-semibold text-xs ${
                                        c.status === 'Ativo' ? 'bg-green-100 text-green-700' :
                                        c.status === 'Finalizado' ? 'bg-gray-200 text-gray-600' :
                                        c.status === 'Agendado' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-500'
                                    }`}>{c.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full font-semibold text-xs flex items-center gap-1.5 ${
                                        c.sponsorship === 'Patrocinado' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {c.sponsorship}
                                        {c.sponsorship === 'Patrocinado' && <Info className="w-3 h-3" />}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <button onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                                            <MoreHorizontal className="w-5 h-5"/>
                                        </button>
                                        
                                        {activeDropdown === c.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                                                <a onClick={() => handleViewProgress(c)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <Eye size={14}/> Ver Progresso</a>
                                                <a onClick={() => handleOpenEditModal(c)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"> <Edit size={14}/> Editar</a>
                                                <a onClick={() => handleDelete(c)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"> <Trash2 size={14}/> Excluir</a>
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
        )}

        {activeTab === 'pending' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6"><h2 className="font-semibold text-gray-800">Desafios Pendentes de Aprovação</h2><p className="text-sm text-gray-500">Desafios sugeridos que precisam de aprovação</p></div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Título</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Criado por</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Tipo</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Data de Criação</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingChallenges.map(c => (
                        <tr key={c.id}>
                          <td className="px-6 py-4 font-semibold">{c.title}</td>
                          <td className="px-6 py-4">{c.createdBy}</td>
                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${c.type === 'Parceiro' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{c.type}</span></td>
                          <td className="px-6 py-4">{c.creationDate}</td>
                          <td className="px-6 py-4">
                              <div className="flex gap-2">
                                  <button onClick={() => handleOpenEditModal(c)} className="font-semibold text-gray-600 text-xs px-3 py-1.5 border rounded-md hover:bg-gray-50">Visualizar</button>
                                  <button onClick={() => handleApprove(c.id)} className="font-semibold text-blue-600 text-xs">Aprovar</button>
                                  <button onClick={() => handleReject(c.id)} className="font-semibold text-red-500 text-xs">Rejeitar</button>
                              </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}
      </div>

      {isFormModalOpen && (<ChallengeFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveChallenge} challenge={editingChallenge} />)}
      {deletingChallenge && (<DeleteConfirmModal challenge={deletingChallenge} onCancel={() => setDeletingChallenge(null)} onConfirm={handleDeleteChallenge} />)}
      {viewingProgress && (<ChallengeProgressModal challenge={viewingProgress} onClose={() => setViewingProgress(null)} />)}
    </>
  );
}