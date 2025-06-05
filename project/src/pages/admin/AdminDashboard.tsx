import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, DollarSign, BarChart2, AlertTriangle, CheckCircle2, UserPlus, BookOpen } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
        <div className="flex space-x-3">
          <Button variant="outline" leftIcon={<FileText size={16} />}>
            Exportar relatórios
          </Button>
          <Button leftIcon={<UserPlus size={16} />}>
            Adicionar usuário
          </Button>
        </div>
      </div>
      
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3 bg-blue-100 p-3 rounded-full">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Usuários totais</p>
              <p className="text-2xl font-bold text-gray-900">1,254</p>
              <p className="text-xs text-green-600">
                <span className="font-medium">+12%</span> este mês
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3 bg-green-100 p-3 rounded-full">
              <BarChart2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultas realizadas</p>
              <p className="text-2xl font-bold text-gray-900">872</p>
              <p className="text-xs text-green-600">
                <span className="font-medium">+8%</span> este mês
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3 bg-purple-100 p-3 rounded-full">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conteúdos publicados</p>
              <p className="text-2xl font-bold text-gray-900">56</p>
              <p className="text-xs text-green-600">
                <span className="font-medium">+3</span> esta semana
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3 bg-amber-100 p-3 rounded-full">
              <DollarSign size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receita total</p>
              <p className="text-2xl font-bold text-gray-900">R$ 156.750</p>
              <p className="text-xs text-green-600">
                <span className="font-medium">+15%</span> este mês
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card 
            title="Profissionais aguardando aprovação" 
            subtitle="Revise os documentos e aprove os profissionais"
          >
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <AlertTriangle size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">5 profissionais aguardando revisão</p>
                      <p className="text-sm text-gray-600">Avalie as credenciais para liberar o acesso à plataforma</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Revisar agora
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg divide-y divide-gray-100">
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-3 md:mb-0">
                    <img 
                      src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Dr. Ricardo Mendes"
                      className="h-10 w-10 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <p className="font-medium">Dr. Ricardo Mendes</p>
                      <p className="text-sm text-gray-500">Neurologista • CRM 45678/SP</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Ver documentos</Button>
                    <Button size="sm" variant="success" leftIcon={<CheckCircle2 size={16} />}>Aprovar</Button>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-3 md:mb-0">
                    <img 
                      src="https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Dra. Camila Santos"
                      className="h-10 w-10 rounded-full object-cover mr-3" 
                    />
                    <div>
                      <p className="font-medium">Dra. Camila Santos</p>
                      <p className="text-sm text-gray-500">Pediatra • CRM 56789/RJ</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Ver documentos</Button>
                    <Button size="sm" variant="success" leftIcon={<CheckCircle2 size={16} />}>Aprovar</Button>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Link to="/admin/professionals" className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
                  Ver todos os profissionais
                </Link>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card 
            title="Resumo financeiro" 
            subtitle="Visão geral do mês atual"
          >
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Receita total</span>
                <span className="font-semibold">R$ 156.750,00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Comissões (20%)</span>
                <span className="font-semibold">R$ 31.350,00</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Repasses aos profissionais</span>
                <span className="font-semibold">R$ 125.400,00</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-gray-600">Assinaturas</span>
                <span className="font-semibold">R$ 45.200,00</span>
              </div>
            </div>
            
            <Button fullWidth>Ver relatório completo</Button>
          </Card>
          
          <div className="mt-6">
            <Card 
              title="Ações rápidas" 
            >
              <div className="space-y-3">
                <Button fullWidth variant="secondary" leftIcon={<BookOpen size={18} />}>
                  Novo conteúdo
                </Button>
                <Button fullWidth variant="outline" leftIcon={<Users size={18} />}>
                  Gerenciar usuários
                </Button>
                <Button fullWidth variant="outline" leftIcon={<BarChart2 size={18} />}>
                  Relatórios
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};