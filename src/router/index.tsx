import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import PublicLayout from '../components/Layout/PublicLayout';
import PatientLayout from '../components/Layout/PatientLayout';
import PartnerLayout from '../components/Layout/PartnerLayout';
import AdminLayout from '../components/Layout/AdminLayout';

// Páginas de Autenticação e Públicas
import LoginForm from '../components/Auth/LoginForm';
import PartnerRegistrationPage from '../components/Pages/PartnerRegistrationPage';

// Páginas do Paciente
import PatientDashboard from '../components/Dashboard/PatientDashboard';
import MyAppointmentsPage from '../components/Pages/MyAppointmentsPage';
import MedicalHistory from '../components/Medical/MedicalHistory';
import ChallengesPage from '../components/Challenges/ChallengesPage';
import SubscriptionPage from '../components/Pages/SubscriptionPage';
import SupportPage from '../components/Support/SupportPage';
import UserProfile from '../components/Profile/UserProfile';
import ServiceSearchPage from '../components/Pages/ServiceSearchPage';

// Páginas do Parceiro
import PartnerDashboard from '../components/Dashboard/PartnerDashboard';
import PartnerAgendaPage from '../components/Pages/PartnerAgendaPage';
import PartnerServices from '../components/Services/PartnerServices';
import PartnerTeamPage from '../components/Pages/PartnerTeamPage';
import PartnerReviewsPage from '../components/Pages/PartnerReviewsPage';
import PartnerReportsPage from '../components/Pages/PartnerReportsPage';
import EarningsPage from '../components/Financial/EarningsPage';
import PartnerProfilePage from '../components/Pages/PartnerProfilePage';
import PartnerFinancialSetupPage from '../components/Pages/PartnerFinancialSetupPage';

// Páginas do Admin
import AdminDashboard from '../components/Dashboard/MainDashboard';
import PartnersPage from '../components/Partners/PartnersPage';
import UserManagement from '../components/Users/UserManagement';
import ApprovalQueuePage from '../components/Pages/ApprovalQueuePage';
import AdminFinancialsPage from '../components/Pages/AdminFinancialsPage';
import AdminPayoutsPage from '../components/Pages/AdminPayoutsPage';
import AdminSettingsPage from '../components/Pages/AdminSettingsPage';
import AdminSubscriptionsPage from '../components/Pages/AdminSubscriptionsPage';
import AdminChallengesPage from '../components/Pages/AdminChallengesPage';
import AdminApiIntegrationsPage from '../components/Pages/AdminApiIntegrationsPage';
import AdminReportsPage from '../components/Pages/AdminReportsPage';
import AdminPermissionsPage from '../components/Pages/AdminPermissionsPage';
import AdminPriceManagementPage from '../components/Pages/AdminPriceManagementPage';
import AdminReviewsPage from '../components/Pages/AdminReviewsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O App é o contentor principal que verifica o 'loading'
    children: [
      // Rotas Públicas (para utilizadores não logados)
      {
        element: <ProtectedRoute allowedRoles={['guest']} />, 
        children: [
            { 
                element: <PublicLayout />, 
                children: [
                    { path: 'login', element: <LoginForm /> },
                    { path: 'partner-registration', element: <PartnerRegistrationPage /> },
                    // Redireciona a raiz "/" para "/login"
                    { index: true, element: <Navigate to="/login" replace /> }
                ]
            }
        ]
      },
      
      // Rotas do Paciente (Protegidas)
      {
        path: 'patient',
        element: <ProtectedRoute allowedRoles={['patient']} />,
        children: [
          { 
            element: <PatientLayout />, // O layout do paciente envolve todas as páginas abaixo
            children: [
              { index: true, element: <PatientDashboard /> },
              { path: 'search', element: <ServiceSearchPage onSearch={() => {}}/> },
              { path: 'appointments', element: <MyAppointmentsPage onNavigateToReview={() => {}} /> },
              { path: 'history', element: <MedicalHistory /> },
              { path: 'challenges', element: <ChallengesPage /> },
              { path: 'subscription', element: <SubscriptionPage onSubscribe={() => {}} currentPlanName="Grátis" /> },
              { path: 'profile', element: <UserProfile user={{}} onUpdateUser={()=>{}} /> },
              { path: 'support', element: <SupportPage userRole="patient" /> },
            ]
          }
        ]
      },

      // Rotas do Parceiro (Protegidas)
      {
        path: 'partner',
        element: <ProtectedRoute allowedRoles={['partner']} />,
        children: [
          { 
            element: <PartnerLayout />, 
            children: [
              { index: true, element: <PartnerDashboard /> },
              { path: 'agenda', element: <PartnerAgendaPage /> },
              { path: 'services', element: <PartnerServices /> },
              { path: 'team', element: <PartnerTeamPage /> },
              { path: 'reviews', element: <PartnerReviewsPage /> },
              { path: 'reports', element: <PartnerReportsPage /> },
              { path: 'earnings', element: <EarningsPage /> },
              { path: 'profile', element: <PartnerProfilePage /> },
              { path: 'financial-setup', element: <PartnerFinancialSetupPage /> },
              { path: 'support', element: <SupportPage userRole="partner" /> },
            ]
          }
        ]
      },

      // Rotas do Admin (Protegidas)
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { 
            element: <AdminLayout />, 
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'partners', element: <PartnersPage /> },
              { path: 'users', element: <UserManagement /> },
              { path: 'approvals', element: <ApprovalQueuePage /> },
              { path: 'financials', element: <AdminFinancialsPage /> },
              { path: 'payouts', element: <AdminPayoutsPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
              { path: 'subscriptions', element: <AdminSubscriptionsPage /> },
              { path: 'challenges', element: <AdminChallengesPage /> },
              { path: 'integrations', element: <AdminApiIntegrationsPage /> },
              { path: 'reports', element: <AdminReportsPage /> },
              { path: 'permissions', element: <AdminPermissionsPage /> },
              { path: 'pricing', element: <AdminPriceManagementPage /> },
              { path: 'reviews', element: <AdminReviewsPage /> },
              { path: 'support', element: <SupportPage userRole="admin" /> },
            ]
          }
        ]
      },

      // Rota de fallback: se nenhuma corresponder, redireciona para a página de login
      { path: '*', element: <Navigate to="/login" replace /> }
    ],
  },
]);

