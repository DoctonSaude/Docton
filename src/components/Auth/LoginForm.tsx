import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, User, FileText, Phone } from 'lucide-react';
import ForgotPasswordModal from './ForgotPasswordModal';

interface LoginFormProps {
  onLogin: (email: string, password: string, role: string) => void;
  onRegister: (data: any) => void;
  onNavigateToPartnerRegistration: () => void;
}

export default function LoginForm({ onLogin, onRegister, onNavigateToPartnerRegistration }: LoginFormProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    cpf: '',
    phone: '',
    role: 'patient',
    agreedToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const formatCPF = (value: string) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        let finalValue = value;
        if (name === 'cpf') {
            finalValue = formatCPF(value);
        } else if (name === 'phone') {
            finalValue = formatPhone(value);
        }
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isLoginView) {
        onLogin(formData.email, formData.password, formData.role);
      } else {
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não conferem!");
            setIsLoading(false);
            return;
        }
        if (!formData.agreedToTerms) {
            alert("Você deve aceitar os Termos e Condições.");
            setIsLoading(false);
            return;
        }
        onRegister(formData);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const demoUsers = [
    { email: 'paciente@docton.com', role: 'patient', name: 'Paciente Teste' },
    { email: 'parceiro@docton.com', role: 'partner', name: 'Laboratório Diagnóstico' },
    { email: 'admin@docton.com', role: 'admin', name: 'Admin Docton' },
  ];

  const handleDemoLogin = (user: any) => {
    setFormData({ ...formData, email: user.email, password: 'password123', role: user.role });
    onLogin(user.email, 'password123', user.role);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isLoginView ? 'Bem-vindo à Docton' : 'Crie sua Conta de Paciente'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLoginView ? 'Sua plataforma de saúde completa' : 'Rápido, fácil e seguro'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
              {demoUsers.map((user) => (
                <button
                  key={user.role}
                  onClick={() => handleDemoLogin(user)}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors border"
                >
                  <span className="font-semibold capitalize">{user.role}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isLoginView ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="seu@email.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Sua senha" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* --- CAMPOS DE CADASTRO RESTAURADOS --- */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                      <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" name="name" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="Seu nome completo" required /></div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                      <div className="relative"><FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="000.000.000-00" required /></div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" name="email" onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="seu@email.com" required /></div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Celular (WhatsApp)</label>
                      <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="(00) 00000-0000" required /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} className="w-full pl-10 pr-12 py-3 border rounded-lg" placeholder="Crie uma senha forte" required /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirme sua Senha</label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type={showPassword ? 'text' : 'password'} name="confirmPassword" onChange={handleChange} className="w-full pl-10 pr-12 py-3 border rounded-lg" placeholder="Repita a senha" required /></div>
                  </div>
                  <div className="flex items-center">
                      <input type="checkbox" id="terms" name="agreedToTerms" onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"/>
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">Eu li e aceito os <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">Termos e Condições</a>.</label>
                  </div>
                </>
              )}

              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50">
                {isLoading ? 'Aguarde...' : (isLoginView ? 'Entrar' : 'Cadastrar')}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              {isLoginView && (
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-emerald-600 hover:text-emerald-700">
                  Esqueceu sua senha?
                </button>
              )}
              <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-emerald-600 hover:text-emerald-700">
                {isLoginView ? 'Não tem conta de paciente? Cadastre-se aqui' : 'Já tem uma conta? Faça login'}
              </button>
              <div className="border-t pt-4">
                   <button onClick={onNavigateToPartnerRegistration} className="text-sm text-gray-700 hover:text-emerald-700 font-semibold">
                      É uma clínica ou laboratório? Seja um parceiro Docton
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </>
  );
}