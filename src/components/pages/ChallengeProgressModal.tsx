import React from 'react';
import { X, Trophy, CheckCircle, Clock } from 'lucide-react';

// --- Interface e Dados de Exemplo ---
interface Participant {
  id: string;
  name: string;
  progress: number; // 0 a 100
  status: 'ongoing' | 'completed';
}

const mockParticipants: Participant[] = [
    { id: '1', name: 'Ana Clara Lima', progress: 100, status: 'completed' },
    { id: '2', name: 'Bruno Martins', progress: 85, status: 'ongoing' },
    { id: '3', name: 'Juliana S.', progress: 70, status: 'ongoing' },
];
// ------------------------------------

export default function ChallengeProgressModal({ challenge, onClose }: { challenge: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-emerald-600"/>
                    Progresso do Desafio
                </h2>
                <p className="text-gray-600 mt-1">{challenge.title}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto">
            <table className="w-full text-sm">
                <thead className="text-left">
                    <tr>
                        <th className="py-2 font-semibold">Participante</th>
                        <th className="py-2 font-semibold w-1/3">Progresso</th>
                        <th className="py-2 font-semibold text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {mockParticipants.map(p => (
                        <tr key={p.id} className="border-t">
                            <td className="py-3 font-medium">{p.name}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: `${p.progress}%`}}></div>
                                    </div>
                                    <span className="font-semibold text-emerald-600">{p.progress}%</span>
                                </div>
                            </td>
                            <td className="py-3 text-center">
                                {p.status === 'completed' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <CheckCircle className="w-3 h-3"/> Concluído
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                        <Clock className="w-3 h-3"/> Em Andamento
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}