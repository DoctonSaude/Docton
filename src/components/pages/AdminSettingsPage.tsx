import React, { useState } from 'react';
import {
  Settings,
  Percent,
  Mail,
  Save,
  RefreshCw,
  LayoutList,
  X,
  Plus,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

// 1. IMPORTAMOS O MODAL QUE CRIAMOS
import CategoryFormModal from './CategoryFormModal';

// --- Interfaces e Dados de Exemplo ---
interface ServiceCategory {
  id: string;
  name: string;
}
const mockCategories: ServiceCategory[] = [
    { id: '1', name: 'Consulta Médica' },
    { id: '2', name: 'Exame Laboratorial' },
    { id: '3', name: 'Exame de Imagem' },
    { id: '4', name: 'Terapia' },
    { id: '5', name: 'Odontologia' },
];

// --- Componentes de Modal ---
const DeleteConfirmModal = ({ item, onConfirm, onCancel }: { item: any, onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Confirmar Exclusão</h2>
            <p className="text-gray-600 my-4">Tem certeza que deseja excluir a categoria "{item.name}"?</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold">Sim, Excluir</button>
            </div>
        </div>
    </div>
);

const CategoryManagementModal = ({ categories, onAdd, onEdit, onDelete, onClose }: { categories: ServiceCategory[], onAdd: () => void, onEdit: (cat: ServiceCategory) => void, onDelete: (cat: ServiceCategory) => void, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Gerenciar Categorias de Serviço</h2>
                <button onClick={onClose}><X/></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
                <button onClick={onAdd} className="w-full mb-4 p-2 border-2 border-dashed rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">+ Adicionar Nova Categoria</button>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <div key={cat.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <span className="font-semibold">{cat.name}</span>
                            <div className="flex gap-2">
                                <button onClick={() => onEdit(cat)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                                <button onClick={() => onDelete(cat)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="p-4 bg-gray-50 border-t flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Fechar</button></div>
        </div>
    </div>
);


export default function AdminSettingsPage() {
  const [takeRate, setTakeRate] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState(mockCategories);
  
  // Estados para controlar os modais de categoria
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ServiceCategory | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando configurações:", { takeRate });
    setTimeout(() => { setIsLoading(false); alert('Configurações salvas com sucesso!'); }, 1500);
  };

  const handleOpenAddCategory = () => { setEditingCategory(null); setShowCategoryForm(true); };
  const handleOpenEditCategory = (cat: ServiceCategory) => { setEditingCategory(cat); setShowCategoryForm(true); };
  const handleDeleteCategory = (cat: ServiceCategory) => { setDeletingCategory(cat); };
  
  const handleSaveCategory = (data: any) => {
      if (editingCategory) {
          setCategories(prev => prev.map(c => c.id === editingCategory.id ? data : c));
      } else {
          const newCategory = { ...data, id: Date.now().toString() };
          setCategories(prev => [newCategory, ...prev]);
      }
  };

  const confirmDeleteCategory = () => {
      if (!deletingCategory) return;
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
      setDeletingCategory(null);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configurações Gerais</h1>
          <p className="text-gray-500">Gerencie os parâmetros e templates da plataforma Docton.</p>
        </div>

        <form onSubmit={handleSaveSettings}>
          <div className="bg-white p-8 rounded-xl shadow-sm border space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2"><Percent className="w-6 h-6 text-emerald-600" />Regras de Negócio</h2>
              <div>
                <label htmlFor="takeRate" className="block text-sm font-medium text-gray-700 mb-2">Comissão da Plataforma (Take Rate)</label>
                <div className="relative mt-1 rounded-md shadow-sm max-w-xs">
                  <input type="number" name="takeRate" id="takeRate" value={takeRate} onChange={(e) => setTakeRate(Number(e.target.value))} className="block w-full rounded-md border-gray-300 p-2 pr-12 focus:border-emerald-500 focus:ring-emerald-500" placeholder="0"/>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-gray-500 sm:text-sm">%</span></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">Esta é a porcentagem que a Docton receberá sobre cada transação realizada.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2"><Mail className="w-6 h-6 text-emerald-600" />Gestão de Templates</h2>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div><h3 className="font-semibold">Templates de E-mail e WhatsApp</h3><p className="text-sm text-gray-500">Edite o conteúdo das comunicações automáticas enviadas aos usuários.</p></div>
                  <button type="button" onClick={() => alert('Funcionalidade a ser implementada.')} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">Gerenciar</button>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2"><LayoutList className="w-6 h-6 text-emerald-600" />Gestão de Serviços</h2>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div><h3 className="font-semibold">Categorias de Serviço</h3><p className="text-sm text-gray-500">Adicione ou edite as categorias e subcategorias globais do sistema.</p></div>
                  <button type="button" onClick={() => setShowCategoryManagement(true)} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">Gerenciar</button>
              </div>
            </div>

            <div className="pt-5 border-t">
              <div className="flex justify-end"><button type="submit" disabled={isLoading} className="w-full md:w-auto flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300">{isLoading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}{isLoading ? 'Salvando...' : 'Salvar Configurações'}</button></div>
            </div>
          </div>
        </form>
      </div>

      {showCategoryManagement && <CategoryManagementModal categories={categories} onClose={() => setShowCategoryManagement(false)} onAdd={handleOpenAddCategory} onEdit={handleOpenEditCategory} onDelete={handleDeleteCategory} />}
      {showCategoryForm && <CategoryFormModal onClose={() => setShowCategoryForm(false)} onSave={handleSaveCategory} category={editingCategory} />}
      {deletingCategory && <DeleteConfirmModal item={deletingCategory} onCancel={() => setDeletingCategory(null)} onConfirm={confirmDeleteCategory} />}
    </>
  );
}