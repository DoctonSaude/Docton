import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

// 1. IMPORTAMOS O MODAL QUE CRIAMOS
import CollaboratorFormModal from './CollaboratorFormModal';

// --- Interfaces e Dados de Exemplo ---
interface Collaborator {
  id: string;
  name: string;
  email: string;
  funcao: string;
  status: 'Ativo' | 'Pendente';
}

const mockCollaborators: Collaborator[] = [
    { id: '1', name: 'Dr. Ana Silva', email: 'ana.silva@clinica.com', funcao: 'Médico', status: 'Ativo' },
    { id: '2', name: 'Carlos Mendes', email: 'carlos.mendes@clinica.com', funcao: 'Recepcionista', status: 'Ativo' },
    { id: '3', name: 'Débora Almeida', email: 'debora.almeida@clinica.com', funcao: 'Financeiro', status: 'Ativo' },
    { id: '4', name: 'Fernando Santos', email: 'fernando.santos@clinica.com', funcao: 'Administrador', status: 'Ativo' },
    { id: '5', name: 'Juliana Costa', email: 'juliana.costa@clinica.com', funcao: 'Médico', status: 'Pendente' },
];

// --- Componente de Modal de Exclusão ---
const DeleteConfirmModal = ({ collaborator, onConfirm, onCancel }: { collaborator: Collaborator, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja remover o colaborador "{collaborator.name}" da sua equipa?</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Remover</button>
            </div>
        </div>
    </div>
);

export default function PartnerTeamPage() {
  const [collaborators, setCollaborators] = useState(mockCollaborators);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] = useState<Collaborator | null>(null);

  const handleOpenAddModal = () => { setEditingCollaborator(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (collaborator: Collaborator) => { setEditingCollaborator(collaborator); setIsFormModalOpen(true); };
  const handleDelete = (collaborator: Collaborator) => { setDeletingCollaborator(collaborator); };

  const handleSaveCollaborator = (data: any) => {
      if (editingCollaborator) {
          setCollaborators(prev => prev.map(c => c.id === editingCollaborator.id ? { ...c, ...data } : c));
      } else {
          const newCollaborator = { ...data, id: Date.now().toString(), status: 'Pendente' };
          setCollaborators(prev => [newCollaborator, ...prev]);
      }
  };

  const handleDeleteCollaborator = () => {
      if (!deletingCollaborator) return;
      setCollaborators(prev => prev.filter(c => c.id !== deletingCollaborator.id));
      setDeletingCollaborator(null);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-white min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Equipe</h1>
          <p className="text-gray-500">Gerencie os usuários e permissões da sua equipe.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Filtros</h2>
                 <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4"/>Adicionar Colaborador
                </button>
            </div>
            <div className="flex items-center gap-4 mt-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar por nome ou e-mail..." className="w-full pl-9 pr-3 py-2 border rounded-lg bg-gray-50"/>
                </div>
                <select className="p-2 border rounded-lg bg-gray-50">
                    <option>Todos</option>
                    <option>Ativo</option>
                    <option>Pendente</option>
                </select>
            </div>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-800">Colaboradores ({collaborators.length})</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                        <tr>
                            <th className="p-4 font-normal">Nome</th>
                            <th className="p-4 font-normal">E-mail</th>
                            <th className="p-4 font-normal">Função</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collaborators.map(collab => (
                            <tr key={collab.id} className="border-t">
                                <td className="p-4 font-semibold">{collab.name}</td>
                                <td className="p-4">{collab.email}</td>
                                <td className="p-4">{collab.funcao}</td>
                                <td className="p-4">
                                    <div className={`flex items-center gap-2 ${collab.status === 'Ativo' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {collab.status === 'Ativo' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                                        {collab.status}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenEditModal(collab)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                                        <button onClick={() => handleDelete(collab)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {isFormModalOpen && <CollaboratorFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveCollaborator} collaborator={editingCollaborator} />}
      {deletingCollaborator && <DeleteConfirmModal collaborator={deletingCollaborator} onCancel={() => setDeletingCollaborator(null)} onConfirm={handleDeleteCollaborator} />}
    </>
  );
}