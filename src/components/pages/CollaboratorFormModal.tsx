import React, { useState } from 'react';
import {
  X,
  Save,
  RefreshCw
} from 'lucide-react';

export default function CollaboratorFormModal({ collaborator, onClose, onSave }: { collaborator?: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: collaborator?.name || '',
    email: collaborator?.email || '',
    funcao: collaborator?.funcao || 'Recepcionista',
    status: collaborator?.status || 'Ativo',
  });
  
  const [permissions, setPermissions] = useState({
      agenda: false,
      pacientes: false,
      servicos: false,
      financeiro: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: keyof typeof permissions) => {
      setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula o salvamento
    setTimeout(() => {
      onSave({ ...collaborator, ...formData, permissions });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold">{collaborator ? 'Editar Colaborador' : 'Adicionar Colaborador'}</h2>
                <p className="text-sm text-gray-500">Preencha os campos abaixo para adicionar um novo colaborador.</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-1">Nome completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Nome do colaborador" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="email@exemplo.com" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Função</label>
                  <select name="funcao" value={formData.funcao} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                    <option>Médico</option>
                    <option>Recepcionista</option>
                    <option>Financeiro</option>
                    <option>Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                    <option>Ativo</option>
                    <option>Pendente</option>
                  </select>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Permissões de acesso</h3>
                <div className="space-y-3">
                    {Object.keys(permissions).map((key) => (
                        <label key={key} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{key}</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={permissions[key as keyof typeof permissions]} onChange={() => handlePermissionChange(key as keyof typeof permissions)} className="sr-only peer"/>
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                {isLoading ? <RefreshCw size={16} className="animate-spin"/> : null}
                {collaborator ? 'Salvar Alterações' : 'Adicionar Colaborador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}