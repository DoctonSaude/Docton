import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Star
} from 'lucide-react';

import RewardFormModal from './RewardFormModal';

// --- Interfaces e Dados de Exemplo ---
interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  status: 'Ativo' | 'Inativo';
}

const mockRewards: Reward[] = [
    { id: '1', title: '10% de Desconto em Consulta', description: 'Desconto aplicável em qualquer consulta médica.', cost: 500, status: 'Ativo' },
    { id: '2', title: 'Ebook de Receitas Saudáveis', description: 'Um livro digital com 30 receitas focadas em bem-estar.', cost: 250, status: 'Ativo' },
    { id: '3', title: 'Sessão de Terapia Online', description: 'Uma sessão de 50 minutos com um psicólogo parceiro.', cost: 1000, status: 'Ativo' },
    { id: '4', title: 'Kit de Suplementos', description: 'Um kit de vitaminas essenciais.', cost: 1500, status: 'Inativo' },
];

const kpis = {
    total: 4,
    active: 3,
    pointsRedeemed: 175000
};

// --- Componente de Modal de Exclusão ---
const DeleteConfirmModal = ({ reward, onConfirm, onCancel }: { reward: Reward, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir a recompensa "{reward.title}"?</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState(mockRewards);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);

  const handleOpenAddModal = () => { setEditingReward(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (reward: Reward) => { setEditingReward(reward); setIsFormModalOpen(true); };
  const handleDelete = (reward: Reward) => { setDeletingReward(reward); };

  const handleSaveReward = (data: any) => {
      if (editingReward) {
          setRewards(prev => prev.map(r => r.id === editingReward.id ? { ...r, ...data } : r));
      } else {
          const newReward = { ...data, id: Date.now().toString() };
          setRewards(prev => [newReward, ...prev]);
      }
  };

  const handleDeleteReward = () => {
      if (!deletingReward) return;
      setRewards(prev => prev.filter(r => r.id !== deletingReward.id));
      setDeletingReward(null);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Recompensas</h1>
          <p className="text-gray-500">Crie e gerencie as recompensas disponíveis na loja de pontos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Total de Recompensas</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.total}</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Recompensas Ativas</p><p className="text-3xl font-bold text-green-600 mt-2">{kpis.active}</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Pontos Resgatados (Mês)</p><p className="text-3xl font-bold text-blue-600 mt-2">{kpis.pointsRedeemed.toLocaleString('pt-BR')}</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 flex justify-between items-center">
                <div className="relative w-1/3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Buscar recompensas..." className="pl-9 p-2 border rounded-lg w-full"/></div>
                <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm"><Plus className="w-4 h-4"/>Adicionar Recompensa</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3">Nome da Recompensa</th>
                            <th className="px-6 py-3">Custo (Pontos)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rewards.map(reward => (
                            <tr key={reward.id}>
                                <td className="px-6 py-4 font-semibold">{reward.title}</td>
                                <td className="px-6 py-4 font-semibold text-blue-600 flex items-center gap-1">{reward.cost} <Star size={14} className="fill-current"/></td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${reward.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{reward.status}</span></td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenEditModal(reward)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(reward)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {isFormModalOpen && <RewardFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveReward} reward={editingReward} />}
      {deletingReward && <DeleteConfirmModal reward={deletingReward} onCancel={() => setDeletingReward(null)} onConfirm={handleDeleteReward} />}
    </>
  );
}
