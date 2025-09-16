/**
 * Utilitários para gerenciamento de desafios
 */

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  duration: number;
  participants: number;
  completionRate: number;
  image: string;
  tags: string[];
  requirements: string[];
  rewards: string[];
  isCompleted: boolean;
  isBookmarked: boolean;
  startDate: string;
  endDate: string;
  sponsor?: {
    name: string;
    logo: string;
  };
  progress?: number;
}

export interface ChallengeFilters {
  search: string;
  category: string;
  difficulty: string[];
  status: string;
  sortBy: string;
}

/**
 * Valida se um desafio pode ser iniciado
 */
export const canStartChallenge = (challenge: Challenge): boolean => {
  const now = new Date();
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  return now >= startDate && now <= endDate && !challenge.isCompleted;
};

/**
 * Calcula os dias restantes para o fim do desafio
 */
export const getDaysRemaining = (endDate: string): number => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Formata a duração do desafio
 */
export const formatDuration = (days: number): string => {
  if (days === 1) return '1 dia';
  if (days < 7) return `${days} dias`;
  if (days === 7) return '1 semana';
  if (days < 30) return `${Math.floor(days / 7)} semanas`;
  if (days === 30) return '1 mês';
  return `${Math.floor(days / 30)} meses`;
};

/**
 * Obtém a cor da dificuldade
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Traduz a dificuldade
 */
export const translateDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner': return 'Iniciante';
    case 'intermediate': return 'Intermediário';
    case 'advanced': return 'Avançado';
    default: return difficulty;
  }
};

/**
 * Calcula o nível de progresso
 */
export const getProgressLevel = (progress: number): { level: string; color: string } => {
  if (progress === 0) return { level: 'Não iniciado', color: 'text-gray-600' };
  if (progress < 25) return { level: 'Iniciando', color: 'text-red-600' };
  if (progress < 50) return { level: 'Em progresso', color: 'text-yellow-600' };
  if (progress < 75) return { level: 'Avançando', color: 'text-blue-600' };
  if (progress < 100) return { level: 'Quase lá', color: 'text-purple-600' };
  return { level: 'Concluído', color: 'text-green-600' };
};

/**
 * Filtra desafios baseado nos critérios
 */
export const filterChallenges = (
  challenges: Challenge[], 
  filters: ChallengeFilters
): Challenge[] => {
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
};

/**
 * Ordena desafios baseado no critério
 */
export const sortChallenges = (challenges: Challenge[], sortBy: string): Challenge[] => {
  const sorted = [...challenges];

  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => b.participants - a.participants);
    case 'points':
      return sorted.sort((a, b) => b.points - a.points);
    case 'difficulty':
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    case 'deadline':
      return sorted.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    case 'completion':
      return sorted.sort((a, b) => b.completionRate - a.completionRate);
    default: // newest
      return sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
};

/**
 * Calcula estatísticas dos desafios
 */
export const calculateChallengeStats = (challenges: Challenge[]) => {
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
    notStarted: challenges.length - completed - inProgress,
    totalPoints,
    averageCompletion: Math.round(averageCompletion),
    completionRate: challenges.length > 0 ? Math.round((completed / challenges.length) * 100) : 0
  };
};

/**
 * Gera recomendações de desafios baseado no perfil do usuário
 */
export const getRecommendedChallenges = (
  challenges: Challenge[], 
  userProfile: {
    completedChallenges: string[];
    preferredCategories: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
  }
): Challenge[] => {
  return challenges
    .filter(challenge => !userProfile.completedChallenges.includes(challenge.id))
    .filter(challenge => canStartChallenge(challenge))
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Pontuação por categoria preferida
      if (userProfile.preferredCategories.includes(a.category)) scoreA += 3;
      if (userProfile.preferredCategories.includes(b.category)) scoreB += 3;

      // Pontuação por nível de habilidade
      if (a.difficulty === userProfile.skillLevel) scoreA += 2;
      if (b.difficulty === userProfile.skillLevel) scoreB += 2;

      // Pontuação por popularidade
      scoreA += Math.min(a.participants / 1000, 2);
      scoreB += Math.min(b.participants / 1000, 2);

      // Pontuação por taxa de conclusão
      scoreA += a.completionRate / 50;
      scoreB += b.completionRate / 50;

      return scoreB - scoreA;
    })
    .slice(0, 6);
};

