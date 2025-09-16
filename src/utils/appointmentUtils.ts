import { Appointment } from '../hooks/useAppointments';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'; // Importamos os ícones

/**
 * Valida se uma data é válida para agendamento
 */
export const isValidAppointmentDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30); // Máximo 30 dias no futuro

  if (date < today) return false;
  if (date > maxDate) return false;
  if (date.getDay() === 0) return false;

  return true;
};

/**
 * Verifica se o horário tem antecedência mínima de 24h
 */
export const hasMinimumAdvance = (date: Date, time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number);
  const appointmentDateTime = new Date(date);
  appointmentDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const minAdvanceTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

  return appointmentDateTime >= minAdvanceTime;
};

// ... (outras funções existentes podem ser mantidas)

/**
 * Obtém cor do status do agendamento
 */
export const getAppointmentStatusColor = (status: string): string => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'no-show': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Traduz status do agendamento
 */
export const translateAppointmentStatus = (status: string): string => {
  switch (status) {
    case 'scheduled': return 'Agendado';
    case 'confirmed': return 'Confirmado';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    case 'no-show': return 'Faltou';
    default: return status;
  }
};

/**
 * **NOVA FUNÇÃO ADICIONADA**
 * Obtém ícone do status do agendamento
 */
export const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return Clock;
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      case 'no-show': return AlertCircle;
      default: return Clock;
    }
};

// ... (o resto do seu arquivo utils/appointmentUtils.ts)
// Se houver outras funções, elas podem permanecer aqui.