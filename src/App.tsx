import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import MainLayout from './components/Layout/MainLayout';
import ServiceSearchPage from './components/Pages/ServiceSearchPage';
import SearchResultsPage from './components/Pages/SearchResultsPage';
import ServiceDetailPage from './components/Pages/ServiceDetailPage';
import ShoppingCartPage from './components/Pages/ShoppingCartPage';
import CheckoutPage from './components/Pages/CheckoutPage';
import MyAppointmentsPage from './components/Pages/MyAppointmentsPage';
import MedicalHistory from './components/Medical/MedicalHistory';
import UserProfile from './components/Profile/UserProfile';
import PartnerDashboard from './components/Dashboard/PartnerDashboard';
import PartnerServices from './components/Services/PartnerServices';
import EarningsPage from './components/Financial/EarningsPage';
import PartnerRegistrationPage from './components/Pages/PartnerRegistrationPage';
import MainDashboard from './components/Dashboard/MainDashboard';
import PartnerAgendaPage from './components/Pages/PartnerAgendaPage';
import PartnersPage from './components/Partners/PartnersPage';
import UserManagement from './components/Users/UserManagement';
import ApprovalQueuePage from './components/Pages/ApprovalQueuePage';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import PartnerProfilePage from './components/Pages/PartnerProfilePage';
import PartnerFinancialSetupPage from './components/Pages/PartnerFinancialSetupPage';
import AdminFinancialsPage from './components/Pages/AdminFinancialsPage';
import AdminPayoutsPage from './components/Pages/AdminPayoutsPage';
import AdminSettingsPage from './components/Pages/AdminSettingsPage';
import SubscriptionPage from './components/Pages/SubscriptionPage';
import AdminSubscriptionsPage from './components/Pages/AdminSubscriptionsPage';
import ChallengesPage from './components/Challenges/ChallengesPage';
import AdminChallengesPage from './components/Pages/AdminChallengesPage';
import SupportPage from './components/Support/SupportPage';
import AdminApiIntegrationsPage from './components/Pages/AdminApiIntegrationsPage';
import AdminReportsPage from './components/Pages/AdminReportsPage';
import AdminPermissionsPage from './components/Pages/AdminPermissionsPage';
import AdminPriceManagementPage from './components/Pages/AdminPriceManagementPage';
import PartnerTeamPage from './components/Pages/PartnerTeamPage';
import PatientReviewPage from './components/Pages/PatientReviewPage';
import PartnerReviewsPage from './components/Pages/PartnerReviewsPage';
import AdminReviewsPage from './components/Pages/AdminReviewsPage';
import PartnerReportsPage from './components/Pages/PartnerReportsPage';
// 1. IMPORTAMOS A PÁGINA DE GESTÃO DE RECOMPENSAS
import AdminRewardsPage from './components/Pages/AdminRewardsPage';


