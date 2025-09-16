import React, { useState } from 'react';
import {
  X,
  Paperclip,
  CheckCircle,
  UploadCloud,
  File
} from 'lucide-react';

export default function PayoutDetailModal({ payout, onClose, onMarkAsPaid }: { payout: any, onClose: () => void, onMarkAsPaid: (payoutId: string, file: File) => void }) {
  const [comprovante, setComprovante] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprovante(e.target.files[0]);
    }
  };

  const handleConfirmPayment = () => {
    if (!comprovante) {
      alert("Por favor, anexe o comprovativo de pagamento.");
      return;
    }
    onMarkAsPaid(payout.id, comprovante);
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Detalhes do Repasse</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="font-semibold text-gray-500">Parceiro</p><p className="text-gray-800">{payout.partnerName}</p></div>
                <div><p className="font-semibold text-gray-500">Valor a Pagar</p><p className="text-gray-800 font-bold text-lg">{formatCurrency(payout.pendingAmount)}</p></div>
                <div><p className="font-semibold text-gray-500">Banco</p><p className="text-gray-800">{payout.bankInfo.bank}</p></div>
                <div><p className="font-semibold text-gray-500">Agência / Conta</p><p className="text-gray-800">{payout.bankInfo.agency} / {payout.bankInfo.account}</p></div>
            </div>
            
            <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Anexar Comprovativo de Pagamento</label>
                {!comprovante ? (
                    <label htmlFor="receipt-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="font-semibold text-sm">Clique para anexar</p>
                        <input id="receipt-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                    </label>
                ) : (
                    <div className="p-3 border rounded-lg bg-emerald-50 flex items-center justify-between">
                        <div className="flex items-center gap-3"><File className="w-8 h-8 text-emerald-600" /><p className="font-semibold text-gray-800 truncate">{comprovante.name}</p></div>
                        <button type="button" onClick={() => setComprovante(null)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Remover ficheiro"><X size={16}/></button>
                    </div>
                )}
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
            <button onClick={handleConfirmPayment} disabled={!comprovante} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 disabled:bg-green-300">
                <CheckCircle size={16}/> Marcar como Pago e Enviar
            </button>
          </div>
      </div>
    </div>
  );
}