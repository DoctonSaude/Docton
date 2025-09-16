import { useState, useEffect, useCallback } from 'react';
import { Challenge, ChallengeFilters } from '../utils/challengeUtils';

export interface ChallengeStats {
  total: number;
  completed: number;
  inProgress: number;
  totalPoints: number;
  averageCompletion: number;
}

/**
 * Hook personalizado para gerenciar desafios
 * Fornece funcionalidades CRUD e estatísticas
 */
export const useChallenges = (userId?: string) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar desafios
  const fetchChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Em produção viria da API
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          title: 'Caminhada Diária de 10.000 Passos',
          description: 'Complete 10.000 passos todos os dias por uma semana. Monitore sua atividade física e melhore sua saúde cardiovascular.',
          category: 'fitness',
          difficulty: 'beginner',
          points: 150,
          duration: 7,
          participants: 2847,
          completionRate: 78,
          image: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['caminhada', 'exercício', 'cardio'],
          requirements: ['Smartphone ou smartwatch', 'App de contagem de passos'],
          rewards: ['150 pontos', 'Badge de Caminhante', 'Desconto em consultas'],
          isCompleted: false,
          isBookmarked: true,
          startDate: '2024-01-20',
          endDate: '2024-02-20',
          progress: 45
        },
        {
          id: '2',
          title: 'Hidratação Saudável',
          description: 'Beba pelo menos 2 litros de água por dia durante 14 dias consecutivos.',
          category: 'health',
          difficulty: 'beginner',
          points: 100,
          duration: 14,
          participants: 1923,
          completionRate: 85,
          image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['hidratação', 'água', 'saúde'],
          requirements: ['Garrafa de água', 'App de monitoramento'],
          rewards: ['100 pontos', 'Badge de Hidratação', 'Dicas personalizadas'],
          isCompleted: true,
          isBookmarked: false,
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          progress: 100
        }
      ];
      
      setChallenges(mockChallenges);
    } catch (err) {
      setError('Erro ao carregar desafios');
      console.error('Erro ao buscar desafios:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Participar de um desafio
  const joinChallenge = useCallback(async (challengeId: string) => {
    try {
      setIsLoading(true);
      
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              participants: challenge.participants + 1,
              progress: 0
            }
          : challenge
      ));
    } catch (err) {
      setError('Erro ao participar do desafio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar progresso do desafio
  const updateProgress = useCallback(async (challengeId: string, progress: number) => {
    try {
      setIsLoading(true);
      
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { 
              ...challenge, 
              progress: Math.min(100, Math.max(0, progress)),
              isCompleted: progress >= 100
            }
          : challenge
      ));
    } catch (err) {
      setError('Erro ao atualizar progresso');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback(async (challengeId: string) => {
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setChallenges(prev => prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, isBookmarked: !challenge.isBookmarked }
          : challenge
      ));
    } catch (err) {
      setError('Erro ao atualizar favorito');
      throw err;
    }
  }, []);

  // Filtrar desafios
  const filterChallenges = useCallback((filters: ChallengeFilters): Challenge[] => {
    let filtered = challenges;

    // Filtro por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchLower) ||
        challenge.description.toLowerCase().includes(searchLower) ||
        challenge.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por categoria
    if (filters.category !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === filters.category);
    }

    // Filtro por dificuldade
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(challenge => filters.difficulty.includes(challenge.difficulty));
    }

    // Filtro por status
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'completed':
          filtered = filtered.filter(challenge => challenge.isCompleted);
          break;
        case 'in-progress':
          filtered = filtered.filter(challenge => 
            !challenge.isCompleted && (challenge.progress || 0) > 0
          );
          break;
        case 'not-started':
          filtered = filtered.filter(challenge => 
            !challenge.isCompleted && (challenge.progress || 0) === 0
          );
          break;
        case 'bookmarked':
          filtered = filtered.filter(challenge => challenge.isBookmarked);
          break;
      }
    }

    return filtered;
  }, [challenges]);

  // Calcular estatísticas
  const getStats = useCallback((): ChallengeStats => {
    const completed = challenges.filter(c => c.isCompleted).length;
    const inProgress = challenges.filter(c => !c.isCompleted && (c.progress || 0) > 0).length;
    const totalPoints = challenges.filter(c => c.isCompleted).reduce((sum, c) => sum + c.points, 0);
    const averageCompletion = challenges.length > 0 
      ? challenges.reduce((sum, c) => sum + (c.progress || 0), 0) / challenges.length 
      : 0;

    return {
      total: challenges.length,
      completed,
      inProgress,
      totalPoints,
      averageCompletion: Math.round(averageCompletion)
    };
  }, [challenges]);

  // Obter desafios recomendados
  const getRecommendedChallenges = useCallback((limit: number = 6): Challenge[] => {
    return challenges
      .filter(challenge => !challenge.isCompleted)
      .sort((a, b) => {
        // Priorizar por popularidade e taxa de conclusão
        const scoreA = a.participants * 0.3 + a.completionRate * 0.7;
        const scoreB = b.participants * 0.3 + b.completionRate * 0.7;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }, [challenges]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return {
    challenges,
    isLoading,
    error,
    joinChallenge,
    updateProgress,
    toggleBookmark,
    filterChallenges,
    getStats,
    getRecommendedChallenges,
    refreshChallenges: fetchChallenges
  };
};