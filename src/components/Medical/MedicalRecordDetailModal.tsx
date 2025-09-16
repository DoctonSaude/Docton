import React from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Download, 
  Stethoscope, 
  Calendar, 
  User,
  FileText,
  Activity,
  AlertTriangle,
  Heart,
  Clipboard
} from 'lucide-react';

export default function MedicalRecordDetailModal({ record, onClose }: { record: any, onClose: () => void }) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'consultation': return { icon: Stethoscope, color: 'text-blue-600', label: 'Consulta' };
      case 'exam': return { icon: Activity, color: 'text-green-600', label: 'Exame' };
      case 'prescription': return { icon: Pill, color: 'text-purple-600', label: 'Prescrição' };
      case 'allergy': return { icon: AlertTriangle, color: 'text-red-600', label: 'Alergia' };
      case 'chronic': return { icon: Heart, color: 'text-yellow-600', label: 'Condição Crônica' };
      default: return { icon: Clipboard, color: 'text-gray-600', label: 'Diagnóstico' };
    }
  };

  const handleActionClick = (action: string) => {
    alert(`Ação de "${action}" a ser implementada.`);
  };

  const TypeIcon = getTypeInfo(record.type).icon;
  const typeColor = getTypeInfo(record.type).color;
  const typeLabel = getTypeInfo(record.type).label;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        {/* Cabeçalho */}
        <div className="p-6 border-b flex justify-between items-start">
            <div className="flex items-center gap-3">
                <TypeIcon className={`w-8 h-8 ${typeColor}`} />
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{record.title}</h2>
                    <span className="text-sm font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{typeLabel}</span>
                </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X className="w-6 h-6" /></button>
        </div>

        {/* Corpo com Detalhes */}
        <div className="p-6 space-y-6">
            <div>
                <h3 className="font-semibold text-gray-700 mb-2">Descrição</h3>
                <p className="text-gray-600">{record.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/>Data do Registro</h3>
                    <p className="text-gray-600">{formatDate(record.date)}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><User className="w-4 h-4"/>Profissional Responsável</h3>
                    <p className="text-gray-600">{record.doctor.name} ({record.doctor.specialty})</p>
                    <p className="text-sm text-gray-500">{record.doctor.clinic}</p>
                </div>
            </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
             <button onClick={() => handleActionClick('Imprimir')} className="flex items-center gap-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100 font-semibold">
                 <Printer className="w-4 h-4" /> Imprimir
             </button>
             <button onClick={() => handleActionClick('Compartilhar')} className="flex items-center gap-2 px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100 font-semibold">
                 <Share2 className="w-4 h-4" /> Compartilhar
             </button>
             <button onClick={() => handleActionClick('Download')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600">
                 <Download className="w-4 h-4" /> Download
             </button>
        </div>
      </div>
    </div>
  );
}
