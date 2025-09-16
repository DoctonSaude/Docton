// Type definitions for the Docton platform
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'partner' | 'admin' | 'company';
  plan?: 'free' | 'basic' | 'premium';
  points?: number;
  avatar?: string;
  createdAt: string;
}

export interface Patient extends User {
  role: 'patient';
  plan: 'free' | 'basic' | 'premium';
  points: number;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
}

export interface Partner extends User {
  role: 'partner';
  type: 'clinic' | 'doctor';
  cnpj?: string;
  crm?: string;
  services: Service[];
  earnings: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  discountBasic: number;
  discountPremium: number;
  partnerId: string;
  duration: number;
  description: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  partnerId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  finalPrice: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline: string;
  type: 'upload' | 'data';
  sponsored: boolean;
  sponsorName?: string;
  participants: number;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'exam' | 'prescription' | 'consultation';
  title: string;
  description: string;
  fileUrl?: string;
  doctorName: string;
}