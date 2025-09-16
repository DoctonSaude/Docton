import React, { useState } from 'react';
import {
  X,
  Save,
  RefreshCw
} from 'lucide-react';

export default function TransactionFormModal({ transaction, onClose, onSave }: { transaction?: any, onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    client: transaction?.client || '',
    // Garante que a data esteja no formato YYYY-MM-DD para o input type="date"
    date: transaction?.date ? new Date(transaction.date.split('/').reverse().join('-')).toISOString().split('T')[0] : '',
    value: transaction?.value || 0,
    type: transaction?.type || 'Entrada',
    status: transaction?.status || 'Pendente',
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
      // Formata a data de volta para dd/mm/yyyy para consistência na exibição
      const formattedData = {
          ...formData,
          date: new Date(formData.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) // Adiciona timeZone para evitar problemas de fuso
      }
      onSave({ ...transaction, ...formattedData });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">{transaction ? 'Editar Transação' : 'Adicionar Nova Transação'}</h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cliente / Fornecedor</label>
              <input type="text" name="client" value={formData.client} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium mb-1">Valor</label>
                  <input type="number" name="value" value={formData.value} onChange={handleChange} className="w-full p-2 border rounded-lg" step="0.01" required />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                      <option>Entrada</option>
                      <option>Saída</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                      <option>Concluído</option>
                      <option>Pendente</option>
                    </select>
                </div>
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