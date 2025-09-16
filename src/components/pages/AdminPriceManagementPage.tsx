import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Percent,
  AlertTriangle,
  Upload
} from 'lucide-react';

import PriceFormModal from './PriceFormModal';
import PriceUploadModal from './PriceUploadModal';

// --- Interfaces e Dados de Exemplo ---
interface ServicePrice {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  basicDiscount: number; // em %
  premiumDiscount: number; // em %
  status: 'Ativo' | 'Inativo';
}

const mockServicePrices: ServicePrice[] = [
    { id: '1', name: 'Consulta Clínica Geral', category: 'Consulta Médica', basePrice: 180, basicDiscount: 5, premiumDiscount: 15, status: 'Ativo' },
    { id: '2', name: 'Consulta Cardiologista', category: 'Consulta Médica', basePrice: 250, basicDiscount: 10, premiumDiscount: 20, status: 'Ativo' },
    { id: '3', name: 'Exame de Sangue Completo', category: 'Exame Laboratorial', basePrice: 120, basicDiscount: 5, premiumDiscount: 15, status: 'Ativo' },
    { id: '4', name: 'Raio-X Tórax', category: 'Exame de Imagem', basePrice: 150, basicDiscount: 8, premiumDiscount: 18, status: 'Ativo' },
];

// --- Componente de Modal de Exclusão ---
const DeleteConfirmModal = ({ service, onConfirm, onCancel }: { service: ServicePrice, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir o serviço "{service.name}"?</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

export default function AdminPriceManagementPage() {
  const [prices, setPrices] = useState(mockServicePrices);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServicePrice | null>(null);
  const [deletingService, setDeletingService] = useState<ServicePrice | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const calculateDiscount = (price: number, discount: number) => price * (1 - discount / 100);

  const handleOpenAddModal = () => { setEditingService(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (service: ServicePrice) => { setEditingService(service); setIsFormModalOpen(true); };
  const handleDelete = (service: ServicePrice) => { setDeletingService(service); };

  const handleSaveService = (data: any) => {
      if (editingService) {
          setPrices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...data } : s));
      } else {
          const newService = { ...data, id: Date.now().toString() };
          setPrices(prev => [newService, ...prev]);
      }
  };

  const handleDeleteService = () => {
      if (!deletingService) return;
      setPrices(prev => prev.filter(s => s.id !== deletingService.id));
      setDeletingService(null);
  };
  
  const handleCsvUpload = (file: File) => {
      alert(`Ficheiro "${file.name}" recebido!\nIniciando o processamento para atualizar os preços...`);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-white min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Preços</h1>
          <p className="text-gray-500">Gerencie os preços de todos os serviços disponíveis na plataforma Docton.</p>
        </div>
        
         <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
              <div className="relative">
                  <select className="appearance-none w-72 pl-3 pr-8 py-2 border rounded-lg bg-gray-50 text-gray-600">
                      <option>Selecionar Parceiro</option>
                      <option>Clínica São Lucas</option>
                      <option>Laboratório Central</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsUploadModalOpen(true)} className="bg-white border rounded-lg px-4 py-2 font-semibold flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
                <Upload className="w-4 h-4" /> Importar CSV
            </button>
            <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4"/>Adicionar Serviço
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
           <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">Tabela de Preços do Parceiro Selecionado</h2>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600 font-medium">
                      <tr>
                          <th className="px-6 py-3">Nome do Serviço</th>
                          <th className="px-6 py-3">Categoria</th>
                          <th className="px-6 py-3">Preço Base</th>
                          <th className="px-6 py-3">Plano Gratuito</th>
                          <th className="px-6 py-3">Plano Básico</th>
                          <th className="px-6 py-3">Plano Premium</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {prices.map(service => {
                      const basicPrice = calculateDiscount(service.basePrice, service.basicDiscount);
                      const premiumPrice = calculateDiscount(service.basePrice, service.premiumDiscount);
                      return (
                          <tr key={service.id}>
                            <td className="px-6 py-4 font-semibold text-gray-800">{service.name}</td>
                            <td className="px-6 py-4 text-gray-600">{service.category}</td>
                            <td className="px-6 py-4 text-gray-800 font-semibold">{formatCurrency(service.basePrice)}</td>
                            <td className="px-6 py-4 text-gray-800">{formatCurrency(service.basePrice)}</td>
                            <td className="px-6 py-4">
                                <span className="text-xs font-semibold text-green-600">{service.basicDiscount}% OFF</span>
                                <p className="font-semibold text-gray-800">{formatCurrency(basicPrice)}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs font-semibold text-green-600">{service.premiumDiscount}% OFF</span>
                                <p className="font-semibold text-gray-800">{formatCurrency(premiumPrice)}</p>
                            </td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full font-semibold text-xs ${service.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{service.status}</span></td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                  <button onClick={() => handleOpenEditModal(service)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md"><Edit size={16}/></button>
                                  <button onClick={() => handleDelete(service)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"><Trash2 size={16}/></button>
                              </div>
                            </td>
                          </tr>
                      );
                    })}
                  </tbody>
              </table>
          </div>
        </div>
      </div>

      {isFormModalOpen && <PriceFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveService} service={editingService} />}
      {deletingService && <DeleteConfirmModal service={deletingService} onCancel={() => setDeletingService(null)} onConfirm={handleDeleteService} />}
      {isUploadModalOpen && <PriceUploadModal onClose={() => setIsUploadModalOpen(false)} onUpload={handleCsvUpload} />}
    </>
  );
}