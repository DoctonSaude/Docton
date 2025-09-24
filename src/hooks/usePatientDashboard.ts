import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// --- Definimos a "forma" dos nossos dados para o frontend ---
export interface Checkup {
  id: string;
  date: string;
  serviceName: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
}

// A estrutura completa dos dados que o nosso dashboard precisa
export interface PatientDashboardData {
  checkups: Checkup[];
  doctors: Doctor[];
  // Adicionamos placeholders para os gráficos que virão do backend no futuro
  healthReport: { points: { month: string; value: number }[] };
  patientHealthReport: { points: { month: string; value: number }[] };
}

/**
 * Hook para buscar e gerir todos os dados necessários para o Dashboard do Paciente,
 * conectado diretamente ao Supabase.
 */
export const usePatientDashboard = () => {
  const { user } = useAuth(); // Usamos o hook de autenticação para saber quem está logado
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Se não houver utilizador logado, não fazemos nada
    if (!user) {
        setIsLoading(false);
        return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // 1. Busca os próximos agendamentos do utilizador na tabela 'appointments'
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, date, service_name')
        .eq('patient_id', user.id)
        .order('date', { ascending: true })
        .limit(2);

      if (appointmentsError) throw appointmentsError;

      // 2. Busca os perfis de parceiros (médicos) na tabela 'profiles'
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('profiles')
        .select('id, full_name, specialty, avatar_url')
        .eq('role', 'partner') // Filtra apenas por perfis que são parceiros
        .limit(3);
      
      if (doctorsError) throw doctorsError;

      // 3. Formata os dados para o formato que o nosso componente de frontend espera
      const formattedCheckups: Checkup[] = appointmentsData.map(apt => ({
        id: apt.id,
        date: new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
        serviceName: apt.service_name,
      }));

      const formattedDoctors: Doctor[] = doctorsData.map(doc => ({
        id: doc.id,
        name: doc.full_name || 'Nome não disponível',
        specialty: doc.specialty || 'Especialidade não informada',
        avatarUrl: doc.avatar_url || `https://i.pravatar.cc/40?u=${doc.id}`, // Usa um avatar de placeholder se não houver
      }));

      // 4. Monta o objeto final com os dados reais e os dados de exemplo para os gráficos
      const finalData: PatientDashboardData = {
        checkups: formattedCheckups,
        doctors: formattedDoctors,
        // Mantemos os dados de exemplo para os gráficos, pois eles ainda não vêm da base de dados
        healthReport: {
          points: [ { month: 'Jan', value: 15 }, { month: 'Feb', value: 25 }, { month: 'Mar', value: 20 }, { month: 'Apr', value: 30 } ],
        },
        patientHealthReport: {
          points: [ { month: 'Jan', value: 50 }, { month: 'Feb', value: 65 }, { month: 'Mar', value: 80 }, { month: 'Apr', value: 60 }, { month: 'May', value: 75 }, { month: 'Jun', value: 70 } ],
        }
      };
      
      setData(finalData);

    } catch (err: any) {
      setError('Não foi possível carregar os dados do dashboard.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Esta função será executada novamente se o 'user' mudar (login/logout)

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expomos os dados e funções para que os componentes possam usá-los
  return { data, isLoading, error, refresh: fetchData };
};

