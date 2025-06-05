import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Home, Calendar, FileText, Activity, Book, Award, DollarSign, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../ui/Logo';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const commonItems = [
      { path: '/settings', label: 'Configurações', icon: <Settings size={20} /> },
    ];

    if (user.role === 'patient') {
      return [
        { path: '/patient/dashboard', label: 'Início', icon: <Home size={20} /> },
        { path: '/patient/appointments', label: 'Consultas', icon: <Calendar size={20} /> },
        { path: '/patient/health', label: 'Minha Saúde', icon: <Activity size={20} /> },
        { path: '/patient/content', label: 'Conteúdos', icon: <Book size={20} /> },
        { path: '/patient/rewards', label: 'Recompensas', icon: <Award size={20} /> },
        { path: '/patient/subscription', label: 'Assinatura', icon: <DollarSign size={20} /> },
        ...commonItems
      ];
    }
    
    if (user.role === 'professional') {
      return [
        { path: '/professional/dashboard', label: 'Início', icon: <Home size={20} /> },
        { path: '/professional/appointments', label: 'Agenda', icon: <Calendar size={20} /> },
        { path: '/professional/patients', label: 'Pacientes', icon: <User size={20} /> },
        { path: '/professional/records', label: 'Prontuários', icon: <FileText size={20} /> },
        { path: '/professional/finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
        ...commonItems
      ];
    }
    
    if (user.role === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Painel', icon: <Home size={20} /> },
        { path: '/admin/users', label: 'Usuários', icon: <User size={20} /> },
        { path: '/admin/content', label: 'Conteúdos', icon: <Book size={20} /> },
        { path: '/admin/finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
        ...commonItems
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:block">
                <Logo size="small" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell size={20} />
              </button>
              <div className="relative">
                <Link 
                  to="/profile" 
                  className="flex items-center text-sm text-gray-700 hover:text-cyan-600"
                >
                  <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 mr-2">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline-block">{user.name}</span>
                </Link>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <div className={`fixed inset-0 z-20 transition-opacity ${sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg transform transition ease-in-out duration-300">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Logo size="small" />
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md mb-1 ${
                      location.pathname === item.path
                        ? 'text-cyan-700 bg-cyan-50'
                        : 'text-gray-600 hover:text-cyan-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-1 px-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${
                        location.pathname === item.path
                          ? 'text-cyan-700 bg-cyan-50'
                          : 'text-gray-600 hover:text-cyan-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper component for type safety with Navigate
import { Navigate } from 'react-router-dom';