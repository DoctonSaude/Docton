import React, { useState } from 'react';
import { X, Save, RefreshCw, Trophy, Hash, Clock, Tag } from 'lucide-react';

interface ChallengeFormModalProps {
  challenge?: any; // Dados do desafio (se for edição)
  onClose: () => void;
  onSave: (challengeData: any) => void;
}

export default function ChallengeFormModal({ challenge, onClose, onSave }: ChallengeFormModalProps) {
  const [formData, setFormData] = useState({
    title: challenge?.title || '',
    category: challenge?.category || '',
    points: challenge?.points || 0,
    duration: challenge?.duration || 0,
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
      onSave({ ...challenge, ...formData });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {challenge ? 'Editar Desafio' : 'Criar Novo Desafio'}
            </h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título do Desafio</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="Ex: Semana Sem Açúcar"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white" required>
                  <option value="">Selecione...</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Bem-Estar Mental">Bem-Estar Mental</option>
                  <option value="Nutrição">Nutrição</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pontos</label>
                <div className="relative"><Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="number" name="points" value={formData.points} onChange={handleChange} className="w-full pl-9 p-2 border rounded-lg" required /></div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duração (dias)</label>
                <div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full pl-9 p-2 border rounded-lg" required /></div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100">
              Cancelar
            </button>
            <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:bg-emerald-300 flex items-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}