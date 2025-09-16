import React from 'react';
import { X, Printer, Download, User, Building, Heart, QrCode } from 'lucide-react';

// Interface para os dados que o modal vai receber
interface AttendanceGuideModalProps {
  appointment: any; // Os dados do agendamento específico
  onClose: () => void; // Função para fechar a janela
}

export default function AttendanceGuideModal({ appointment, onClose }: AttendanceGuideModalProps) {

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      });
  };
  
  // Função de simulação para impressão
  const handlePrint = () => {
      alert("Simulando impressão da guia...");
      window.print();
  }

  return (
    // Fundo escuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      
      {/* O conteúdo branco da Guia */}
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Guia de Atendimento</h2>
                </div>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Corpo da Guia */}
            <div className="space-y-6">
                
                {/* QR Code e Código Numérico */}
                <div className="text-center bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">Apresente este código na recepção do parceiro:</p>
                    {/* Imagem de placeholder para o QR Code */}
                    <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DOCTON-12345" 
                        alt="QR Code" 
                        className="w-40 h-40 mx-auto rounded-lg shadow-md"
                    />
                    <p className="mt-4 text-2xl font-bold tracking-widest text-gray-800 bg-gray-200 p-2 rounded-md inline-block">
                        {appointment.guideCode}
                    </p>
                </div>

                {/* Detalhes do Paciente */}
                <div>
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2"><User className="w-5 h-5"/>Paciente</h3>
                    <div className="text-sm space-y-1">
                        <p><span className="font-semibold">Nome:</span> Paciente Teste</p>
                        <p><span className="font-semibold">CPF:</span> 123.456.789-00</p>
                    </div>
                </div>

                {/* Detalhes do Serviço */}
                 <div>
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2"><Heart className="w-5 h-5"/>Serviço Adquirido</h3>
                    <div className="text-sm space-y-1">
                        <p><span className="font-semibold">Serviço:</span> {appointment.serviceName}</p>
                        <p><span className="font-semibold">Data da Compra:</span> {formatDate(appointment.date)}</p>
                    </div>
                </div>

                {/* Detalhes do Parceiro */}
                <div>
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2"><Building className="w-5 h-5"/>Local do Atendimento</h3>
                     <div className="text-sm space-y-1">
                        <p><span className="font-semibold">Parceiro:</span> {appointment.partnerName}</p>
                        <p><span className="font-semibold">Endereço:</span> Av. Paulista, 1000 - São Paulo, SP</p>
                    </div>
                </div>

                 {/* Instruções */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-2">Instruções Importantes</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>Chegue com 15 minutos de antecedência.</li>
                        <li>Apresente um documento com foto junto com esta guia.</li>
                        <li>Verifique o preparo necessário para o seu serviço (ex: jejum).</li>
                        <li>Em caso de dúvidas, entre em contato com nosso suporte.</li>
                    </ul>
                </div>
            </div>

            {/* Rodapé com Ações */}
            <div className="flex items-center justify-end gap-4 border-t mt-6 pt-4">
                <button onClick={handlePrint} className="flex items-center gap-2 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100">
                    <Printer className="w-5 h-5" />
                    Imprimir
                </button>
                <button className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600">
                    <Download className="w-5 h-5" />
                    Baixar PDF
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}