import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { AuthLayout } from './components/layout/AuthLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { AppointmentBooking } from './pages/patient/AppointmentBooking';
import { HealthTrackingPage } from './pages/patient/HealthTrackingPage';

// Professional Pages
import { ProfessionalDashboard } from './pages/professional/ProfessionalDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ 
  element, 
  allowedRoles, 
}: { 
  element: React.ReactElement, 
  allowedRoles?: string[],
}) => {
  const { user } = useAuth();
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If role restriction exists and user's role is not allowed, redirect to appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'patient') {
      return <Navigate to="/patient/dashboard" />;
    }
    if (user.role === 'professional') {
      return <Navigate to="/professional/dashboard" />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<div>Recuperação de senha em desenvolvimento</div>} />
          </Route>
          
          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute 
              element={<DashboardLayout />}
              allowedRoles={['patient']}
            />
          }>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="appointments" element={<AppointmentBooking />} />
            <Route path="health" element={<HealthTrackingPage />} />
            <Route path="content" element={<div>Conteúdos Educativos em desenvolvimento</div>} />
            <Route path="rewards" element={<div>Recompensas em desenvolvimento</div>} />
            <Route path="subscription" element={<div>Assinatura em desenvolvimento</div>} />
          </Route>
          
          {/* Professional Routes */}
          <Route path="/professional" element={
            <ProtectedRoute 
              element={<DashboardLayout />}
              allowedRoles={['professional']}
            />
          }>
            <Route path="dashboard" element={<ProfessionalDashboard />} />
            <Route path="appointments" element={<div>Agenda em desenvolvimento</div>} />
            <Route path="patients" element={<div>Pacientes em desenvolvimento</div>} />
            <Route path="records" element={<div>Prontuários em desenvolvimento</div>} />
            <Route path="finance" element={<div>Financeiro em desenvolvimento</div>} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute 
              element={<DashboardLayout />}
              allowedRoles={['admin']}
            />
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<div>Usuários em desenvolvimento</div>} />
            <Route path="content" element={<div>Conteúdos em desenvolvimento</div>} />
            <Route path="finance" element={<div>Financeiro em desenvolvimento</div>} />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Import the hook here
import { useAuth } from './hooks/useAuth';

export default App;