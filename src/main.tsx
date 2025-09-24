import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. O AuthProvider envolve TUDO, garantindo o "sinal" de autenticação */}
    <AuthProvider>
      {/* 2. O RouterProvider assume o controlo da navegação */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

