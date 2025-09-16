import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

// 1. IMPORTAMOS O MODAL QUE CRIAMOS
import UserFormModal from './UserFormModal';

// --- Interfaces e Dados de Exemplo ---
interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Premium' | 'Básico' | 'Gratuito';
  status: 'Ativo' | 'Inativo';
  registrationDate: string;
}

const mockUsers: User[] = [
    { id: '1', name: 'João Silva', email: 'joao.silva@gmail.com', plan: 'Premium', status: 'Ativo', registrationDate: '10/01/2023' },
    { id: '2', name: 'Maria Oliveira', email: 'maria.oliveira@gmail.com', plan: 'Básico', status: 'Ativo', registrationDate: '15/02/2023' },
    { id: '3', name: 'Carlos Santos', email: 'carlos.santos@gmail.com', plan: 'Gratuito', status: 'Ativo', registrationDate: '20/03/2023' },
    { id: '4', name: 'Ana Pereira', email: 'ana.pereira@gmail.com', plan: 'Premium', status: 'Inativo', registrationDate: '05/04/2023' },
    { id: '5', name: 'Roberto Costa', email: 'roberto.costa@gmail.com', plan: 'Básico', status: 'Ativo', registrationDate: '18/05/2023' },
];

const kpis = { total: 128, active: 105, premium: 47 };

// Componente para o modal de confirmação de exclusão
const DeleteConfirmModal = ({ user, onConfirm, onCancel }: { user: User, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusClass = (status: 'Ativo' | 'Inativo') => (status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700');
  const getPlanClass = (plan: 'Premium' | 'Básico' | 'Gratuito') => {
    switch(plan) {
        case 'Premium': return 'bg-blue-100 text-blue-700';
        case 'Básico': return 'bg-purple-100 text-purple-700';
        case 'Gratuito': return 'bg-gray-200 text-gray-600';
    }
  };

  const handleOpenAddModal = () => { setEditingUser(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (user: User) => { setEditingUser(user); setIsFormModalOpen(true); setActiveDropdown(null); };
  const handleDelete = (user: User) => { setDeletingUser(user); setActiveDropdown(null); };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
    } else {
      const newUser = { ...userData, id: Date.now().toString(), registrationDate: new Date().toLocaleDateString('pt-BR') };
      setUsers(prev => [newUser, ...prev]);
    }
  };

  const handleDeleteUser = () => {
      if (!deletingUser) return;
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      setDeletingUser(null);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <p className="text-gray-500">Gerencie todos os usuários da plataforma Docton.</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Pesquisar usuários..." className="w-full pl-9 pr-3 py-2 border rounded-lg"/>
          </div>
          <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4"/>Adicionar Usuário
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Total de Usuários</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.total}</p><p className="text-xs text-gray-400">+12% comparado ao mês anterior</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Usuários Ativos</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.active}</p><p className="text-xs text-gray-400">82% do total de usuários</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">Usuários Premium</p><p className="text-3xl font-bold text-gray-800 mt-2">{kpis.premium}</p><p className="text-xs text-gray-400">37% do total de usuários</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4"><h2 className="font-semibold text-gray-800">Usuários</h2></div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Nome</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Plano</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Data de Cadastro</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 font-semibold">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${getPlanClass(user.plan)}`}>{user.plan}</span></td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${getStatusClass(user.status)}`}>{user.status}</span></td>
                        <td className="px-6 py-4">{user.registrationDate}</td>
                        <td className="px-6 py-4">
                            <div className="relative">
                                <button onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                                    <MoreHorizontal size={16}/>
                                </button>
                                {activeDropdown === user.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                                        <a onClick={() => alert('Visualizar perfil...')} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Eye size={14}/> Visualizar</a>
                                        <a onClick={() => handleOpenEditModal(user)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={14}/> Editar</a>
                                        <a onClick={() => handleDelete(user)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><Trash2 size={14}/> Excluir</a>
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

      {isFormModalOpen && <UserFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveUser} user={editingUser} />}
      {deletingUser && <DeleteConfirmModal user={deletingUser} onCancel={() => setDeletingUser(null)} onConfirm={handleDeleteUser} />}
    </>
  );
}