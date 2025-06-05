// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'professional' | 'admin';
  createdAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  cpf: string;
  address: Address;
  healthInfo: {
    conditions: string[];
    allergies: string[];
    medications: string[];
  };
  documents: Document[];
  level: 'bronze' | 'silver' | 'gold';
  points: number;
}

export interface Professional extends User {
  role: 'professional';
  crm: string;
  specialty: string;
  address: Address;
  description: string;
  education: string[];
  isApproved: boolean;
  appointmentPrice: number;
  availableTimes: AvailableTime[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Address type
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// Document type
export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

// Appointment types
export interface Appointment {
  id: string;
  patientId: string;
  professionalId: string;
  date: Date;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed';
  notes?: string;
  createdAt: Date;
}

export interface AvailableTime {
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
}

// Health tracking types
export interface HealthMetric {
  id: string;
  patientId: string;
  type: 'bloodPressure' | 'bloodGlucose' | 'weight' | 'symptoms' | 'other';
  value: string;
  unit?: string;
  timestamp: Date;
  notes?: string;
}

// Content types
export interface EducationalContent {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string[];
  imageUrl?: string;
  videoUrl?: string;
  authorId: string;
  publishDate: Date;
  relatedConditions?: string[];
}

// Payment types
export interface Subscription {
  id: string;
  userId: string;
  planType: 'monthly' | 'annual' | 'free';
  status: 'active' | 'inactive' | 'pending';
  startDate: Date;
  endDate: Date;
  price: number;
}

export interface Payment {
  id: string;
  appointmentId?: string;
  subscriptionId?: string;
  amount: number;
  platformFee: number;
  professionalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit' | 'debit' | 'pix' | 'other';
  createdAt: Date;
}

// Gamification types
export interface Task {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  points: number;
  isCompleted: boolean;
  dueDate?: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  isAvailable: boolean;
}