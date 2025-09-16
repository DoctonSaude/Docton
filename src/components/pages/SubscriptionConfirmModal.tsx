import React, { useState } from 'react';
import { 
  X,
  CheckCircle,
  CreditCard
} from 'lucide-react';

export default function SubscriptionConfirmModal({ plan, onClose, onConfirm }: { plan: any, onClose: () => void, onConfirm: () => void }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
      // Lógica para confirmar a assinatura
      setIsConfirmed(true);
      setTimeout(() => {
          onConfirm();
          onClose();
      }, 2000); // Fecha o modal após 2 segundos
  };

  if (isConfirmed) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-gray-800">Assinatura Confirmada!</h2>
                <p className="text-gray-600 mt-2">Parabéns! Você agora é um assinante do plano <span className="font-bold">{plan.name}</span>.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold">Confirmar Assinatura</h2>
                <p className="text-sm text-gray-500">Você está prestes a assinar o Plano {plan.name}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                <p className="text-4xl font-bold text-blue-600 my-2">R$ {plan.price.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-lg font-normal text-gray-500">/mês</span></p>
            </div>
            <div className="text-sm text-gray-600">
                <p>A cobrança será recorrente no seu método de pagamento principal. Pode cancelar a qualquer momento.</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
                <CreditCard size={16}/> Confirmar Assinatura
            </button>
          </div>
      </div>
    </div>
  );
}
