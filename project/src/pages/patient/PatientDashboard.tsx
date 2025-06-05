import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Activity, Book, Award, Bell, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { mockAppointments } from '../../mocks/appointments';
import { mockHealthMetrics } from '../../mocks/healthMetrics';
import { mockContent } from '../../mocks/content';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'patient') {
    return <div>Carregando...</div>;
  }
  
  const patient = user;
  
  // Filter appointments for this patient
  const patientAppointments = mockAppointments
    .filter(a => a.patientId === patient.id)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const upcomingAppointment = patientAppointments.find(a => a.status === 'confirmed' || a.status === 'scheduled');
  
  // Get recent health metrics
  const recentMetrics = mockHealthMetrics
    .filter(m => m.patientId === patient.id)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 3);
  
  // Get recommended content based on patient conditions
  const recommendedContent = mockContent
    .filter(c => 
      c.relatedConditions?.some(condition => 
        patient.healthInfo.conditions.includes(condition)
      )
    )
    .slice(0, 2);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {patient.name.split(' ')[0]}!</h1>
        <div className="flex items-center space-x-1">
          <Badge variant="primary" rounded>{patient.level}</Badge>
          <span className="text-sm font-medium text-gray-600">{patient.points} pontos</span>
        </div>
      </div>
      
      {/* Upcoming appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card 
            title="Próxima consulta" 
            className={upcomingAppointment ? 'border-l-4 border-l-cyan-500' : ''}
          >
            {upcomingAppointment ? (
              <div>
                <p className="text-lg font-medium mb-2">
                  {formatDate(upcomingAppointment.date)}
                </p>
                <div className="flex items-center mb-4">
                  <Avatar 
                    name="Dra. Ana Oliveira" 
                    size="md"
                    status="online" 
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Dra. Ana Oliveira</p>
                    <p className="text-sm text-gray-500">Cardiologia</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button size="sm">Ver detalhes</Button>
                  <Button size="sm" variant="outline">Remarcar</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar size={40} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500 mb-4">Você não tem consultas agendadas</p>
                <Button>Agendar consulta</Button>
              </div>
            )}
          </Card>
        </div>
        
        <div>
          <Card title="Nível de saúde">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Seu progresso</span>
              <Badge variant="success" rounded>Bom</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Continue mantendo seus registros de saúde atualizados para melhorar seu nível.
            </p>
            <Button variant="secondary" size="sm" fullWidth rightIcon={<ArrowRight size={16} />}>
              Ver detalhes
            </Button>
          </Card>
        </div>
      </div>
      
      {/* Health Metrics */}
      <Card 
        title="Métricas recentes" 
        subtitle="Acompanhe seus indicadores de saúde"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentMetrics.length > 0 ? (
            recentMetrics.map(metric => (
              <div key={metric.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    {metric.type === 'bloodPressure' && 'Pressão Arterial'}
                    {metric.type === 'bloodGlucose' && 'Glicemia'}
                    {metric.type === 'weight' && 'Peso'}
                    {metric.type === 'symptoms' && 'Sintomas'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(metric.timestamp).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-800">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="ml-1 text-sm text-gray-500">{metric.unit}</span>
                  )}
                </div>
                {metric.notes && (
                  <p className="mt-2 text-xs text-gray-500">{metric.notes}</p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <Activity size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 mb-4">Nenhum registro encontrado</p>
              <Button size="sm">Registrar métrica</Button>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-right">
          <Link to="/patient/health" className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
            Ver todas as métricas
          </Link>
        </div>
      </Card>
      
      {/* Recommended content */}
      <Card title="Conteúdo recomendado" subtitle="Baseado no seu perfil de saúde">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedContent.map(content => (
            <div key={content.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 overflow-hidden">
                {content.imageUrl && (
                  <img 
                    src={content.imageUrl} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{content.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {content.category.slice(0, 2).map((cat, i) => (
                      <Badge key={i} variant="secondary" size="sm">{cat}</Badge>
                    ))}
                  </div>
                  <Link 
                    to={`/patient/content/${content.id}`}
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-800"
                  >
                    Ler mais
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-right">
          <Link to="/patient/content" className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
            Ver todo o conteúdo
          </Link>
        </div>
      </Card>
      
      {/* Tasks and Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          title="Tarefas pendentes" 
          subtitle="Complete para ganhar pontos"
        >
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 mr-3">
                <AlertCircle size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Atualizar medicamentos</p>
                <p className="text-sm text-gray-600">Verifique e atualize sua lista de medicamentos em uso</p>
                <div className="mt-2">
                  <Button size="sm" variant="secondary">Completar</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-cyan-50 rounded-lg">
              <div className="flex-shrink-0 mr-3">
                <Activity size={20} className="text-cyan-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Registrar pressão arterial</p>
                <p className="text-sm text-gray-600">Registre sua pressão arterial matinal</p>
                <div className="mt-2">
                  <Button size="sm" variant="secondary">Registrar</Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <Link to="/patient/tasks" className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
              Ver todas as tarefas
            </Link>
          </div>
        </Card>
        
        <Card 
          title="Notificações" 
          subtitle="Últimas atualizações"
        >
          <div className="space-y-3">
            <div className="flex items-start border-b border-gray-100 pb-3">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Bell size={16} className="text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800">Lembrete de consulta</p>
                <p className="text-sm text-gray-600">Sua consulta com Dra. Ana está confirmada para amanhã às 10:00</p>
                <span className="text-xs text-gray-400">Hoje, 14:30</span>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Award size={16} className="text-green-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800">Parabéns!</p>
                <p className="text-sm text-gray-600">Você completou uma semana registrando suas métricas de saúde</p>
                <span className="text-xs text-gray-400">Ontem, 09:15</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <Link to="/patient/notifications" className="text-sm font-medium text-cyan-600 hover:text-cyan-800">
              Ver todas as notificações
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};