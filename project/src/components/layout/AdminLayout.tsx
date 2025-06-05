import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, FileText, BarChart2, Settings, Menu, X, Bell, LogOut,
  ChevronRight, Search
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Painel', href: '/admin/dashboard', icon: Home },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Conteúdo', href: '/admin/content', icon: FileText },
  { name: 'Relatórios', href: '/admin/reports', icon: BarChart2 },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate breadcrumbs based on current path
  const breadcrumbs = location.pathname.split('/')
    .filter(Boolean)
    .map((path, index, array) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + array.slice(0, index + 1).join('/'),
      current: index === array.length - 1
    }));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <span className="text-2xl font-bold text-gray-900">Admin</span>
                <button
                  className="ml-auto lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex flex-shrink-0 items-center px-4 py-4">
            <span className="text-2xl font-bold text-gray-900">Admin</span>
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex w-full md:ml-0">
                <div className="relative w-full max-w-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="search"
                    placeholder="Buscar..."
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="ml-3 flex items-center">
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Sair</span>
                  <LogOut className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Breadcrumbs */}
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.href}>
                      <div className="flex items-center">
                        {index !== 0 && (
                          <ChevronRight
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                        <Link
                          to={breadcrumb.href}
                          className={`ml-4 text-sm font-medium ${
                            breadcrumb.current
                              ? 'text-gray-700'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                          aria-current={breadcrumb.current ? 'page' : undefined}
                        >
                          {breadcrumb.name}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
              
              {/* Page content */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};