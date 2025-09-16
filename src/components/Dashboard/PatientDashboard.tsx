import React from 'react';
import { 
  Calendar, 
  Star, 
  Trophy, 
  Heart, 
  ArrowRight,
  Stethoscope,
  FileText
} from 'lucide-react';

// 1. A INTERFACE AGORA DEFINE AS INFORMAÇÕES QUE O DASHBOARD VAI RECEBER
interface PatientDashboardProps {
  user: any;
  kpis: {
    nextAppointment?: any;
    points: number;
    challengesCompleted: number;
  };
  recentActivity: any[];
  onNavigate: (tab: string) => void;
}


export default function PatientDashboard({ user, kpis, recentActivity, onNavigate }: PatientDashboardProps) {

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nenhuma consulta agendada';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
  };

  const getIconForActivity = (type: string) => {
      if (type === 'compra') return <FileText className="w-5 h-5 text-green-600" />;
      if (type === 'desafio') return <Trophy className="w-5 h-5 text-yellow-600" />;
      return <Stethoscope className="w-5 h-5 text-blue-600" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Olá, {user?.name || 'Paciente'}!</h1>
        <p className="text-gray-500">Aqui está um resumo da sua jornada de saúde.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Próxima Consulta */}
        <div className="bg-white rounded-xl p-6 shadow-sm border col-span-1 md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex items-center gap-4">
                <Calendar className="w-10 h-10" />
                <div>
                    <p className="text-sm opacity-80">Próxima Consulta</p>
                    <p className="text-xl font-bold">{kpis.nextAppointment?.service || 'Nenhum agendamento'}</p>
                    <p className="text-md font-medium">{formatDate(kpis.nextAppointment?.date)}</p>
                </div>
            </div>
        </div>
        {/* Pontos Acumulados */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Pontos Acumulados</p>
            <div className="flex items-baseline gap-2">
                 <p className="text-3xl font-bold text-gray-800">{kpis.points}</p>
                 <Star className="w-5 h-5 text-yellow-500" />
            </div>
        </div>
        {/* Desafios Concluídos */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Desafios Concluídos</p>
             <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-800">{kpis.challengesCompleted}</p>
                <Trophy className="w-5 h-5 text-orange-500" />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
              <div className="space-y-4">
                  {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-full">
                            {getIconForActivity(activity.type)}
                          </div>
                          <p className="text-sm text-gray-700">{activity.description}</p>
                      </div>
                  ))}
              </div>
          </div>
          
          <div className="space-y-4">
              {/* 2. BOTÕES AGORA USAM A FUNÇÃO onNavigate */}
              <button onClick={() => onNavigate('serviceSearch')} className="w-full bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center text-left hover:border-emerald-500 hover:bg-emerald-50">
                  <div>
                    <h3 className="font-bold text-gray-800">Buscar Novos Serviços</h3>
                    <p className="text-sm text-gray-500">Encontre consultas e exames</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400"/>
              </button>
               <button onClick={() => onNavigate('myAppointments')} className="w-full bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center text-left hover:border-emerald-500 hover:bg-emerald-50">
                  <div>
                    <h3 className="font-bold text-gray-800">Ver Meus Atendimentos</h3>
                    <p className="text-sm text-gray-500">Acesse seu histórico de compras</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400"/>
              </button>
          </div>
      </div>
    </div>
  );
}