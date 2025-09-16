import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient'; // Importamos nosso cliente Supabase

// A interface do Serviço permanece a mesma
export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountBasic: number;
  discountPremium: number;
  duration: number;
  image: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  bookings: number;
  revenue: number;
  tags: string[];
  requirements?: string;
  preparation?: string;
  partnerId: string; // Adicionado para ligar o serviço ao parceiro
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  category: string;
  search: string;
  isActive?: boolean;
  priceRange?: [number, number];
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
}

/**
 * Hook personalizado para gerenciar serviços, agora conectado ao Supabase.
 */
export const useServices = (partnerId: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar serviços do parceiro a partir do Supabase
  const fetchServices = useCallback(async () => {
    if (!partnerId) return; // Não faz nada se não houver um ID de parceiro

    try {
      setIsLoading(true);
      setError(null);

      // Busca na tabela 'services' onde 'partnerId' é igual ao ID do parceiro logado
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        // .eq('partnerId', partnerId) // Descomente esta linha quando tiver a lógica de parceiros
        .order('createdAt', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      
      // O Supabase retorna nomes de colunas com `_`, o frontend espera `camelCase`.
      // Esta função formata os dados para garantir a compatibilidade.
      const formattedData = data.map(service => ({
        ...service,
        discountBasic: service.discountBasic,
        discountPremium: service.discountPremium,
        totalReviews: service.totalReviews,
        isActive: service.isActive,
        partnerId: service.partnerId,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      }));

      setServices(formattedData || []);
    } catch (err: any) {
      setError('Erro ao carregar serviços');
      console.error('Erro ao buscar serviços:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  // Criar novo serviço no Supabase
  const createService = useCallback(async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'bookings' | 'revenue' | 'rating' | 'totalReviews' | 'partnerId'>) => {
    try {
      setIsLoading(true);

      const newServiceData = {
        ...serviceData,
        partnerId, // Associa o serviço ao parceiro logado
        bookings: 0,
        revenue: 0,
        rating: 0,
        totalReviews: 0
      };

      const { data, error: insertError } = await supabase
        .from('services')
        .insert(newServiceData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      await fetchServices(); // Recarrega a lista para mostrar o novo serviço
      return data;
    } catch (err: any) {
      setError('Erro ao criar serviço');
      console.error('Erro ao criar serviço:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [partnerId, fetchServices]);

  // Atualizar serviço no Supabase
  const updateService = useCallback(async (serviceId: string, updates: Partial<Service>) => {
    try {
      setIsLoading(true);
      
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString() // Atualiza o timestamp da última modificação
      };

      const { error: updateError } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', serviceId);

      if (updateError) {
        throw updateError;
      }
      
      await fetchServices(); // Recarrega a lista para mostrar as alterações
    } catch (err: any) {
      setError('Erro ao atualizar serviço');
      console.error('Erro ao atualizar serviço:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchServices]);

  // Deletar serviço no Supabase
  const deleteService = useCallback(async (serviceId: string) => {
    try {
      setIsLoading(true);
      
      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
        
      if (deleteError) {
        throw deleteError;
      }
      
      await fetchServices(); // Recarrega a lista sem o serviço deletado
    } catch (err: any) {
      setError('Erro ao deletar serviço');
      console.error('Erro ao deletar serviço:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchServices]);

  // A lógica de filtro e estatísticas pode permanecer, pois opera sobre os dados já no estado `services`
  const filterServices = (filters: ServiceFilters): Service[] => {
    return services.filter(service => {
      if (filters.category !== 'all' && service.category !== filters.category) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(searchLower);
        const matchesDescription = service.description.toLowerCase().includes(searchLower);
        const matchesTags = service.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }
      if (filters.isActive !== undefined && service.isActive !== filters.isActive) {
        return false;
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (service.price < min || service.price > max) {
          return false;
        }
      }
      return true;
    });
  };

  const getStats = (): ServiceStats => {
    const activeServices = services.filter(s => s.isActive);
    const totalBookings = services.reduce((acc, s) => acc + s.bookings, 0);
    const totalRevenue = services.reduce((acc, s) => acc + s.revenue, 0);
    const totalRatings = services.reduce((acc, s) => acc + (s.rating * s.totalReviews), 0);
    const totalReviewsSum = services.reduce((acc, s) => acc + s.totalReviews, 0);
    
    return {
      totalServices: services.length,
      activeServices: activeServices.length,
      totalBookings,
      totalRevenue,
      averageRating: totalReviewsSum > 0 ? totalRatings / totalReviewsSum : 0
    };
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
    filterServices,
    getStats,
    refreshServices: fetchServices
  };
};