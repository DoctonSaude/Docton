/**
 * Utilitários para gerenciamento de serviços
 */

import { Service } from '../hooks/useServices';

/**
 * Calcula o preço com desconto aplicado
 */
export const calculateDiscountedPrice = (price: number, discount: number): number => {
  return price * (1 - discount / 100);
};

/**
 * Formata valor monetário para exibição
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata duração em minutos para texto legível
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Gera slug para URL amigável
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
};

/**
 * Valida dados do serviço
 */
export const validateService = (service: Partial<Service>): string[] => {
  const errors: string[] = [];
  
  if (!service.name || service.name.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');
  }
  
  if (!service.description || service.description.trim().length < 10) {
    errors.push('Descrição deve ter pelo menos 10 caracteres');
  }
  
  if (!service.price || service.price <= 0) {
    errors.push('Preço deve ser maior que zero');
  }
  
  if (!service.duration || service.duration < 15) {
    errors.push('Duração deve ser de pelo menos 15 minutos');
  }
  
  if (service.discountBasic && (service.discountBasic < 0 || service.discountBasic > 100)) {
    errors.push('Desconto básico deve estar entre 0% e 100%');
  }
  
  if (service.discountPremium && (service.discountPremium < 0 || service.discountPremium > 100)) {
    errors.push('Desconto premium deve estar entre 0% e 100%');
  }
  
  if (service.discountBasic && service.discountPremium && service.discountPremium <= service.discountBasic) {
    errors.push('Desconto premium deve ser maior que o desconto básico');
  }
  
  return errors;
};

/**
 * Calcula estatísticas de performance do serviço
 */
export const calculateServicePerformance = (service: Service) => {
  const revenuePerBooking = service.bookings > 0 ? service.revenue / service.bookings : 0;
  const conversionRate = service.totalReviews > 0 ? (service.bookings / service.totalReviews) * 100 : 0;
  
  return {
    revenuePerBooking,
    conversionRate,
    averageRating: service.rating,
    totalBookings: service.bookings,
    totalRevenue: service.revenue
  };
};

/**
 * Gera dados para exportação
 */
export const exportServicesData = (services: Service[]) => {
  const exportData = services.map(service => ({
    'Nome': service.name,
    'Categoria': service.category,
    'Preço': formatCurrency(service.price),
    'Desconto Básico': `${service.discountBasic}%`,
    'Desconto Premium': `${service.discountPremium}%`,
    'Duração': formatDuration(service.duration),
    'Avaliação': service.rating.toFixed(1),
    'Total Avaliações': service.totalReviews,
    'Agendamentos': service.bookings,
    'Receita': formatCurrency(service.revenue),
    'Status': service.isActive ? 'Ativo' : 'Inativo',
    'Criado em': new Date(service.createdAt).toLocaleDateString('pt-BR'),
    'Atualizado em': new Date(service.updatedAt).toLocaleDateString('pt-BR')
  }));
  
  return exportData;
};

/**
 * Exporta dados em formato CSV
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => `"${row[header] || ''}"`).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Categorias de serviços disponíveis
 */
export const SERVICE_CATEGORIES = [
  { id: 'consultation', name: 'Consultas', description: 'Consultas médicas especializadas' },
  { id: 'exam', name: 'Exames', description: 'Exames diagnósticos e laboratoriais' },
  { id: 'surgery', name: 'Cirurgias', description: 'Procedimentos cirúrgicos' },
  { id: 'therapy', name: 'Terapias', description: 'Tratamentos terapêuticos' },
  { id: 'emergency', name: 'Emergência', description: 'Atendimentos de emergência' },
  { id: 'prevention', name: 'Prevenção', description: 'Serviços preventivos e check-ups' }
];

/**
 * Tags sugeridas por categoria
 */
export const SUGGESTED_TAGS = {
  consultation: ['Consulta', 'Especialista', 'Diagnóstico', 'Tratamento', 'Acompanhamento'],
  exam: ['Exame', 'Diagnóstico', 'Laudo', 'Análise', 'Resultado'],
  surgery: ['Cirurgia', 'Procedimento', 'Operação', 'Intervenção', 'Tratamento'],
  therapy: ['Terapia', 'Reabilitação', 'Tratamento', 'Recuperação', 'Fisioterapia'],
  emergency: ['Emergência', 'Urgência', 'Pronto Socorro', 'Atendimento', '24h'],
  prevention: ['Prevenção', 'Check-up', 'Rastreamento', 'Vacinação', 'Orientação']
};