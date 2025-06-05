import { Patient, Professional, Admin } from '../types';

// Mock data for demonstration purposes
export const mockUsers: (Patient | Professional | Admin)[] = [
  {
    id: 'patient-1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    role: 'patient',
    createdAt: new Date('2024-01-15'),
    cpf: '123.456.789-00',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    healthInfo: {
      conditions: ['Hipertensão', 'Diabetes tipo 2'],
      allergies: ['Penicilina'],
      medications: ['Losartana 50mg', 'Metformina 850mg']
    },
    documents: [],
    level: 'silver',
    points: 750
  },
  {
    id: 'professional-1',
    name: 'Dra. Ana Oliveira',
    email: 'ana@example.com',
    phone: '(11) 99876-5432',
    role: 'professional',
    createdAt: new Date('2023-11-20'),
    crm: '123456/SP',
    specialty: 'Cardiologia',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 123',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    description: 'Especialista em doenças cardiovasculares com mais de 10 anos de experiência.',
    education: ['Faculdade de Medicina USP', 'Residência em Cardiologia InCor'],
    isApproved: true,
    appointmentPrice: 250,
    availableTimes: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '12:00' }
    ]
  },
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@docton.com',
    phone: '(11) 99999-9999',
    role: 'admin',
    createdAt: new Date('2023-10-01'),
    permissions: ['users.manage', 'content.manage', 'finance.manage']
  }
];