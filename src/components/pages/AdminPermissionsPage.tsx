import React, { useState } from 'react';
import {
  Lock,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

import RoleFormModal from './RoleFormModal';
import UserPermissionFormModal from './UserPermissionFormModal';

// --- Interfaces e Dados de Exemplo ---
interface Role { id: string; name: string; description: string; }
interface User { id: string; name: string; email: string; funcao: string; status: 'Ativo' | 'Inativo'; ultimoAcesso: string; }

const mockRoles: Role[] = [
    { id: 'admin', name: 'Admin', description: 'Acesso completo a todas as funcionalidades do sistema.' },
    { id: 'gerente', name: 'Gerente', description: 'Acesso à maioria das funcionalidades, exceto configurações avançadas.' },
    { id: 'supervisor', name: 'Supervisor', description: 'Acesso a áreas específicas com limitações.' },
    { id: 'atendente', name: 'Atendente', description: 'Acesso limitado a funcionalidades básicas de atendimento.' },
    { id: 'financeiro', name: 'Financeiro', description: 'Acesso a módulos financeiros e relatórios.' },
];

const mockUsers: User[] = [
    { id: 'u1', name: 'João Silva', email: 'joao@docton.com', funcao: 'Admin', status: 'Ativo', ultimoAcesso: '24/04/2025, 11:35' },
    { id: 'u2', name: 'Maria Santos', email: 'maria@docton.com', funcao: 'Gerente', status: 'Ativo', ultimoAcesso: '25/04/2025, 05:12' },
    { id: 'u3', name: 'Carlos Pereira', email: 'carlos@docton.com', funcao: 'Supervisor', status: 'Ativo', ultimoAcesso: '23/04/2025, 13:42' },
    { id: 'u4', name: 'Ana Lima', email: 'ana@docton.com', funcao: 'Atendente', status: 'Inativo', ultimoAcesso: '10/04/2025, 08:25' },
    { id: 'u5', name: 'Roberto Martins', email: 'roberto@docton.com', funcao: 'Financeiro', status: 'Ativo', ultimoAcesso: '22/04/2025, 08:35' },
];

const permissionsMatrix = {
    dashboard: { label: 'Dashboard', actions: ['Visualizar'] },
    usuarios: { label: 'Usuários', actions: ['Visualizar', 'Excluir', 'Adicionar', 'Editar'] },
    parceiros: { label: 'Parceiros', actions: ['Visualizar', 'Excluir', 'Adicionar', 'Editar'] },
    financeiro: { label: 'Financeiro', actions: ['Visualizar', 'Adicionar transação', 'Editar transação', 'Gerar relatório'] },
    orcamentos: { label: 'Orçamentos', actions: ['Visualizar', 'Adicionar', 'Aprovar', 'Recusar', 'Editar'] },
    relatorios: { label: 'Relatórios', actions: ['Visualizar', 'Exportar'] },
    planos: { label: 'Planos & Assinaturas', actions: ['Visualizar', 'Desativar', 'Adicionar', 'Editar'] },
    suporte: { label: 'Suporte', actions: ['Visualizar tickets', 'Ver métricas', 'Responder tickets', 'Encerrar tickets'] },
    permissoes: { label: 'Permissões', actions: ['Visualizar', 'Excluir função', 'Adicionar função', 'Editar função'] },
};

const initialRolePermissions: Record<string, string[]> = {
    admin: Object.values(permissionsMatrix).flatMap(p => p.actions),
    gerente: ['Visualizar', 'Adicionar', 'Editar', 'Gerar relatório', 'Exportar', 'Responder tickets'],
    supervisor: ['Visualizar', 'Aprovar', 'Recusar', 'Ver métricas'],
    atendente: ['Visualizar', 'Adicionar transação', 'Responder tickets'],
    financeiro: ['Visualizar', 'Gerar relatório', 'Exportar', 'Adicionar transação', 'Editar transação'],
};

const DeleteConfirmModal = ({ item, type, onConfirm, onCancel }: { item: any, type: string, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir {type} "{item.name}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

export default function AdminPermissionsPage() {
  const [activeTab, setActiveTab] = useState('funcoes');
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState(mockUsers);
  const [selectedRole, setSelectedRole] = useState<Role>(mockRoles[0]);
  const [permissions, setPermissions] = useState<Record<string, string[]>>(initialRolePermissions);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const handlePermissionChange = (action: string) => {
      const currentPermissions = permissions[selectedRole.id] || [];
      const newPermissions = currentPermissions.includes(action)
          ? currentPermissions.filter(p => p !== action)
          : [...currentPermissions, action];
      setPermissions(prev => ({ ...prev, [selectedRole.id]: newPermissions }));
  };

  const handleOpenAddRole = () => { setEditingRole(null); setShowRoleModal(true); };
  const handleSaveRole = (data: any) => {
      if (editingRole) {
          setRoles(prev => prev.map(r => r.id === editingRole.id ? data : r));
      } else {
          const newRole = { ...data, id: data.name.toLowerCase().replace(/\s/g, '-') };
          setRoles(prev => [...prev, newRole]);
      }
  };
  const handleDeleteRole = () => {
    if(!deletingRole) return;
    setRoles(prev => prev.filter(r => r.id !== deletingRole.id));
    setDeletingRole(null);
    setSelectedRole(roles[0]); // Selects the first in the list to avoid errors
  };

  const handleOpenAddUser = () => { setEditingUser(null); setShowUserModal(true); };
  const handleOpenEditUser = (user: User) => { setEditingUser(user); setShowUserModal(true); setActiveDropdown(null); };
  const handleSaveUser = (data: any) => {
      if (editingUser) {
          setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
      } else {
          const newUser = { ...data, id: `u${Date.now()}`, status: 'Ativo', ultimoAcesso: 'Nunca' };
          setUsers(prev => [newUser, ...prev]);
      }
  };
  const handleDeleteUser = (user: User) => {
      setDeletingUser(user);
      setActiveDropdown(null);
  };
  const confirmDeleteUser = () => {
      if(!deletingUser) return;
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      setDeletingUser(null);
  };
  const handleToggleUserStatus = (user: User) => {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' } : u));
      setActiveDropdown(null);
  };

  const renderFuncoesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
            <h2 className="font-semibold mb-2">Funções</h2>
            <p className="text-sm text-gray-500 mb-4">Selecione uma função para gerenciar.</p>
            <div className="space-y-2">
                {roles.map(role => (
                    <button key={role.id} onClick={() => setSelectedRole(role)} className={`w-full text-left p-4 rounded-lg border ${selectedRole.id === role.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                        <p className="font-bold">{role.name}</p>
                        <p className="text-xs text-gray-500">{role.description}</p>
                    </button>
                ))}
            </div>
            <button onClick={handleOpenAddRole} className="w-full mt-4 p-3 border-2 border-dashed rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">+ Adicionar nova função</button>
        </div>
        <div className="md:col-span-3 bg-white p-6 rounded-lg border">
            <h2 className="font-semibold mb-4">Matriz de Permissões para: <span className="text-blue-600">{selectedRole.name}</span></h2>
            <div className="space-y-4">
                {Object.entries(permissionsMatrix).map(([key, value]) => (
                    <div key={key} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-bold text-gray-800 mb-3">{value.label}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {value.actions.map(action => (
                                <label key={action} className="flex items-center space-x-2 text-sm cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={(permissions[selectedRole.id] || []).includes(action)}
                                        onChange={() => handlePermissionChange(action)}
                                    />
                                    <span>{action}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
  
  const renderUsuariosTab = () => (
    <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center">
            <div className="relative w-1/3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Buscar usuários..." className="pl-9 p-2 border rounded-lg w-full"/></div>
            <button onClick={handleOpenAddUser} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm"><Plus size={16}/>Adicionar usuário</button>
        </div>
        <table className="w-full text-sm">
            <thead className="text-left text-gray-500"><tr><th className="p-2 font-normal">Nome</th><th className="p-2 font-normal">Email</th><th className="p-2 font-normal">Função</th><th className="p-2 font-normal">Status</th><th className="p-2 font-normal">Último acesso</th><th className="p-2 font-normal">Ações</th></tr></thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="border-b">
                        <td className="p-2 font-semibold">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{user.funcao}</span></td>
                        <td className="p-2"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${user.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`}></div>{user.status}</div></td>
                        <td className="p-2">{user.ultimoAcesso}</td>
                        <td className="p-2">
                            <div className="relative">
                                <button onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
                                    <MoreHorizontal size={16}/>
                                </button>
                                {activeDropdown === user.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                                        <a onClick={() => handleOpenEditUser(user)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={14}/> Editar</a>
                                        <a onClick={() => handleToggleUserStatus(user)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            {user.status === 'Ativo' ? <XCircle size={14}/> : <CheckCircle size={14}/>}
                                            {user.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                                        </a>
                                        <a onClick={() => handleDeleteUser(user)} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><Trash2 size={14}/> Excluir</a>
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  return (
    <>
      <div className="p-6 space-y-6 bg-white min-h-screen">
        <div>
            <h1 className="text-2xl font-bold">Permissões</h1>
            <p className="text-gray-500">Gerencie as funções, permissões e usuários do sistema.</p>
        </div>
        <div className="flex border-b">
            <button onClick={() => setActiveTab('funcoes')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'funcoes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Funções</button>
            <button onClick={() => setActiveTab('usuarios')} className={`px-4 py-2 font-semibold text-sm ${activeTab === 'usuarios' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Usuários</button>
        </div>
        {activeTab === 'funcoes' ? renderFuncoesTab() : renderUsuariosTab()}
      </div>

      {showRoleModal && <RoleFormModal role={editingRole} onClose={() => setShowRoleModal(false)} onSave={handleSaveRole} />}
      {deletingRole && <DeleteConfirmModal item={deletingRole} type="a função" onCancel={() => setDeletingRole(null)} onConfirm={handleDeleteRole} />}
      {showUserModal && <UserPermissionFormModal user={editingUser} roles={roles} onClose={() => setShowUserModal(false)} onSave={handleSaveUser} />}
      {deletingUser && <DeleteConfirmModal item={deletingUser} type="o usuário" onCancel={() => setDeletingUser(null)} onConfirm={confirmDeleteUser} />}
    </>
  );
}