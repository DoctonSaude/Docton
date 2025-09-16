import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient'; // Importamos nosso cliente Supabase

// A interface do Agendamento permanece a mesma
export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
  duration: number;
  price: number;
  partnerId: string;
}

export interface AppointmentFilters {
  status: string;
  dateRange: string;
  search: string;
  serviceId?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayAppointments: number;
  weekRevenue: number;
}

/**
 * Hook para gerenciar agendamentos, conectado ao Supabase.
 */
export const useAppointments = (partnerId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca agendamentos do Supabase
  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase.from('appointments').select('*');

      // Se um ID de parceiro for fornecido, filtra por ele
      if (partnerId) {
        query = query.eq('partnerId', partnerId);
      }

      const { data, error: fetchError } = await query.order('date', { ascending: false });

      if (fetchError) throw fetchError;

      // Formata os dados para garantir compatibilidade com o frontend
      const formattedData = data.map(apt => ({
        ...apt,
        serviceId: apt.serviceId,
        serviceName: apt.serviceName,
        clientName: apt.clientName,
        clientEmail: apt.clientEmail,
        clientPhone: apt.clientPhone,
        createdAt: apt.createdAt,
        partnerId: apt.partnerId,
      }));

      setAppointments(formattedData || []);
    } catch (err: any) {
      setError('Erro ao carregar agendamentos.');
      console.error('Erro ao buscar agendamentos:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  // Cria um novo agendamento no Supabase
  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      setIsLoading(true);
      
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      await fetchAppointments(); // Recarrega a lista
      return data;
    } catch (err: any) {
      setError('Erro ao criar agendamento.');
      console.error('Erro ao criar agendamento:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);

  // Atualiza um agendamento no Supabase
  const updateAppointment = useCallback(async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      setIsLoading(true);
      
      const { error: updateError } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId);
        
      if (updateError) throw updateError;
      
      await fetchAppointments(); // Recarrega a lista
    } catch (err: any) {
      setError('Erro ao atualizar agendamento.');
      console.error('Erro ao atualizar agendamento:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);
  
  // Cancela um agendamento
   const cancelAppointment = useCallback(async (appointmentId: string, reason?: string) => {
    try {
      setIsLoading(true);

      const updates = {
          status: 'cancelled',
          notes: `Cancelado: ${reason || 'Motivo não informado'}`
      };
      
      const { error: cancelError } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId);
        
      if (cancelError) throw cancelError;
      
      await fetchAppointments();
    } catch (err: any) {
      setError('Erro ao cancelar agendamento.');
      console.error('Erro ao cancelar agendamento:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);

  // Busca horários disponíveis em uma data, verificando os agendamentos existentes
  const getAvailableTimeSlots = useCallback(async (date: Date): Promise<TimeSlot[]> => {
    try {
      const dateString = date.toISOString().split('T')[0];
      
      // Busca no Supabase todos os horários já agendados para a data selecionada
      const { data: existingAppointments, error: fetchError } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', dateString);

      if (fetchError) throw fetchError;

      const occupiedSlots = existingAppointments?.map(apt => apt.time) || [];
      const slots: TimeSlot[] = [];
      const startHour = 8, endHour = 18, slotInterval = 30;

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotInterval) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const isOccupied = occupiedSlots.includes(time);
          
          const appointmentDateTime = new Date(date);
          appointmentDateTime.setHours(hour, minute, 0, 0);
          const now = new Date();
          const minAdvanceTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          const hasMinimumAdvance = appointmentDateTime >= minAdvanceTime;

          slots.push({
            time,
            available: !isOccupied && hasMinimumAdvance,
            reason: isOccupied ? 'Horário ocupado' : !hasMinimumAdvance ? 'Antecedência mínima de 24h' : undefined
          });
        }
      }
      return slots;
    } catch (err: any) {
      console.error('Erro ao buscar horários:', err.message);
      return [];
    }
  }, []);
  
  // A lógica de filtros, estatísticas e validações permanece a mesma
  // ... (o restante do código do hook pode ser mantido como estava, pois ele opera sobre o estado 'appointments')
   const filterAppointments = (filters: AppointmentFilters): Appointment[] => {
    return appointments.filter(apt => {
      // Filtro por status
      if (filters.status !== 'all' && apt.status !== filters.status) {
        return false;
      }
      
      // Filtro por serviço
      if (filters.serviceId && apt.serviceId !== filters.serviceId) {
        return false;
      }
      
      // Filtro por data
      if (filters.dateRange !== 'all') {
        const today = new Date();
        const aptDate = new Date(apt.date);
        
        switch (filters.dateRange) {
          case 'today':
            if (aptDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (aptDate < today || aptDate > weekFromNow) return false;
            break;
          case 'month':
            const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            if (aptDate < today || aptDate > monthFromNow) return false;
            break;
        }
      }
      
      // Filtro por busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = apt.clientName.toLowerCase().includes(searchLower);
        const matchesService = apt.serviceName.toLowerCase().includes(searchLower);
        const matchesEmail = apt.clientEmail.toLowerCase().includes(searchLower);
        const matchesPhone = apt.clientPhone.includes(filters.search);
        
        if (!matchesName && !matchesService && !matchesEmail && !matchesPhone) {
          return false;
        }
      }
      
      return true;
    });
  };

  const getStats = (): AppointmentStats => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const todayAppointments = appointments.filter(apt => apt.date === today).length;
    const weekRevenue = appointments
      .filter(apt => new Date(apt.date) >= weekAgo && apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.price, 0);
    
    return {
      total: appointments.length,
      scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      noShow: appointments.filter(apt => apt.status === 'no-show').length,
      todayAppointments,
      weekRevenue
    };
  };

  const validateAppointment = (appointment: Partial<Appointment>): string[] => {
    const errors: string[] = [];
    
    if (!appointment.clientName?.trim()) errors.push('Nome do cliente é obrigatório');
    if (!appointment.clientEmail?.trim()) errors.push('E-mail do cliente é obrigatório');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointment.clientEmail)) errors.push('E-mail inválido');
    if (!appointment.clientPhone?.trim()) errors.push('Telefone do cliente é obrigatório');
    if (!appointment.date) errors.push('Data é obrigatória');
    if (!appointment.time) errors.push('Horário é obrigatório');
    if (!appointment.serviceId) errors.push('Serviço é obrigatório');
    
    return errors;
  };
  
  // Carregar dados na inicialização
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAvailableTimeSlots,
    filterAppointments,
    getStats,
    validateAppointment,
    refreshAppointments: fetchAppointments
  };
};