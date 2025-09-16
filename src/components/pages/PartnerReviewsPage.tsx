import React, { useState } from 'react';
import { 
  Star,
  MessageSquare,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Building // ÍCONE CORRIGIDO E ADICIONADO AQUI
} from 'lucide-react';

import ReviewResponseModal from './ReviewResponseModal';

// --- Interface e Dados de Exemplo ---
interface Review {
  id: string;
  patientName: string;
  isAnonymous: boolean;
  rating: number;
  comment: string;
  waitTime: 'rápido' | 'médio' | 'longo';
  professionalService: 'bom' | 'ruim';
  facilityStructure: 'bom' | 'ruim';
  date: string;
  response?: string; // Novo campo para a resposta
}

const mockReviews: Review[] = [
    { id: '1', patientName: 'Maria S.', isAnonymous: false, rating: 5, comment: 'Atendimento excelente, a Dra. Ana foi muito atenciosa e o local é impecável. Recomendo!', waitTime: 'rápido', professionalService: 'bom', facilityStructure: 'bom', date: '2025-07-18' },
    { id: '2', patientName: 'Anônimo', isAnonymous: true, rating: 3, comment: 'O médico foi ótimo, mas a espera foi um pouco longa, quase 45 minutos de atraso.', waitTime: 'longo', professionalService: 'bom', facilityStructure: 'bom', date: '2025-07-15' },
    { id: '3', patientName: 'João P.', isAnonymous: false, rating: 4, comment: 'Bom atendimento, mas a estrutura do ar condicionado não estava a funcionar bem.', waitTime: 'médio', professionalService: 'bom', facilityStructure: 'ruim', date: '2025-07-12', response: 'Agradecemos o feedback, João! Já acionamos a manutenção para verificar o ar condicionado. Esperamos vê-lo novamente em breve!' },
];

const kpis = {
    averageRating: 4.7,
    totalReviews: 872,
    reviewsThisMonth: 45,
};
// ------------------------------------

export default function PartnerReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [respondingTo, setRespondingTo] = useState<Review | null>(null);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const handleSendResponse = (response: string) => {
      if (!respondingTo) return;
      setReviews(prev => prev.map(r => 
          r.id === respondingTo.id ? { ...r, response } : r
      ));
      alert('Resposta enviada com sucesso!');
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Avaliações Recebidas</h1>
          <p className="text-gray-500">Acompanhe o feedback dos seus pacientes para melhorar continuamente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center"><p className="text-sm text-gray-500">Sua Média Geral</p><p className="text-4xl font-bold text-yellow-500 mt-2 flex items-center justify-center gap-1">{kpis.averageRating.toFixed(1)} <Star size={32} className="fill-current"/></p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center"><p className="text-sm text-gray-500">Total de Avaliações</p><p className="text-4xl font-bold text-blue-600 mt-2">{kpis.totalReviews}</p></div>
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center"><p className="text-sm text-gray-500">Avaliações este Mês</p><p className="text-4xl font-bold text-green-600 mt-2">{kpis.reviewsThisMonth}</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b"><h2 className="font-semibold text-gray-800">Comentários dos Pacientes</h2></div>
          <div className="divide-y">
              {reviews.map(review => (
                  <div key={review.id} className="p-6">
                      <div className="flex justify-between items-start">
                          <div><p className="font-bold">{review.isAnonymous ? 'Anônimo' : review.patientName}</p><p className="text-xs text-gray-500">{formatDate(review.date)}</p></div>
                          <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}/>)}</div>
                      </div>
                      <p className="text-gray-700 my-4 italic">"{review.comment}"</p>
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                          <div className="flex items-center gap-1"><Clock size={14}/> <strong>Espera:</strong> {review.waitTime}</div>
                          <div className="flex items-center gap-1"><ThumbsUp size={14}/> <strong>Atendimento:</strong> {review.professionalService}</div>
                          <div className="flex items-center gap-1"><Building size={14}/> <strong>Estrutura:</strong> {review.facilityStructure}</div>
                      </div>
                      {review.response ? (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                              <p className="font-semibold text-sm text-blue-800">Sua Resposta:</p>
                              <p className="text-sm text-gray-700 italic">"{review.response}"</p>
                          </div>
                      ) : (
                          <div className="text-right">
                              <button onClick={() => setRespondingTo(review)} className="text-sm font-semibold text-blue-600 hover:underline">Responder</button>
                          </div>
                      )}
                  </div>
              ))}
          </div>
        </div>
      </div>

      {respondingTo && (
          <ReviewResponseModal
            review={respondingTo}
            onClose={() => setRespondingTo(null)}
            onSend={handleSendResponse}
          />
      )}
    </>
  );
}
