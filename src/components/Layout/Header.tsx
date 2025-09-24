import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, ShoppingCart } from 'lucide-react';

export default function Header() {
  const { profile } = useAuth(); // Mantemos o profile caso seja necessário no futuro

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Lado Esquerdo: Agora está vazio */}
        <div>
            {/* O LOGO FOI REMOVIDO DAQUI */}
        </div>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 relative">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
          </button>
          
          {/* O BOTÃO PACIENTE FOI REMOVIDO DAQUI */}
        </div>
      </div>
    </header>
  );
}

