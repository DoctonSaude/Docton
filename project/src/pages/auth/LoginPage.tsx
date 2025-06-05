import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    const success = await login(email, password);
    if (!success) {
      setError('E-mail ou senha inválidos');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
      <p className="text-gray-600 mb-6">Entre com suas credenciais para acessar sua conta</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          fullWidth
          required
          leftIcon={<Mail size={18} />}
        />
        
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          fullWidth
          required
          leftIcon={<Lock size={18} />}
        />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              Lembrar de mim
            </label>
          </div>
          
          <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-800">
            Esqueci minha senha
          </Link>
        </div>
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          rightIcon={<ArrowRight size={18} />}
        >
          Entrar
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-cyan-600 hover:text-cyan-800">
            Cadastre-se
          </Link>
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-center text-gray-500">
          Para fins de demonstração, você pode usar:
        </p>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p><strong>Paciente:</strong> joao@example.com</p>
          <p><strong>Profissional:</strong> ana@example.com</p>
          <p><strong>Admin:</strong> admin@docton.com</p>
          <p className="italic text-gray-500 text-xs mt-1">(Qualquer senha funciona na demo)</p>
        </div>
      </div>
    </div>
  );
};