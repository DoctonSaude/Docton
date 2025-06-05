import React, { createContext, useState, useEffect } from 'react';
import { User, Patient, Professional, Admin } from '../types';
import { mockUsers } from '../mocks/users';

interface AuthContextType {
  user: (Patient | Professional | Admin) | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  isLoading: false,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(Patient | Professional | Admin) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('docton_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('docton_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data (in a real app, this would be an API call)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, you'd verify the password here
        setUser(foundUser);
        localStorage.setItem('docton_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      } else {
        setError('Usuário ou senha inválidos');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('Falha ao fazer login. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docton_user');
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the data to an API
      // For the demo, we'll just create a new user object and "login" with it
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'patient',
        createdAt: new Date(),
      } as Patient | Professional | Admin;
      
      // For the demo, add default values based on role
      if (newUser.role === 'patient') {
        (newUser as Patient).cpf = '';
        (newUser as Patient).address = {
          street: '',
          number: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        };
        (newUser as Patient).healthInfo = {
          conditions: [],
          allergies: [],
          medications: []
        };
        (newUser as Patient).documents = [];
        (newUser as Patient).level = 'bronze';
        (newUser as Patient).points = 0;
      }
      
      setUser(newUser);
      localStorage.setItem('docton_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Falha ao cadastrar. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};