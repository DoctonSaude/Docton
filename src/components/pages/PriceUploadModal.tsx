import React, { useState } from 'react';
import { 
  X, 
  UploadCloud,
  File,
  Trash2,
  RefreshCw
} from 'lucide-react';

export default function PriceUploadModal({ onClose, onUpload }: { onClose: () => void, onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        setError('Formato de ficheiro inválido. Por favor, envie um ficheiro .csv');
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um ficheiro para enviar.');
      return;
    }
    setIsLoading(true);
    // Simula o upload e processamento
    setTimeout(() => {
      onUpload(file);
      setIsLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-emerald-600" />
              Importar Tabela de Preços
            </h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X/></button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Selecione um ficheiro CSV para atualizar os preços em massa. O ficheiro deve conter as colunas: <strong>service_id, repass_value, docton_margin</strong>.
            </p>
            {!file ? (
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="text-center">
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="font-semibold">Clique para anexar ou arraste o ficheiro</p>
                  <p className="text-xs text-gray-500">Apenas .csv</p>
                </div>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv"/>
              </label>
            ) : (
              <div className="p-3 border rounded-lg bg-emerald-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                  </div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Remover ficheiro">
                    <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            )}
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
            <button type="submit" disabled={!file || isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 disabled:bg-blue-300">
                {isLoading ? <RefreshCw size={16} className="animate-spin"/> : <UploadCloud size={16}/>}
                {isLoading ? 'Processando...' : 'Subir e Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}