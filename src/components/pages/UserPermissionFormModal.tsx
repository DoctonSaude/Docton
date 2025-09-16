import React, { useState } from 'react';
import {
  X,
  Save,
  RefreshCw
} from 'lucide-react';

export default function UserPermissionFormModal({ user, roles, onClose, onSave }: { user?: any, roles: any[], onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    funcao: user?.funcao || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula o salvamento
    setTimeout(() => {
      onSave({ ...user, ...formData });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">{user ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}</h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Função</label>
              <select name="funcao" value={formData.funcao} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                <option value="">Selecione uma função</option>
                {roles.map((role: any) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                {isLoading ? <RefreshCw size={16} className="animate-spin"/> : <Save size={16}/>}
                Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}