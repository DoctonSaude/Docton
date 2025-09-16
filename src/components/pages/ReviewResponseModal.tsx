import React, { useState } from 'react';
import { 
  X,
  Send
} from 'lucide-react';

export default function ReviewResponseModal({ review, onClose, onSend }: { review: any, onClose: () => void, onSend: (response: string) => void }) {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      onSend(response);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Responder à Avaliação</h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-sm">Avaliação de: {review.isAnonymous ? 'Anônimo' : review.patientName}</p>
                <p className="text-sm italic text-gray-600 mt-1">"{review.comment}"</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sua Resposta</label>
              <textarea 
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={5}
                className="w-full p-2 border rounded-lg" 
                placeholder="Agradeça o feedback ou ofereça uma solução..."
                required 
              />
              <p className="text-xs text-gray-400 mt-1">A sua resposta será visível publicamente.</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                <Send size={16}/> Enviar Resposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
