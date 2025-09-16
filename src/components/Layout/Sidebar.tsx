import React from 'react';
import {
  Home,
  User as UserIcon,
  HeartPulse,
  Settings,
  FileClock,
  BookUser,
  LayoutGrid,
  ClipboardList,
  DollarSign,
  CalendarDays,
  Briefcase,
  ShieldCheck,
  Building2,
  Landmark,
  Send,
  Star,
  Trophy,
  LifeBuoy,
  Share2,
  BarChart2,
  Lock,
  Tag,
  Users,
  Gift // 1. NOVO ÍCONE PARA RECOMPENSAS
} from 'lucide-react';

interface SidebarProps {
  user: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ user, activeTab, onTabChange, isOpen }: SidebarProps) {

  const patientMenuItems = [
    { id: 'patientDashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'serviceSearch', label: 'Buscar Serviços', icon: Home },
    { id: 'myAppointments', label: 'Meus Atendimentos', icon: FileClock },
    { id: 'medicalHistory', label: 'Meu Prontuário', icon: BookUser },
    { id: 'challenges', label: 'Desafios', icon: Trophy },
    { id: 'subscription', label: 'Planos e Assinaturas', icon: Star },
    { id: 'support', label: 'Suporte', icon: LifeBuoy },
  ];

  const partnerMenuItems = [
    { id: 'partnerDashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'partnerAgenda', label: 'Agenda Completa', icon: CalendarDays },
    { id: 'partnerServices', label: 'Meus Serviços', icon: ClipboardList },
    { id: 'partnerTeam', label: 'Gestão de Equipe', icon: Users },
    { id: 'partnerReviews', label: 'Avaliações', icon: Star },
    { id: 'partnerReports', label: 'Relatórios', icon: BarChart2 },
    { id: 'partnerFinancial', label: 'Extrato de Repasses', icon: DollarSign },
    { id: 'partnerProfile', label: 'Perfil Público', icon: Building2 },
    { id: 'partnerFinancialSetup', label: 'Dados Financeiros', icon: Landmark },
    { id: 'support', label: 'Suporte', icon: LifeBuoy },
  ];

  // 2. ADICIONAMOS O ITEM "GESTÃO DE RECOMPENSAS" AO MENU DO ADMIN
  const adminMenuItems = [
      { id: 'adminDashboard', label: 'Dashboard', icon: LayoutGrid },
      { id: 'adminReports', label: 'Relatórios', icon: BarChart2 },
      { id: 'adminPartners', label: 'Gestão de Parceiros', icon: Briefcase },
      { id: 'adminPatients', label: 'Gestão de Usuários', icon: UserIcon },
      { id: 'adminChallenges', label: 'Gestão de Desafios', icon: Trophy },
      { id: 'adminRewards', label: 'Gestão de Recompensas', icon: Gift }, // <- NOVO ITEM AQUI
      { id: 'adminFinancial', label: 'Financeiro Central', icon: DollarSign },
      { id: 'adminPayouts', label: 'Gestão de Repasses', icon: Send },
      { id: 'adminSubscriptions', label: 'Acompanhar Planos', icon: Star },
      { id: 'adminPriceManagement', label: 'Gestão de Preços', icon: Tag },
      { id: 'adminApprovals', label: 'Aprovações Pendentes', icon: ShieldCheck },
      { id: 'adminApiIntegrations', label: 'APIs e Integrações', icon: Share2 },
      { id: 'adminPermissions', label: 'Permissões', icon: Lock },
      { id: 'support', label: 'Suporte', icon: LifeBuoy },
  ];

  const getMenuItems = () => {
      switch (user?.role) {
          case 'partner': return partnerMenuItems;
          case 'admin': return adminMenuItems;
          default: return patientMenuItems;
      }
  }

  const menuItems = getMenuItems();


  return (
    <div className={`bg-blue-700 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex-shrink-0 flex flex-col`}>
      <div className="h-20 flex items-center justify-center border-b border-blue-800">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <HeartPulse className="w-6 h-6 text-blue-700" />
        </div>
        {isOpen && <span className="text-xl font-bold ml-2">Docton</span>}
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isOpen ? '' : item.label}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-white text-blue-700 font-bold'
                  : 'hover:bg-blue-600'
              } ${!isOpen && 'justify-center'}`}
            >
              <Icon className="w-6 h-6" />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-blue-800 mt-auto">
        {user?.role === 'admin' ? (
            <button onClick={() => onTabChange('adminSettings')} className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 ${!isOpen && 'justify-center'} ${activeTab === 'adminSettings' ? 'bg-blue-600' : ''}`}>
              <Settings className="w-6 h-6" />
              {isOpen && <span>Configurações</span>}
            </button>
        ) : (
            <button onClick={() => onTabChange('userProfile')} className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-600 ${!isOpen && 'justify-center'} ${activeTab === 'userProfile' ? 'bg-blue-600' : ''}`}>
              <Settings className="w-6 h-6" />
              {isOpen && <span>Minha Conta</span>}
            </button>
        )}
      </div>
    </div>
  );
}
