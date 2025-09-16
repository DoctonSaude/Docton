import React, { useState } from 'react';
import { 
  X,
  Award,
  Info,
  CheckCircle
} from 'lucide-react';

export default function RedeemRewardModal({ reward, userPoints, onClose, onConfirm }: { reward: any, userPoints: number, onClose: () => void, onConfirm: () => void }) {
  const [isRedeemed, setIsRedeemed] = useState(false);

  const handleConfirm = () => {
      // Lógica para confirmar o resgate
      setIsRedeemed(true);
      setTimeout(() => {
          onConfirm();
          onClose();
      }, 2000); // Fecha o modal após 2 segundos
  };

  if (isRedeemed) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-gray-800">Recompensa Resgatada!</h2>
                <p className="text-gray-600 mt-2">O seu código de desconto foi enviado para o seu e-mail e WhatsApp.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold">Resgatar Recompensa</h2>
                <p className="text-sm text-gray-500">Você está prestes a resgatar "{reward.title}"</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4 text-center">
            <Award size={48} className="text-yellow-500 mx-auto"/>
            <h3 className="text-2xl font-bold text-gray-800">{reward.title}</h3>
            <p className="text-gray-600">Desconto adicional em qualquer especialidade</p>
            
            <div className="flex justify-between items-center text-lg border-t border-b py-4 my-4">
                <span className="text-gray-500">Custo:</span>
                <span className="font-bold">{reward.cost} pontos</span>
            </div>
             <div className="flex justify-between items-center text-lg">
                <span className="text-gray-500">Seus pontos:</span>
                <span className="font-bold text-blue-600">{userPoints} pontos</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left text-sm mt-4 flex items-start gap-3">
                <Info size={20} className="text-blue-500 flex-shrink-0"/>
                <p className="text-blue-800">
                    Este desconto adicional de 10% pode ser aplicado em qualquer consulta com especialistas cadastrados na plataforma Docton, e é cumulativo com outras promoções. Para utilizar, informe o código de desconto no momento do agendamento.
                </p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">Cancelar</button>
            <button onClick={handleConfirm} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                Confirmar Resgate
            </button>
          </div>
      </div>
    </div>
  );
}
