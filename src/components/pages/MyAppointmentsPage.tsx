import React, { useState } from 'react';
import { ArrowLeft, FileText, CheckCircle, Clock, XCircle, QrCode, Download, Printer, Star } from 'lucide-react';
import AttendanceGuideModal from './AttendanceGuideModal';

// 1. A INTERFACE AGORA ESPERA RECEBER A FUNÇÃO PARA NAVEGAR
interface MyAppointmentsPageProps {
  onNavigateToReview: (appointment: any) => void;
}

interface Appointment {
  id: string;
  serviceName: string;
  partnerName: string;
  date: string;
  price: number;
  status: 'realizado' | 'aprovado' | 'cancelado';
  guideCode: string;
  reviewed: boolean; // Novo campo para saber se já foi avaliado
}

const mockAppointments: Appointment[] = [
  { id: '1', serviceName: 'Hemograma Completo', partnerName: 'Laboratório Diagnóstico Plus', date: '2024-07-20T10:00:00Z', price: 180.00, status: 'realizado', guideCode: 'DOCTON-12345', reviewed: true },
  { id: '2', serviceName: 'Consulta Cardiológica', partnerName: 'Clínica CardioVida', date: '2024-07-25T15:30:00Z', price: 280.00, status: 'aprovado', guideCode: 'DOCTON-67890', reviewed: false },
  { id: '3', serviceName: 'Sessão de Fisioterapia', partnerName: 'Fisio Center', date: '2024-06-15T09:00:00Z', price: 120.00, status: 'cancelado', guideCode: 'DOCTON-11223', reviewed: false },
  { id: '4', serviceName: 'Consulta de Rotina', partnerName: 'Clínica Bem Estar', date: '2024-07-18T11:00:00Z', price: 150.00, status: 'realizado', guideCode: 'DOCTON-45678', reviewed: false },
];

export default function MyAppointmentsPage({ onNavigateToReview }: MyAppointmentsPageProps) {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleOpenGuide = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsGuideVisible(true);
  };
  
  const handleCloseGuide = () => {
      setIsGuideVisible(false);
      setSelectedAppointment(null);
  }

  const getStatusInfo = (status: 'realizado' | 'aprovado' | 'cancelado') => {
    switch (status) {
      case 'realizado': return { text: 'Realizado', icon: CheckCircle, color: 'bg-green-100 text-green-700' };
      case 'aprovado': return { text: 'Pagamento Aprovado', icon: Clock, color: 'bg-yellow-100 text-yellow-700' };
      case 'cancelado': return { text: 'Cancelado', icon: XCircle, color: 'bg-red-100 text-red-700' };
    }
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Meus Atendimentos</h1>
          </div>

          <div className="space-y-4">
            {appointments.map(apt => {
              const statusInfo = getStatusInfo(apt.status);
              const StatusIcon = statusInfo.icon;
              return (
                <div key={apt.id} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-grow">
                      <span className="text-sm text-gray-500">{formatDate(apt.date)}</span>
                      <h2 className="text-lg font-bold text-gray-800">{apt.serviceName}</h2>
                      <p className="text-sm text-gray-600">Realizado em: {apt.partnerName}</p>
                      <div className={`mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.text}
                      </div>
                    </div>

                    <div className="text-left sm:text-right flex-shrink-0 space-y-2">
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(apt.price)}</p>
                      {apt.status !== 'cancelado' && (
                         <button onClick={() => handleOpenGuide(apt)} className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                           <QrCode className="w-4 h-4" />
                           Ver Guia
                         </button>
                      )}
                      {/* 2. BOTÃO DE AVALIAÇÃO APARECE SE O ATENDIMENTO FOI REALIZADO */}
                      {apt.status === 'realizado' && (
                          apt.reviewed ? (
                              <div className="text-sm text-green-600 font-semibold flex items-center justify-center gap-1"><CheckCircle size={16}/> Avaliado</div>
                          ) : (
                              <button onClick={() => onNavigateToReview(apt)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm">
                                  <Star className="w-4 h-4" />
                                  Avaliar Atendimento
                              </button>
                          )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {isGuideVisible && selectedAppointment && (
        <AttendanceGuideModal 
            appointment={selectedAppointment}
            onClose={handleCloseGuide}
        />
      )}
    </>
  );
}
