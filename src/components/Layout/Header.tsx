import React from 'react';
import { Search, Bell, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  user: any;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onCartClick: () => void;
  cartItemCount: number;
}

export default function Header({ user, onMenuToggle, onCartClick, cartItemCount }: HeaderProps) {
  return (
    <header className="bg-white h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-gray-200">
      {/* O título pode ser dinâmico no futuro, mas por enquanto fica "Dashboard" */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="flex items-center space-x-4">
        
        {/* 1. MOSTRA OS ÍCONES APENAS SE O UTILIZADOR NÃO FOR ADMIN */}
        {user?.role !== 'admin' && (
          <>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800">
              <Search className="w-5 h-5" />
            </button>
            
            <button onClick={onCartClick} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-semibold text-sm text-gray-800">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}