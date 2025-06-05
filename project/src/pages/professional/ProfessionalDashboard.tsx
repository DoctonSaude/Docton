import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { mockAppointments } from '../../mocks/appointments';

export const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  if (!user || user.role !== 'professional') {
    return <div>Carregando...</div>;
  }
  
  const professional = user;
  
  // Filter appointments for this professional
  const professionalAppointments = mockAppointments
    .filter(a => a.professionalId === professional.id)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaysAppointments = professionalAppointments.filter(a => {
    const appointmentDate = new Date(a.date);
    return appointmentDate >= today && appointmentDate < tomorrow;
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Get appointment status badge
  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') return <Badge variant="success">Confirmada</Badge>;
    if (status === 'scheduled') return <Badge variant="warning">Agendada</Badge>;
    if (status === 'canceled') return <Badge variant="danger">Cancelada</Badge>;
    if (status === 'completed') return <Badge variant="info">Concluída</Badge>;
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Painel do Profissional</h1>
        <Button rightIcon={<Calendar size={16} />}>
          Gerenciar agenda
        </Button>
      </div>
      
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4 bg-white/20 p-3 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Hoje</h3>
              <p className="text-3xl font-bold">{todaysAppointments.length}</p>
              <p className="text-sm opacity-80">consultas agendadas</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4 bg-white/20 p-3 rounded-lg">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pacientes</h3>
              <p className="text-3xl font-bold">45</p>
              <p className="text-sm opacity-80">atendidos este mês</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4 bg-white/20 p-3 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Próxima</h3>
              <p className="text-xl font-bold">
                {todaysAppointments.length > 0 
                  ? formatDate(todaysAppointments[0].date) 
                  : "Sem agendamentos"}
              </p>
              <p className="text-sm opacity-80">
                {todaysAppointments.length > 0 ? "consulta do dia" : "hoje"}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Today's schedule */}
      <Card 
        title="Agenda de hoje" 
        subtitle={formatFullDate(today)}
      >
        <div className="divide-y divide-gray-100">
          {todaysAppointments.length > 0 ? (
            todaysAppointments.map((appointment, index) => (
              <div key={appointment.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="bg-cyan-50 text-cyan-700 font-medium py-1 px-3 rounded-lg mr-4 text-center min-w-[80px]">
                    {formatDate(appointment.date)}
                  </div>
                  <div className="flex items-center">
                    <Avatar 
                      name="João Silva" 
                      size="md" 
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">João Silva</p>
                      <p className="text-sm text-gray-500">Primeira consulta</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center ml-14 md:ml-0">
                  {getStatusBadge(appointment.status)}
                  <div className="ml-3 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant={appointment.status === 'confirmed' ? 'success' : 'primary'}
                      leftIcon={<CheckCircle size={16} />}
                    >
                      {appointment.status === 'confirmed' ? 'Iniciar' : 'Confirmar'}
                    </Button>
                    {appointment.status !== 'completed' && appointment.status !== 'canceled' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        leftIcon={<XCircle size={16} />}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center">
              <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-3">Você não tem consultas agendadas para hoje</p>
              <Button variant="outline">Ver agenda completa</Button>
            </div>
          )}
        </div>
      </Card>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações rápidas</h3>
          <div className="space-y-3">
            <Button variant="secondary" fullWidth leftIcon={<Calendar size={18} />}>
              Definir disponibilidade
            </Button>
            <Button variant="outline" fullWidth leftIcon={<User size={18} />}>
              Ver pacientes
            </Button>
            <Button variant="outline" fullWidth leftIcon={<FileText size={18} />}>
              Prontuários
            </Button>
          </div>
        </Card>
        
        <Card className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo financeiro</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Este mês</p>
              <p className="text-2xl font-bold text-gray-900">R$ 5.250,00</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Pendente</p>
              <p className="text-2xl font-bold text-gray-900">R$ 1.200,00</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/professional/finance" className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
              Ver relatório completo
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};