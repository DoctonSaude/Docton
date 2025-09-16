import React, { useState } from 'react';
import { X, Mail, Send, RefreshCw } from 'lucide-react';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simula o envio para a API
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true); // Muda para o estado de "enviado com sucesso"
      console.log(`Link de recuperação enviado para: ${email}`);
    }, 1500);
  };

  return (
    // Fundo escuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      
      {/* Conteúdo do Modal */}
      <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {!isSent ? (
          // --- Etapa 1: Formulário para inserir e-mail ---
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Recuperar Senha</h2>
            <p className="text-center text-gray-600">
              Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.
            </p>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:bg-emerald-300"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Link de Recuperação</span>
                </>
              )}
            </button>
          </form>
        ) : (
          // --- Etapa 2: Mensagem de Sucesso ---
          <div className="text-center">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Link Enviado!</h2>
            <p className="text-gray-600 mt-2">
              Verifique a caixa de entrada do e-mail <span className="font-semibold">{email}</span> e siga as instruções para criar uma nova senha.
            </p>
             <button onClick={onClose} className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300">
                Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}