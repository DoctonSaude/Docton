import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  user: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
  children: React.ReactNode;
  // 1. Adicionamos as novas informações que o Layout precisa passar para o Header
  onCartClick: () => void;
  cartItemCount: number;
}

export default function MainLayout({ 
  user, 
  activeTab, 
  onTabChange, 
  isSidebarOpen, 
  onMenuToggle, 
  children,
  onCartClick,
  cartItemCount 
}: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user}
        activeTab={activeTab}
        onTabChange={onTabChange}
        isOpen={isSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user}
          onMenuToggle={onMenuToggle}
          isMenuOpen={isSidebarOpen}
          // 2. Passamos as informações do carrinho para o Header
          onCartClick={onCartClick}
          cartItemCount={cartItemCount}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}