import React, { useState } from 'react';
import { X, Save, RefreshCw, DollarSign } from 'lucide-react';

export default function ServiceFormModal({ service, onClose, onSave }: { service?: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || 'Consultas',
    price: service?.price || 0, // Este campo agora será o "Valor de Repasse"
    description: service?.description || '',
    isActive: service?.isActive === false ? false : true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSave({ ...service, ...formData });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">{service ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Serviço</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                    <option>Consultas</option>
                    <option>Exames</option>
                    <option>Terapias</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-1">Valor de Repasse (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full pl-9 p-2 border rounded-lg" step="0.01" required />
                  </div>
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-2 border rounded-lg"></textarea>
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