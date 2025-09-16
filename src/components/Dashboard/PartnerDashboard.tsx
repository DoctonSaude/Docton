import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  QrCode,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react';

// --- Dados de Exemplo (Temporários) ---
const mockDashboardData = {
  metrics: {
    todayAppointments: 8,
    pendingRevenue: 12450.75,
    newAppointmentsWeek: 15,
    averageRating: 4.9,
  },
  agenda: [
    { id: '1', time: '09:00', patientName: 'Ana Clara Lima', service: 'Hemograma Completo', status: 'confirmed' },
    { id: '2', time: '09:30', patientName: 'Bruno Martins', service: 'Consulta Cardiológica', status: 'confirmed' },
    { id: '3', time: '10:00', patientName: 'Carlos Eduardo Souza', service: 'Exame de Rotina', status: 'arrived' },
    { id: '4', time: '11:00', patientName: 'Daniela Ferreira', service: 'Ultrassom Abdominal', status: 'confirmed' },
  ]
};
// -----------------------------------------

export default function PartnerDashboard() {
  const [data, setData] = useState(mockDashboardData);
  const [validationCode, setValidationCode] = useState('');
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationCode) return;
    
    // Simula a validação do código
    setValidationResult(`Código "${validationCode}" validado com sucesso! Atendimento de Carlos E. Souza registrado.`);
    setValidationCode('');
    
    setTimeout(() => {
      setValidationResult(null);
    }, 5000); // Limpa a mensagem após 5 segundos
  };

  return (
    <div className="p-6 space-y-6">
      {/* --- Cabeçalho --- */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard do Parceiro</h1>

      {/* --- Métricas Rápidas --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Atendimentos para Hoje</p>
                    <span className="text-3xl font-bold text-gray-800">{data.metrics.todayAppointments}</span>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500">A Receber no Mês</p>
                    <span className="text-3xl font-bold text-gray-800">{formatCurrency(data.metrics.pendingRevenue)}</span>
                </div>
                 <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                </div>
            </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
             <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Novos Agendamentos (Semana)</p>
                    <span className="text-3xl font-bold text-gray-800">{data.metrics.newAppointmentsWeek}</span>
                </div>
                 <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                </div>
            </div>
        </div>
         <div className="bg-white rounded-xl p-6 shadow-sm border">
             <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500">Sua Avaliação Média</p>
                    <span className="text-3xl font-bold text-gray-800">{data.metrics.averageRating}</span>
                </div>
                 <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-500" />
                </div>
            </div>
        </div>
      </div>

      {/* --- Validação e Agenda --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Validação de Atendimento (Check-in) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Atendimento</h2>
          <p className="text-sm text-gray-500 mb-4">Digite o código da guia do paciente ou escaneie o QR Code para validar o check-in.</p>
          <form onSubmit={handleValidateCode} className="space-y-4">
            <input 
              type="text"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value.toUpperCase())}
              placeholder="Ex: DOCTON-12345"
              className="w-full p-3 border border-gray-300 rounded-lg text-center font-mono tracking-widest focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
                <button type="button" className="w-1/2 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5"/>
                    Escanear
                </button>
                 <button type="submit" className="w-1/2 bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600">
                    Validar Código
                </button>
            </div>
          </form>
          {validationResult && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {validationResult}
              </div>
          )}
        </div>

        {/* Agenda do Dia */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Agenda de Hoje</h2>
            <div className="space-y-4">
                {data.agenda.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border-l-4 rounded-r-lg border-blue-500 bg-blue-50">
                        <div className="text-center w-16">
                            <p className="font-bold text-lg text-blue-700">{item.time}</p>
                        </div>
                        <div className="border-l border-blue-200 pl-4 flex-grow">
                            <p className="font-semibold text-gray-800">{item.patientName}</p>
                            <p className="text-sm text-gray-600">{item.service}</p>
                        </div>
                        {item.status === 'confirmed' ? (
                            <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                                <Clock className="w-4 h-4" />
                                <span>Aguardando</span>
                            </div>
                        ) : (
                             <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <UserCheck className="w-4 h-4" />
                                <span>Chegou</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}