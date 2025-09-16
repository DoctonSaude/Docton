import React, { useState } from 'react';
import {
  X,
  Save,
  RefreshCw
} from 'lucide-react';

export default function PartnerFormModal({ partner, onClose, onSave }: { partner?: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    type: partner?.type || 'Clínica',
    specialty: partner?.specialty || '',
    status: partner?.status || 'Ativo',
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
      onSave({ ...partner, ...formData });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">{partner ? 'Editar Parceiro' : 'Adicionar Novo Parceiro'}</h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                    <option>Clínica</option>
                    <option>Laboratório</option>
                    <option>Médico</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-1">Especialidade Principal</label>
                  <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                  <option>Ativo</option>
                  <option>Inativo</option>
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