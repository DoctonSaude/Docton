import React, { useState } from 'react';
import {
  DollarSign,
  Save,
  RefreshCw,
  Banknote,
  Building,
  Hash,
  User,
  Shield,
  Key // Novo ícone
} from 'lucide-react';

export default function PartnerFinancialSetupPage() {
  const [formData, setFormData] = useState({
    bank: 'Banco do Brasil',
    agency: '3322',
    accountNumber: '11223-4',
    accountType: 'corrente',
    holderName: 'Laboratório Diagnóstico Plus LTDA',
    holderDocument: '12.345.678/0001-90',
    pixKey: '12.345.678/0001-90', // Novo campo
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Salvando dados financeiros:", formData);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false); // Volta para o modo de visualização
      alert('Dados financeiros salvos com sucesso!');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Configuração Financeira</h1>
            <p className="text-gray-500">Cadastre a conta bancária onde você receberá os repasses da Docton.</p>
        </div>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 text-sm">
                Editar Dados
            </button>
        )}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="py-1"><Shield className="h-5 w-5 text-yellow-500 mr-3" /></div>
          <div>
            <p className="font-bold text-yellow-800">Segurança</p>
            <p className="text-sm text-yellow-700">Estas informações são confidenciais e usadas exclusivamente para o processamento dos seus pagamentos.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-8">
        
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <Banknote className="w-6 h-6 text-emerald-600" />
                Dados da Conta Bancária
            </h2>
            {/* NOVO CAMPO DE CHAVE PIX */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chave PIX (Celular, E-mail, CPF/CNPJ)</label>
                <div className="relative"><Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="pixKey" value={formData.pixKey} onChange={handleChange} disabled={!isEditing} className="w-full pl-9 p-2 border rounded-lg disabled:bg-gray-100" required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                  <input type="text" name="bank" value={formData.bank} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded-lg disabled:bg-gray-100" placeholder="Ex: Banco do Brasil" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                  <select name="accountType" value={formData.accountType} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded-lg bg-white disabled:bg-gray-100" required>
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agência (sem dígito)</label>
                  <div className="relative"><Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="agency" value={formData.agency} onChange={handleChange} disabled={!isEditing} className="w-full pl-9 p-2 border rounded-lg disabled:bg-gray-100" required /></div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número da Conta (com dígito)</label>
                  <div className="relative"><Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} disabled={!isEditing} className="w-full pl-9 p-2 border rounded-lg disabled:bg-gray-100" required /></div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <User className="w-6 h-6 text-emerald-600" />
                Dados do Titular
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo / Razão Social</label>
                  <input type="text" name="holderName" value={formData.holderName} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded-lg disabled:bg-gray-100" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF / CNPJ do Titular</label>
                  <input type="text" name="holderDocument" value={formData.holderDocument} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded-lg disabled:bg-gray-100" required />
                </div>
            </div>
        </div>
        
        {isEditing && (
            <div className="pt-5 border-t">
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancelar</button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
                  >
                     {isLoading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                     {isLoading ? 'Salvando...' : 'Salvar Dados Financeiros'}
                  </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
}