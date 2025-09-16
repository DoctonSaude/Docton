import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Edit3,
  Upload,
  Trash2,
  Settings,
  Bell,
  Globe,
  Heart,
  Star,
  Award,
  CreditCard,
  FileText,
  Download,
  Users as GenderIcon // Renomeado para evitar conflito
} from 'lucide-react';

interface UserProfileProps {
  user: any;
  onUpdateUser: (userData: any) => void;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string; // Novo campo
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// ... (outras interfaces permanecem as mesmas)
interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  promotionalEmails: boolean;
  securityAlerts: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}


export default function UserProfile({ user, onUpdateUser }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  // ... outros estados
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '', // Inicializando novo campo
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  
    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    promotionalEmails: false,
    securityAlerts: true
  });

  // ... (Hooks useEffect e outras funções permanecem majoritariamente os mesmos)
    useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Simular carregamento de dados da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Em produção viria da API
      const mockProfileData = {
        name: user?.name || 'João Silva',
        email: user?.email || 'joao@email.com',
        phone: '(11) 99999-9999',
        dateOfBirth: '1990-05-15',
        gender: 'Masculino',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        bio: 'Profissional da área da saúde com mais de 10 anos de experiência.',
        emergencyContact: 'Maria Silva',
        emergencyPhone: '(11) 88888-8888'
      };
      
      setProfileForm(mockProfileData);
      
      // Simular imagem de perfil
      if (user?.avatar) {
        setProfileImage(user.avatar);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setErrors({ general: 'Erro ao carregar dados do perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!profileForm.name.trim() || profileForm.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!profileForm.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (profileForm.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(profileForm.phone)) {
      newErrors.phone = 'Telefone inválido (formato: (11) 99999-9999)';
    }

    if (profileForm.zipCode && !/^\d{5}-\d{3}$/.test(profileForm.zipCode)) {
      newErrors.zipCode = 'CEP inválido (formato: 12345-678)';
    }

    if (profileForm.emergencyPhone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(profileForm.emergencyPhone)) {
      newErrors.emergencyPhone = 'Telefone de emergência inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
    const validatePasswordForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'Nova senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha não confere';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = 'Nova senha deve ser diferente da atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      if (numbers.length <= 2) {
        return numbers;
      } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      } else if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      }
    }
    
    return value;
  };

  const formatZipCode = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 8) {
      if (numbers.length <= 5) {
        return numbers;
      } else {
        return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
      }
    }
    
    return value;
  };
  
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors({ image: 'Apenas arquivos de imagem são permitidos' });
        return;
      }
      
      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ image: 'Imagem deve ter no máximo 5MB' });
        return;
      }
      
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Limpar erro de imagem
      const newErrors = { ...errors };
      delete newErrors.image;
      setErrors(newErrors);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simular upload de imagem se houver
      let imageUrl = profileImage;
      if (imageFile) {
        // Simular upload para servidor
        await new Promise(resolve => setTimeout(resolve, 1500));
        imageUrl = `https://example.com/uploads/${Date.now()}.jpg`;
      }
      
      // Simular salvamento na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar dados do usuário
      const updatedUser = {
        ...user,
        ...profileForm,
        avatar: imageUrl
      };
      
      onUpdateUser(updatedUser);
      
      setSuccessMessage('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setErrors({ general: 'Erro ao salvar perfil. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simular verificação da senha atual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular atualização da senha na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Senha alterada com sucesso!');
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setErrors({ general: 'Erro ao alterar senha. Verifique sua senha atual.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    
    try {
      // Simular salvamento na API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Configurações de notificação atualizadas!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
      setErrors({ general: 'Erro ao salvar configurações' });
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleExportData = () => {
    const userData = {
      profile: profileForm,
      notifications: notificationSettings,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `perfil-${user?.name?.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };


  const renderProfileForm = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        {/* ... Lógica de upload de imagem ... */}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={profileForm.email}
              disabled // E-mail não deve ser editável
              className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: formatPhone(e.target.value) })}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
            <input
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
            <select
                value={profileForm.gender}
                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
            >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não informar">Prefiro não informar</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-lg font-medium text-gray-900">Endereço</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <input
                    type="text"
                    value={profileForm.zipCode}
                    onChange={(e) => setProfileForm({ ...profileForm, zipCode: formatZipCode(e.target.value) })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
                    placeholder="12345-678"
                    maxLength={9}
                />
            </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
                    placeholder="Rua, número, complemento"
                />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <input
                type="text"
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <input
                type="text"
                value={profileForm.state}
                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'border-gray-300'}`}
              />
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="flex space-x-4 pt-6 border-t">
            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg">
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
  
  // ... (As funções renderSecuritySettings, renderNotificationSettings e renderAccountData permanecem as mesmas)
    const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Alterar senha */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
            <p className="text-gray-600 text-sm">Mantenha sua conta segura com uma senha forte</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Alterar Senha</span>
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Mínimo 8 caracteres com pelo menos 1 letra minúscula, 1 maiúscula e 1 número
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Alterando...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Alterar Senha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Autenticação em duas etapas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Autenticação em Duas Etapas</h3>
            <p className="text-gray-600 text-sm">Adicione uma camada extra de segurança à sua conta</p>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
            Configurar
          </button>
        </div>
      </div>

      {/* Sessões ativas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sessões Ativas</h3>
            <p className="text-gray-600 text-sm">Gerencie onde você está conectado</p>
          </div>
          <button className="text-red-600 hover:text-red-700 font-medium">
            Encerrar Todas
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Navegador Atual</p>
              <p className="text-gray-600 text-sm">Chrome • São Paulo, SP • Agora</p>
            </div>
            <span className="text-green-600 text-sm font-medium">Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferências de Notificação</h3>
        
        <div className="space-y-6">
          {/* E-mail */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificações por E-mail</h4>
              <p className="text-gray-600 text-sm">Receba atualizações importantes por e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificações por SMS</h4>
              <p className="text-gray-600 text-sm">Receba lembretes por mensagem de texto</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  smsNotifications: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Lembretes de agendamento */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Lembretes de Agendamento</h4>
              <p className="text-gray-600 text-sm">Receba lembretes antes das consultas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.appointmentReminders}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  appointmentReminders: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* E-mails promocionais */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">E-mails Promocionais</h4>
              <p className="text-gray-600 text-sm">Receba ofertas e novidades da plataforma</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.promotionalEmails}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  promotionalEmails: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Alertas de segurança */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Alertas de Segurança</h4>
              <p className="text-gray-600 text-sm">Notificações sobre atividades suspeitas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.securityAlerts}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  securityAlerts: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={handleSaveNotifications}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Preferências</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountData = () => (
    <div className="space-y-6">
      {/* Estatísticas da conta */}
      {user?.role === 'patient' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Consultas Realizadas</h3>
            <p className="text-2xl font-bold text-emerald-600">12</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Pontos Acumulados</h3>
            <p className="text-2xl font-bold text-yellow-600">{user?.points || 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Desafios Concluídos</h3>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </div>
        </div>
      )}

      {/* Informações da conta */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Conta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID da Conta</label>
            <p className="text-gray-900 font-mono">{user?.id || 'USR-001'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
            <p className="text-gray-900 capitalize">{user?.role || 'Paciente'}</p>
          </div>

          {user?.plan && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plano Atual</label>
              <div className="flex items-center space-x-2">
                <p className="text-gray-900 capitalize">{user.plan}</p>
                {user.plan === 'premium' && <Star className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membro Desde</label>
            <p className="text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Janeiro 2024'}
            </p>
          </div>
        </div>
      </div>

      {/* Exportar dados */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exportar Dados</h3>
            <p className="text-gray-600 text-sm">Baixe uma cópia dos seus dados pessoais</p>
          </div>
          <button
            onClick={handleExportData}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Excluir conta */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-900">Zona de Perigo</h3>
            <p className="text-red-700 text-sm">Ações irreversíveis relacionadas à sua conta</p>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold mb-2">Meu Perfil</h1>
                <p className="text-emerald-100">Gerencie suas informações pessoais e configurações de conta</p>
            </div>
            {!isEditing && activeTab === 'profile' && (
                <button onClick={() => setIsEditing(true)} className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium">
                    Editar Perfil
                </button>
            )}
        </div>
      </div>
      
      {/* ... Mensagens de sucesso e erro ... */}
        {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{errors.general}</p>
          </div>
        </div>
      )}


      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
              {[
              { id: 'profile', label: 'Perfil', icon: User },
              { id: 'security', label: 'Segurança', icon: Shield },
              { id: 'notifications', label: 'Notificações', icon: Bell },
              { id: 'account', label: 'Dados da Conta', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                  setShowPasswordForm(false);
                  setErrors({});
                }}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'profile' && renderProfileForm()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'account' && renderAccountData()}
        </div>
      </div>
    </div>
  );
}