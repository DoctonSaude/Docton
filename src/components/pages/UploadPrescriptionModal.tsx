import React, { useState } from 'react';
import { X, UploadCloud, File, Trash2, RefreshCw } from 'lucide-react';

interface UploadPrescriptionModalProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function UploadPrescriptionModal({ onClose, onUpload }: UploadPrescriptionModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validação do arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSizeInMB = 5;
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Formato de arquivo inválido. Por favor, envie JPG, PNG ou PDF.');
        setFile(null);
        return;
      }
      if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
        setError(`O arquivo é muito grande. O tamanho máximo é de ${maxSizeInMB}MB.`);
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo para enviar.');
      return;
    }
    setIsLoading(true);
    // Simula o upload para a API
    setTimeout(() => {
      onUpload(file);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl relative">
        <form onSubmit={handleSubmit}>
          {/* Cabeçalho */}
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-emerald-600" />
              Anexar Pedido Médico
            </h2>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Corpo do Modal */}
          <div className="p-6 space-y-4">
            {!file ? (
              // --- Área de Upload ---
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para anexar</span> ou arraste e solte</p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
                </label>
              </div>
            ) : (
              // --- Preview do Arquivo Selecionado ---
              <div className="p-4 border border-gray-200 rounded-lg bg-emerald-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button type="button" onClick={handleRemoveFile} className="p-2 text-red-500 hover:bg-red-100 rounded-full" title="Remover arquivo">
                    <Trash2 className="w-5 h-5"/>
                </button>
              </div>
            )}
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          </div>

          {/* Rodapé com Ações */}
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={!file || isLoading}
              className="w-full bg-emerald-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                'Confirmar e Enviar Pedido'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}