function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [shoppingCart, setShoppingCart] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [reviewingAppointment, setReviewingAppointment] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState('Grátis');

  const patientDashboardData = {
    kpis: {
        nextAppointment: { date: '2025-08-05T16:00:00Z', service: 'Consulta de Rotina' },
        points: 1250,
        challengesCompleted: 8,
    },
    recentActivity: [
        { id: 1, type: 'compra', description: 'Compra do serviço "Hemograma Completo" realizada.' },
        { id: 2, type: 'desafio', description: 'Desafio "Caminhada de 10.000 Passos" concluído.' },
    ]
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('docton_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') setActiveTab('adminDashboard');
      else if (parsedUser.role === 'partner') setActiveTab('partnerDashboard');
      else setActiveTab('patientDashboard');
    }
  }, []);

  const handleLogin = (email: string, password: string, role: string) => {
    let name = 'Paciente Teste';
    if (role === 'partner') name = 'Laboratório Diagnóstico';
    if (role === 'admin') name = 'Admin Docton';
    
    const mockUser = { id: 'u1', email, role, name };
    setUser(mockUser);
    localStorage.setItem('docton_user', JSON.stringify(mockUser));

    if (role === 'admin') setActiveTab('adminDashboard');
    else if (role === 'partner') setActiveTab('partnerDashboard');
    else setActiveTab('patientDashboard');
  };
  
  const handleRegister = (data: any) => {
    const mockUser = { id: '2', email: data.email, role: 'patient', name: data.name};
    setUser(mockUser);
    localStorage.setItem('docton_user', JSON.stringify(mockUser));
    setActiveTab('patientDashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('docton_user');
    setActiveTab('');
  };
  
  const handleNavigateToPartnerRegistration = () => {
      setActiveTab('partnerRegistration');
  };

  const handleSearch = (searchTerm: string) => {
    setCurrentSearch(searchTerm);
    setActiveTab('searchResults');
  };

  const handleSelectService = (serviceData: any) => {
    setSelectedService(serviceData);
    setActiveTab('serviceDetail');
  };
  
  const handleAddToCart = (service: any) => {
    setShoppingCart(prevCart => {
      const isItemInCart = prevCart.find(item => item.id === service.id);
      if (isItemInCart) {
        alert("Este item já está no seu carrinho.");
        return prevCart;
      }
      alert(`${service.partnerName} foi adicionado ao carrinho!`);
      setActiveTab('shoppingCart'); 
      return [...prevCart, service];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setShoppingCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  const handleCheckout = () => {
    if (shoppingCart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    setActiveTab('checkout');
  };
  
  const handleConfirmPayment = (paymentMethod: string) => {
    const purchasedItem = shoppingCart[0];
    if (purchasedItem && purchasedItem.id.startsWith('plan_')) {
        setCurrentPlan(purchasedItem.serviceName.replace('Assinatura Plano ', ''));
        alert('Upgrade de plano realizado com sucesso!');
        setActiveTab('patientDashboard');
    } else {
        alert(`Pagamento com ${paymentMethod} confirmado! (Simulação) \nSua Guia de Atendimento foi gerada.`);
        setActiveTab('myAppointments');
    }
    setShoppingCart([]);
  };

  const handleUpdateUser = (userData: any) => {
      console.log("Atualizando usuário", userData);
      setUser(userData);
  }

  const handleNavigateToReview = (appointment: any) => {
      setReviewingAppointment(appointment);
      setActiveTab('patientReview');
  };

  const handleSubscribe = (plan: any) => {
      if (plan.name === 'Grátis') {
          setCurrentPlan('Grátis');
          alert('Você já está no plano Grátis.');
          return;
      }
      const planAsProduct = {
          id: plan.id,
          serviceName: `Assinatura Plano ${plan.name}`,
          partnerName: 'Docton',
          price: plan.price.monthly,
          partnerInfo: { logo: 'https://via.placeholder.com/40' }
      };
      setShoppingCart([planAsProduct]);
      setActiveTab('checkout');
  };

  const renderContent = () => {
    switch(activeTab) {
      // --- Rota Comum a Todos os Perfis ---
      case 'support': return <SupportPage userRole={user?.role} />;

      // --- Rotas do Paciente ---
      case 'patientDashboard': return <PatientDashboard user={user} kpis={patientDashboardData.kpis} recentActivity={patientDashboardData.recentActivity} onNavigate={setActiveTab} />;
      case 'serviceSearch': return <ServiceSearchPage onSearch={handleSearch} />;
      case 'myAppointments': return <MyAppointmentsPage onNavigateToReview={handleNavigateToReview} />;
      case 'medicalHistory': return <MedicalHistory />;
      case 'subscription': return <SubscriptionPage onSubscribe={handleSubscribe} currentPlanName={currentPlan} />;
      case 'challenges': return <ChallengesPage />;
      case 'patientReview': return <PatientReviewPage />;

      // --- Rotas do Parceiro ---
      case 'partnerDashboard': return <PartnerDashboard user={user} />;
      case 'partnerAgenda': return <PartnerAgendaPage />;
      case 'partnerServices': return <PartnerServices />;
      case 'partnerFinancial': return <EarningsPage />;
      case 'partnerProfile': return <PartnerProfilePage />;
      case 'partnerFinancialSetup': return <PartnerFinancialSetupPage />;
      case 'partnerTeam': return <PartnerTeamPage />;
      case 'partnerReviews': return <PartnerReviewsPage />;
      case 'partnerReports': return <PartnerReportsPage />;

      // --- Rotas de Compra (usadas pelo Paciente) ---
      case 'searchResults': return <SearchResultsPage searchTerm={currentSearch} onBack={() => setActiveTab('serviceSearch')} onSelectService={handleSelectService} />;
      case 'serviceDetail': return <ServiceDetailPage service={selectedService} onBack={() => setActiveTab('searchResults')} onAddToCart={handleAddToCart} />;
      case 'shoppingCart': return <ShoppingCartPage cartItems={shoppingCart} onRemoveFromCart={handleRemoveFromCart} onBack={() => setActiveTab('serviceSearch')} onCheckout={handleCheckout}/>;
      case 'checkout': return <CheckoutPage cartItems={shoppingCart} onBack={() => setActiveTab('subscription')} onConfirmPayment={handleConfirmPayment} />;
      
      // --- Rotas do Admin ---
      case 'adminDashboard': return <MainDashboard />;
      case 'adminPartners': return <PartnersPage />;
      case 'adminPatients': return <UserManagement />;
      case 'adminApprovals': return <ApprovalQueuePage />;
      case 'adminFinancial': return <AdminFinancialsPage />;
      case 'adminPayouts': return <AdminPayoutsPage />;
      case 'adminSettings': return <AdminSettingsPage />;
      case 'adminSubscriptions': return <AdminSubscriptionsPage />;
      case 'adminChallenges': return <AdminChallengesPage />;
      case 'adminApiIntegrations': return <AdminApiIntegrationsPage />;
      case 'adminReports': return <AdminReportsPage />;
      case 'adminPermissions': return <AdminPermissionsPage />;
      case 'adminPriceManagement': return <AdminPriceManagementPage />;
      case 'adminReviews': return <AdminReviewsPage />;
      // 2. NOVA ROTA PARA GESTÃO DE RECOMPENSAS
      case 'adminRewards': return <AdminRewardsPage />;

      // --- Rotas Comuns / Públicas ---
      case 'userProfile': return <UserProfile user={user} onUpdateUser={handleUpdateUser} />;
      case 'partnerRegistration': return <PartnerRegistrationPage />;
      
      default: return null;
    }
  };

  if (activeTab === 'partnerRegistration') {
      return <PartnerRegistrationPage />;
  }

  if (!user) {
    return <LoginForm 
              onLogin={handleLogin} 
              onRegister={handleRegister} 
              onNavigateToPartnerRegistration={handleNavigateToPartnerRegistration}
            />;
  }

  return (
    <>
      <MainLayout
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        cartItemCount={shoppingCart.length}
        onCartClick={() => setActiveTab('shoppingCart')}
      >
        {renderContent()}
      </MainLayout>
      <div className="fixed bottom-4 right-4 z-50">
         <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-semibold shadow-lg">
          Sair
        </button>
      </div>
    </>
  );
}

export default App;
