import React, { useState } from 'react';
import { 
  Star,
  MessageSquare,
  Users,
  TrendingDown,
  Search,
  Filter,
  EyeOff
} from 'lucide-react';

// --- Interface e Dados de Exemplo ---
interface Review {
  id: string;
  patientName: string;
  partnerName: string; // Adicionado para a visão do admin
  isAnonymous: boolean;
  rating: number;
  comment: string;
  date: string;
  isModerated: boolean; // Novo campo
}

const mockAdminReviews: Review[] = [
    { id: '1', patientName: 'Maria S.', partnerName: 'Clínica São Lucas', isAnonymous: false, rating: 5, comment: 'Atendimento excelente, a Dra. Ana foi muito atenciosa!', date: '2025-07-18', isModerated: false },
    { id: '2', patientName: 'Anônimo', partnerName: 'Laboratório Central', isAnonymous: true, rating: 3, comment: 'O médico foi ótimo, mas a espera foi um pouco longa.', date: '2025-07-15', isModerated: false },
    { id: '3', patientName: 'João P.', partnerName: 'Dr. Paulo Cardoso', isAnonymous: false, rating: 4, comment: 'Bom atendimento, mas a estrutura do ar condicionado não estava a funcionar bem.', date: '2025-07-12', isModerated: false },
    { id: '4', patientName: 'Carlos R.', partnerName: 'Clínica Bem Estar', isAnonymous: false, rating: 1, comment: 'Experiência horrível, não recomendo.', date: '2025-07-11', isModerated: true },
];

const kpis = {
    averageRating: 4.6,
    totalReviews: 1245,
    lowRatedPartners: 3,
};
// ------------------------------------

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockAdminReviews);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const handleModerate = (reviewId: string) => {
      if (window.confirm("Tem a certeza que deseja ocultar este comentário? Ele não será mais visível publicamente.")) {
          setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isModerated: true } : r));
      }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Avaliações</h1>
        <p className="text-gray-500">Monitore, modere e analise o feedback dos pacientes em toda a plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <p className="text-sm text-gray-500">Média Geral da Plataforma</p>
              <p className="text-4xl font-bold text-yellow-500 mt-2 flex items-center justify-center gap-1">{kpis.averageRating.toFixed(1)} <Star size={32} className="fill-current"/></p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <p className="text-sm text-gray-500">Total de Avaliações</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{kpis.totalReviews.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <p className="text-sm text-gray-500">Parceiros com Notas Baixas</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{kpis.lowRatedPartners}</p>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        {/* Filtros */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">Todas as Avaliações</h2>
        </div>
        <div className="divide-y">
            {reviews.map(review => (
                <div key={review.id} className={`p-6 ${review.isModerated ? 'bg-red-50' : ''}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">{review.isAnonymous ? 'Anônimo' : review.patientName}</p>
                            <p className="text-sm text-gray-500">avaliou <span className="font-semibold">{review.partnerName}</span> em {formatDate(review.date)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}/>)}
                        </div>
                    </div>
                    <p className={`text-gray-700 my-4 italic ${review.isModerated ? 'line-through' : ''}`}>"{review.comment}"</p>
                    <div className="flex justify-between items-center">
                        {review.isModerated && <span className="text-xs font-semibold text-red-600 flex items-center gap-1"><EyeOff size={14}/> Comentário Oculto</span>}
                        <div className="flex gap-2 ml-auto">
                            <button className="text-sm font-semibold text-blue-600 hover:underline">Responder</button>
                            {!review.isModerated && <button onClick={() => handleModerate(review.id)} className="text-sm font-semibold text-red-600 hover:underline">Moderar</button>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
