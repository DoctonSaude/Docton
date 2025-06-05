import { Appointment } from '../types';

export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    patientId: 'patient-1',
    professionalId: 'professional-1',
    date: new Date('2025-05-20T10:00:00'),
    status: 'confirmed',
    createdAt: new Date('2025-05-15T14:30:00'),
  },
  {
    id: 'appointment-2',
    patientId: 'patient-1',
    professionalId: 'professional-2',
    date: new Date('2025-05-25T14:30:00'),
    status: 'scheduled',
    createdAt: new Date('2025-05-16T09:15:00'),
  },
  {
    id: 'appointment-3',
    patientId: 'patient-2',
    professionalId: 'professional-1',
    date: new Date('2025-05-19T11:00:00'),
    status: 'completed',
    notes: 'Paciente apresentou melhora significativa. Recomendado continuar com o tratamento atual.',
    createdAt: new Date('2025-05-12T16:45:00'),
  }
];