import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Power,
  PowerOff,
  AlertTriangle,
  Upload
} from 'lucide-react';

import ServiceFormModal from './ServiceFormModal';
import ServiceUploadModal from './ServiceUploadModal';

// --- Interfaces e Dados de Exemplo ---
interface Service {
  id: string;
  name: string;
  category: string;
  price: number; // Agora representa o Valor de Repasse
  status: 'Ativo' | 'Inativo';
}

const mockServices: Service[] = [
    { id: '1', name: 'Consulta Cardiológica', category: 'Consultas', price: 250.00, status: 'Ativo' },
    { id: '2', name: 'Hemograma Completo', category: 'Exames', price: 160.00, status: 'Ativo' },
    { id: '3', name: 'Sessão de Fisioterapia', category: 'Terapias', price: 100.00, status: 'Inativo' },
];

const DeleteConfirmModal = ({ service, onConfirm, onCancel }: { service: Service, onConfirm: () => void, onCancel: () => void }) => (
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

export default function PartnerServices() {
  const [services, setServices] = useState(mockServices);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleOpenAddModal = () => { setEditingService(null); setIsFormModalOpen(true); };
  const handleOpenEditModal = (service: Service) => { setEditingService(service); setIsFormModalOpen(true); };
  const handleDelete = (service: Service) => { setDeletingService(service); };

  const handleSaveService = (serviceData: any) => {
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...serviceData } : s));
    } else {
      const newService = { ...serviceData, id: Date.now().toString(), status: 'Ativo' };
      setServices(prev => [newService, ...prev]);
    }
  };

  const handleDeleteService = () => {
      if (!deletingService) return;
      setServices(prev => prev.filter(s => s.id !== deletingService.id));
      setDeletingService(null);
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(prevServices =>
      prevServices.map(s =>
        s.id === serviceId ? { ...s, status: s.status === 'Ativo' ? 'Inativo' : 'Ativo' } : s
      )
    );
  };

  const handleCsvUpload = (file: File) => {
      alert(`Ficheiro "${file.name}" recebido!\nIniciando o processamento para atualizar os serviços...`);
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold text-gray-800">Meus Serviços</h1>
              <p className="text-gray-500">Gerencie os serviços e os valores de repasse que você oferece na plataforma.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsUploadModalOpen(true)} className="bg-white border rounded-lg px-4 py-2 font-semibold flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
                <Upload className="w-4 h-4" /> Importar Tabela
            </button>
            <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4"/>Adicionar Serviço
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 flex justify-between items-center">
            <div className="relative w-1/3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Buscar serviços..." className="pl-9 p-2 border rounded-lg w-full"/></div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600 font-medium">
                      <tr>
                          <th className="px-6 py-3">Nome do Serviço</th>
                          <th className="px-6 py-3">Categoria</th>
                          <th className="px-6 py-3">Valor de Repasse</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services.map(service => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 font-semibold text-gray-800">{service.name}</td>
                        <td className="px-6 py-4 text-gray-600">{service.category}</td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">{formatCurrency(service.price)}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full font-semibold text-xs ${service.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{service.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          {/* COLUNA DE AÇÕES ATUALIZADA */}
                          <div className="flex gap-2">
                              <button onClick={() => handleOpenEditModal(service)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md" title="Editar">
                                  <Edit size={16}/>
                              </button>
                              <button onClick={() => toggleServiceStatus(service.id)} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md" title={service.status === 'Ativo' ? 'Desativar' : 'Ativar'}>
                                  {service.status === 'Ativo' ? <PowerOff size={16}/> : <Power size={16}/>}
                              </button>
                              <button onClick={() => handleDelete(service)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md" title="Excluir">
                                  <Trash2 size={16}/>
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
          </div>
        </div>
      </div>

      {isFormModalOpen && <ServiceFormModal onClose={() => setIsFormModalOpen(false)} onSave={handleSaveService} service={editingService} />}
      {deletingService && <DeleteConfirmModal service={deletingService} onCancel={() => setDeletingService(null)} onConfirm={handleDeleteService} />}
      {isUploadModalOpen && <ServiceUploadModal onClose={() => setIsUploadModalOpen(false)} onUpload={handleCsvUpload} />}
    </>
  );
}