import React, { useState } from 'react';
import { ArrowLeft, Building, User, Mail, FileText, Phone, Save, RefreshCw } from 'lucide-react';

export default function PartnerRegistrationPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    address: '',
    contactPerson: '',
    contactCpf: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const formatCnpj = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '/$1')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };
  
  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };
  
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cnpj') finalValue = formatCnpj(value);
    if (name === 'contactCpf') finalValue = formatCpf(value);
    if (name === 'contactPhone') finalValue = formatPhone(value);
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      console.log("Dados do Cadastro:", formData);
      console.log("Arquivo Anexado:", file);
      // Simula envio para API
      setTimeout(() => {
          setIsLoading(false);
          alert("Cadastro enviado com sucesso! Seus dados serão analisados pela nossa equipe.");
      }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Seja um Parceiro Docton</h1>
            <p className="text-gray-600 mt-2">Preencha o formulário abaixo para iniciar o processo de credenciamento.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border space-y-8">
          
          {/* Dados da Empresa */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <Building className="w-6 h-6 text-emerald-600" />
                Dados da Empresa
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
              <input type="text" name="companyName" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
                <input type="text" name="address" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
              </div>
            </div>
          </div>

          {/* Dados do Responsável */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <User className="w-6 h-6 text-emerald-600" />
                Dados do Responsável
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input type="text" name="contactPerson" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF do Responsável</label>
                  <input type="text" name="contactCpf" value={formData.contactCpf} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail de Contato</label>
                  <input type="email" name="contactEmail" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Celular (WhatsApp)</label>
                  <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                </div>
            </div>
          </div>
          
          {/* Upload de Documentos */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 border-b pb-2">
                <FileText className="w-6 h-6 text-emerald-600" />
                Documentação
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anexar Alvará Sanitário e Registro Profissional (CRM, etc.)</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                      <span>Clique para anexar</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">ou arraste e solte o arquivo aqui</p>
                  </div>
                  <p className="text-xs text-gray-500">{file ? file.name : 'PDF, PNG, JPG'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300"
              >
                 {isLoading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                 {isLoading ? 'Enviando...' : 'Enviar Cadastro para Análise'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}