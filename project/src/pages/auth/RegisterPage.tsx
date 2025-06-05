import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Phone, Lock, CheckCircle, UserPlus, Stethoscope } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'professional',
  });
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: 'patient' | 'professional') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateStep1 = () => {
    if (!formData.role) {
      setError('Por favor, selecione um tipo de conta');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido');
      return false;
    }
    
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX');
      return false;
    }
    
    setError('');
    return true;
  };

  const validateStep3 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    try {
      const success = await register(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        },
        formData.password
      );
      
      if (success) {
        if (formData.role === 'patient') {
          navigate('/patient/onboarding');
        } else {
          navigate('/professional/onboarding');
        }
      }
    } catch (err) {
      setError('Falha ao criar conta. Por favor, tente novamente.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Crie sua conta</h1>
      <p className="text-gray-600 mb-6">
        {step === 1 && 'Selecione o tipo de conta que você deseja criar'}
        {step === 2 && 'Preencha seus dados pessoais para continuar'}
        {step === 3 && 'Crie uma senha segura para sua conta'}
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Account Type Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.role === 'patient' 
                  ? 'border-cyan-500 bg-cyan-50' 
                  : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50'
              }`}
              onClick={() => handleRoleChange('patient')}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <UserPlus size={24} className="text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Sou Paciente</h3>
                  <p className="text-sm text-gray-500">
                    Quero consultar médicos, acompanhar minha saúde e acessar conteúdos educativos
                  </p>
                </div>
                {formData.role === 'patient' && (
                  <div className="ml-3">
                    <CheckCircle size={20} className="text-cyan-600" />
                  </div>
                )}
              </div>
            </div>
            
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.role === 'professional' 
                  ? 'border-cyan-500 bg-cyan-50' 
                  : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50'
              }`}
              onClick={() => handleRoleChange('professional')}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <Stethoscope size={24} className="text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Sou Profissional de Saúde</h3>
                  <p className="text-sm text-gray-500">
                    Quero oferecer consultas, gerenciar pacientes e usar prontuário eletrônico
                  </p>
                </div>
                {formData.role === 'professional' && (
                  <div className="ml-3">
                    <CheckCircle size={20} className="text-cyan-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Personal Information */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="Nome completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              fullWidth
              required
              leftIcon={<User size={18} />}
            />
            
            <Input
              label="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              fullWidth
              required
              leftIcon={<Mail size={18} />}
            />
            
            <Input
              label="Telefone celular"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 98765-4321"
              fullWidth
              required
              leftIcon={<Phone size={18} />}
              helperText="Utilizaremos para enviar confirmações e lembretes"
            />
          </div>
        )}
        
        {/* Step 3: Password Creation */}
        {step === 3 && (
          <div className="space-y-4">
            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crie uma senha forte"
              fullWidth
              required
              leftIcon={<Lock size={18} />}
              helperText="Mínimo de 8 caracteres"
            />
            
            <Input
              label="Confirmar senha"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              fullWidth
              required
              leftIcon={<Lock size={18} />}
            />
          </div>
        )}
        
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              type="button"
            >
              Voltar
            </Button>
          ) : (
            <Link to="/login" className="text-sm text-cyan-600 hover:text-cyan-800">
              Já tem uma conta? Entrar
            </Link>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={handleNext}
              type="button"
              rightIcon={<ArrowRight size={18} />}
            >
              Continuar
            </Button>
          ) : (
            <Button 
              type="submit" 
              isLoading={isLoading}
            >
              Criar conta
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

// Import for the arrow icon
import { ArrowRight } from 'lucide-react';