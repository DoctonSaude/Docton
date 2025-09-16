import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Star,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

// 1. IMPORTAMOS O MODAL QUE CRIAMOS
import PartnerFormModal from './PartnerFormModal';

// --- Interfaces e Dados de Exemplo ---
interface Partner {
  id: string;
  name: string;
  type: 'Clínica' | 'Laboratório' | 'Médico';
  specialty: string;
  rating: number;
  status: 'Ativo' | 'Inativo';
  registrationDate: string;
}

const mockPartners: Partner[] = [
    { id: '1', name: 'Clínica São Lucas', type: 'Clínica', specialty: 'Clínica Geral', rating: 4.8, status: 'Ativo', registrationDate: '10/01/2023' },
    { id: '2', name: 'Laboratório Central', type: 'Laboratório', specialty: 'Análises Clínicas', rating: 4.5, status: 'Ativo', registrationDate: '15/02/2023' },
    { id: '3', name: 'Dr. Paulo Cardoso', type: 'Médico', specialty: 'Cardiologia', rating: 4.9, status: 'Ativo', registrationDate: '20/03/2023' },
    { id: '4', name: 'Clínica Bem Estar', type: 'Clínica', specialty: 'Psicologia', rating: 4.2, status: 'Inativo', registrationDate: '05/04/2023' },
    { id: '5', name: 'Dr. Renato Silva', type: 'Médico', specialty: 'Ortopedia', rating: 4.7, status: 'Ativo', registrationDate: '18/05/2023' },
];

const kpis = { total: 58, active: 52, avgRating: 4.7 };

// Componente para o modal de confirmação de exclusão
const DeleteConfirmModal = ({ partner, onConfirm, onCancel }: { partner: Partner, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir o parceiro "{partner.name}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);


export default function PartnersPage() {
  const [partners, setPartners] = useState(mockPartners);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusClass = (status: 'Ativo' | 'Inativo') => (status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700');

  const handleOpenAddModal = () => { setEditingPartner(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (partner: Partner) => { setEditingPartner(partner); setIsFormModalOpen(true); setActiveDropdown(null); };
  const handleDelete = (partner: Partner) => { setDeletingPartner(partner); setActiveDropdown(null); };

  const handleSavePartner = (partnerData: any) => {
    if (editingPartner) {
      setPartners(prev => prev.map(p => p.id === editingPartner.id ? { ...p, ...partnerData } : p));
    } else {
      const newPartner = { ...partnerData, id: Date.now().toString(), registrationDate: new Date().toLocaleDateString('pt-BR'), rating: 0 };
      setPartners(prev => [newPartner, ...prev]);
    }
  };

  const handleDeletePartner = () => {
      if (!deletingPartner) return;
      setPartners(prev => prev.filter(p => p.id !== deletingPartner.id));
      setDeletingPartner(null);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Parceiros</h1>
          <p className="text-gray-500">Gerencie todos os parceiros da plataforma Docton.</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Pesquisar parceiros..." className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white"/>
          </div>
          <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4"/>Adicionar Parceiro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Total de Parceiros</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.total}</p><p className="text-xs text-gray-400">+8% comparado ao mês anterior</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Parceiros Ativos</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.active}</p><p className="text-xs text-gray-400">90% do total de parceiros</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Avaliação Média</p><p className="text-3xl font-bold text-gray-800 mt-2 flex items-center gap-1">{kpis.avgRating} <Star size={20} className="text-yellow-400 fill-current"/></p><p className="text-xs text-gray-400">Baseado em 872 avaliações</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4"><h2 className="font-semibold text-gray-800">Parceiros</h2></div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Nome</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Tipo</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Especialidade</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Avaliação</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Data de Cadastro</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {partners.map(partner => (
                      <tr key={partner.id}>
                        <td className="px-6 py-4 font-semibold">{partner.name}</td>
                        <td className="px-6 py-4">{partner.type}</td>
                        <td className="px-6 py-4">{partner.specialty}</td>
                        <td className="px-6 py-4 font-semibold flex items-center gap-1">{partner.rating.toFixed(1)} <Star size={14} className="text-yellow-400 fill-current"/></td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${getStatusClass(partner.status)}`}>{partner.status}</span></td>
                        <td className="px-6 py-4">{partner.registrationDate}</td>
                        <td className="px-6 py-4">
                            <div className="relative">
                                <button onClick={() => setActiveDropdown(activeDropdown === partner.id ? null : partner.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                                    <MoreHorizontal size={16}/>
                                </button>
                                {activeDropdown === partner.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                                        <a onClick={() => alert('Visualizar perfil...')} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Eye size={14}/> Visualizar</a>
                                        <a onClick={() => handleOpenEditModal(partner)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={14}/> Editar</a>
                                        <a onClick={() => handleDelete(partner)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><Trash2 size={14}/> Excluir</a>
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
      </div>

      {isFormModalOpen && <PartnerFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSavePartner} partner={editingPartner} />}
      {deletingPartner && <DeleteConfirmModal partner={deletingPartner} onCancel={() => setDeletingPartner(null)} onConfirm={handleDeletePartner} />}
    </>
  );
}