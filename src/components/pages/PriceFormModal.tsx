import React, { useState } from 'react';
import {
  X,
  Save,
  RefreshCw
} from 'lucide-react';

export default function PriceFormModal({ service, onClose, onSave }: { service?: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || 'Consulta Médica',
    basePrice: service?.basePrice || 0,
    freeDiscount: 0, // Desconto para o plano gratuito é sempre 0
    basicDiscount: service?.basicDiscount || 0,
    premiumDiscount: service?.premiumDiscount || 0,
    status: service?.status || 'Ativo',
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
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                <option>Consulta Médica</option>
                <option>Exame Laboratorial</option>
                <option>Exame de Imagem</option>
                <option>Terapia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço Base (R$)</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full p-2 border rounded-lg" step="0.01" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Desconto Plano Gratuito (%)</label>
                  <input type="number" name="freeDiscount" value={formData.freeDiscount} disabled className="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Desconto Plano Básico (%)</label>
                  <input type="number" name="basicDiscount" value={formData.basicDiscount} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Desconto Plano Premium (%)</label>
                  <input type="number" name="premiumDiscount" value={formData.premiumDiscount} onChange={handleChange} className="w-full p-2 border rounded-lg" />
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
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                {isLoading ? <RefreshCw size={16} className="animate-spin"/> : null}
                {service ? 'Salvar Alterações' : 'Adicionar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}