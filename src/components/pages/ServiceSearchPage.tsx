import React, { useState } from 'react';
import { Search, Stethoscope, FileText, Heart, Brain, Bone, ArrowRight } from 'lucide-react';

// 1. ADICIONAMOS A "PROP" PARA COMUNICAÇÃO
interface ServiceSearchPageProps {
  onSearch: (searchTerm: string) => void;
}

interface ServiceCategory {
  name: string;
  icon: React.ElementType;
  description: string;
}

const categories: ServiceCategory[] = [
  { name: 'Consultas', icon: Stethoscope, description: 'Especialistas para todas as áreas.' },
  { name: 'Exames', icon: FileText, description: 'Laboratoriais e de imagem.' },
  { name: 'Terapias', icon: Heart, description: 'Cuide do corpo e da mente.' },
  { name: 'Psicologia', icon: Brain, description: 'Apoio para sua saúde mental.' },
  { name: 'Odontologia', icon: Bone, description: 'Tratamentos e consultas.' },
];

export default function ServiceSearchPage({ onSearch }: ServiceSearchPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 2. AGORA ESTA FUNÇÃO CHAMA A NAVEGAÇÃO DEFINIDA NO App.tsx
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  // 3. O CLIQUE NA CATEGORIA TAMBÉM CHAMA A NAVEGAÇÃO
  const handleCategoryClick = (categoryName: string) => {
    onSearch(categoryName);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center py-10 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Encontre o serviço de saúde que você precisa
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Compare preços, locais e avaliações de clínicas e laboratórios perto de você.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Hemograma completo, Consulta com cardiologista..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-600 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Navegue por categorias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left hover:shadow-lg hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-4">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}