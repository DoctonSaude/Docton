import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Building,
  User,
  Send,
  CheckCircle
} from 'lucide-react';

// Componente para a seleção de estrelas
const StarRating = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void }) => {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="transform transition-transform duration-200 hover:scale-110"
        >
          <Star
            size={40}
            className={`${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
};

// Componente para seleção de polegares (bom/ruim)
const ThumbsRating = ({ value, setValue }: { value: 'bom' | 'ruim' | null, setValue: (value: 'bom' | 'ruim') => void }) => {
    return (
        <div className="flex gap-4">
            <button 
                type="button" 
                onClick={() => setValue('bom')} 
                className={`p-3 rounded-lg border-2 flex items-center gap-2 ${value === 'bom' ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}`}
            >
                <ThumbsUp className="text-green-500"/> Bom
            </button>
             <button 
                type="button" 
                onClick={() => setValue('ruim')} 
                className={`p-3 rounded-lg border-2 flex items-center gap-2 ${value === 'ruim' ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'}`}
            >
                <ThumbsDown className="text-red-500"/> Ruim
            </button>
        </div>
    );
};


export default function PatientReviewPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [waitTime, setWaitTime] = useState<'rapido' | 'medio' | 'longo' | null>(null);
  const [professionalService, setProfessionalService] = useState<'bom' | 'ruim' | null>(null);
  const [facilityStructure, setFacilityStructure] = useState<'bom' | 'ruim' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Lógica de envio da avaliação
      console.log({ rating, comment, waitTime, professionalService, facilityStructure });
      setIsSubmitted(true);
  };
  
  if (isSubmitted) {
      return (
          <div className="bg-white min-h-screen flex items-center justify-center p-6">
              <div className="text-center max-w-lg">
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4"/>
                  <h1 className="text-2xl font-bold text-gray-800">Avaliação Enviada!</h1>
                  <p className="text-gray-600 mt-2">Obrigado por partilhar a sua experiência. A sua opinião ajuda-nos a melhorar continuamente.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Como foi o seu atendimento?</h1>
          <p className="text-gray-500 mt-2">A sua avaliação é muito importante para nós e para a comunidade Docton.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Local do Atendimento */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-500">A avaliar:</p>
            <p className="font-bold text-gray-800 flex items-center gap-2"><Building size={16}/> Clínica São Lucas - Consulta Clínica Geral</p>
          </div>

          {/* Avaliação Geral */}
          <div>
            <label className="block text-center text-lg font-semibold text-gray-700 mb-4">Avaliação Geral</label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          {/* Comentário */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Comentário (opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Conte como foi a sua experiência..."
              className="w-full p-3 border rounded-lg"
            ></textarea>
          </div>

          {/* Critérios Adicionais */}
          <div className="space-y-6">
            <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Tempo de espera</label>
                <div className="flex gap-4">
                    <button type="button" onClick={() => setWaitTime('rapido')} className={`px-4 py-2 rounded-lg border-2 ${waitTime === 'rapido' ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'}`}>Rápido</button>
                    <button type="button" onClick={() => setWaitTime('medio')} className={`px-4 py-2 rounded-lg border-2 ${waitTime === 'medio' ? 'border-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'}`}>Médio</button>
                    <button type="button" onClick={() => setWaitTime('longo')} className={`px-4 py-2 rounded-lg border-2 ${waitTime === 'longo' ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'}`}>Longo</button>
                </div>
            </div>
            <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Atendimento profissional</label>
                <ThumbsRating value={professionalService} setValue={setProfessionalService} />
            </div>
            <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Estrutura do local</label>
                <ThumbsRating value={facilityStructure} setValue={setFacilityStructure} />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Send size={20}/> Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