/**
 * Valida se um desafio pode ser marcado como concluído
 */
export const canCompleteChallenge = (challenge: Challenge): boolean => {
  return !challenge.isCompleted && (challenge.progress || 0) >= 100;
};

/**
 * Calcula a pontuação total de um usuário
 */
export const calculateUserScore = (completedChallenges: Challenge[]): number => {
  return completedChallenges.reduce((total, challenge) => total + challenge.points, 0);
};

/**
 * Obtém o próximo nível baseado na pontuação
 */
export const getUserLevel = (totalPoints: number): { level: number; name: string; nextLevelPoints: number } => {
  const levels = [
    { level: 1, name: 'Iniciante', minPoints: 0 },
    { level: 2, name: 'Explorador', minPoints: 500 },
    { level: 3, name: 'Aventureiro', minPoints: 1500 },
    { level: 4, name: 'Especialista', minPoints: 3000 },
    { level: 5, name: 'Mestre', minPoints: 5000 },
    { level: 6, name: 'Lenda', minPoints: 10000 }
  ];

  const currentLevel = levels.reverse().find(level => totalPoints >= level.minPoints) || levels[0];
  const nextLevel = levels.find(level => level.minPoints > totalPoints);

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    nextLevelPoints: nextLevel ? nextLevel.minPoints - totalPoints : 0
  };
};

/**
 * Formata data para exibição
 */
export const formatChallengeDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Verifica se um desafio está próximo do prazo
 */
export const isNearDeadline = (endDate: string, warningDays: number = 3): boolean => {
  const daysRemaining = getDaysRemaining(endDate);
  return daysRemaining <= warningDays && daysRemaining > 0;
};

/**
 * Exporta dados dos desafios para CSV
 */
export const exportChallengesData = (challenges: Challenge[]): void => {
  const headers = [
    'Título',
    'Categoria',
    'Dificuldade',
    'Pontos',
    'Duração (dias)',
    'Participantes',
    'Taxa de Conclusão (%)',
    'Status',
    'Progresso (%)',
    'Data de Início',
    'Data de Fim'
  ];

  const rows = challenges.map(challenge => [
    challenge.title,
    challenge.category,
    translateDifficulty(challenge.difficulty),
    challenge.points.toString(),
    challenge.duration.toString(),
    challenge.participants.toString(),
    challenge.completionRate.toString(),
    challenge.isCompleted ? 'Concluído' : (challenge.progress || 0) > 0 ? 'Em Progresso' : 'Não Iniciado',
    (challenge.progress || 0).toString(),
    formatChallengeDate(challenge.startDate),
    formatChallengeDate(challenge.endDate)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `desafios-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Gera relatório de progresso do usuário
 */
export const generateProgressReport = (challenges: Challenge[]) => {
  const stats = calculateChallengeStats(challenges);
  const categoriesStats = challenges.reduce((acc, challenge) => {
    if (!acc[challenge.category]) {
      acc[challenge.category] = { total: 0, completed: 0, points: 0 };
    }
    acc[challenge.category].total++;
    if (challenge.isCompleted) {
      acc[challenge.category].completed++;
      acc[challenge.category].points += challenge.points;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number; points: number }>);

  return {
    summary: stats,
    categoriesBreakdown: Object.entries(categoriesStats).map(([category, data]) => ({
      category,
      ...data,
      completionRate: Math.round((data.completed / data.total) * 100)
    })),
    achievements: challenges.filter(c => c.isCompleted).map(c => ({
      title: c.title,
      points: c.points,
      completedDate: c.endDate // Assumindo que foi concluído na data de fim
    })),
    generatedAt: new Date().toISOString()
  };
};