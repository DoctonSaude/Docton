import { HealthMetric } from '../types';

export const mockHealthMetrics: HealthMetric[] = [
  {
    id: 'metric-1',
    patientId: 'patient-1',
    type: 'bloodPressure',
    value: '120/80',
    unit: 'mmHg',
    timestamp: new Date('2025-05-17T08:00:00'),
    notes: 'Medição matinal em jejum'
  },
  {
    id: 'metric-2',
    patientId: 'patient-1',
    type: 'bloodGlucose',
    value: '110',
    unit: 'mg/dL',
    timestamp: new Date('2025-05-17T08:05:00'),
    notes: 'Medição matinal em jejum'
  },
  {
    id: 'metric-3',
    patientId: 'patient-1',
    type: 'weight',
    value: '78.5',
    unit: 'kg',
    timestamp: new Date('2025-05-17T08:10:00')
  },
  {
    id: 'metric-4',
    patientId: 'patient-1',
    type: 'bloodPressure',
    value: '125/85',
    unit: 'mmHg',
    timestamp: new Date('2025-05-16T08:00:00')
  },
  {
    id: 'metric-5',
    patientId: 'patient-1',
    type: 'bloodGlucose',
    value: '115',
    unit: 'mg/dL',
    timestamp: new Date('2025-05-16T08:05:00')
  },
  {
    id: 'metric-6',
    patientId: 'patient-1',
    type: 'bloodPressure',
    value: '118/78',
    unit: 'mmHg',
    timestamp: new Date('2025-05-15T08:00:00')
  },
  {
    id: 'metric-7',
    patientId: 'patient-1',
    type: 'bloodGlucose',
    value: '108',
    unit: 'mg/dL',
    timestamp: new Date('2025-05-15T08:05:00')
  }
];