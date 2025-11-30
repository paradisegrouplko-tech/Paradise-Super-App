
import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Launcher } from './pages/Launcher';
import { SectionDetail } from './pages/SectionDetail';
import { Profile } from './pages/Profile';
import { UPIPaymentCenter } from './pages/UPIPaymentCenter';

// New Main Tabs
import { VideoHub } from './pages/VideoHub';
import { ChatHub } from './pages/ChatHub';
import { Marketplace } from './pages/Marketplace';
import { AIHub } from './pages/AIHub'; 

// Dynamic Pages
import { ServiceCategory } from './pages/ServiceCategory'; // New

// CRM Pages
import { NetworkCRM } from './pages/crm/NetworkCRM';
import { CRMMemberDetail } from './pages/crm/CRMMemberDetail';

import { BottomNav } from './components/BottomNav';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminUserDetail } from './pages/admin/AdminUserDetail';
import { AdminApprovals } from './pages/admin/AdminApprovals';
import { AdminStats } from './pages/admin/AdminStats';

import { AppRoute, User, AppSectionItem, ServiceCategoryData } from './types';
import { getCurrentSession, isAdminLoggedIn } from './services/storage';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [currentSection, setCurrentSection] = useState<AppSectionItem | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  // State for Service Category Page
  const [currentServiceCategory, setCurrentServiceCategory] = useState<ServiceCategoryData | null>(null);
  
  const [upiView, setUpiView] = useState<'HOME' | 'SEND' | 'SCAN' | 'HISTORY'>('HOME');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser(session);
      setRoute(AppRoute.DASHBOARD);
    } 
    else if (isAdminLoggedIn()) {
      setRoute(AppRoute.ADMIN_DASHBOARD);
    }
    
    setInitializing(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setRoute(AppRoute.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setRoute(AppRoute.LOGIN);
  };

  const handleNavigate = (newRoute: AppRoute, params?: any) => {
    if (newRoute === AppRoute.SECTION_DETAIL && params?.section) {
      setCurrentSection(params.section);
    }
    
    // Handle Service Category Navigation
    if (newRoute === AppRoute.SERVICE_CATEGORY && params?.categoryData) {
      setCurrentServiceCategory(params.categoryData);
    }
    
    if ((newRoute === AppRoute.ADMIN_USER_DETAIL || newRoute === AppRoute.CRM_MEMBER_DETAIL) && params?.userId) {
      setSelectedUserId(params.userId);
    }
    if (newRoute === AppRoute.CRM_MEMBER_DETAIL && params?.memberId) {
      setSelectedUserId(params.memberId);
    }
    
    if (newRoute === AppRoute.UPI_CENTER) {
      if (params?.view) {
        setUpiView(params.view);
      } else {
        setUpiView('HOME');
      }
    }

    setRoute(newRoute);
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const showBottomNav = user !== null && [
    AppRoute.DASHBOARD, 
    AppRoute.CHAT_HUB, 
    AppRoute.AI_HUB,
    AppRoute.VIDEO_HUB, 
    AppRoute.MARKETPLACE
  ].includes(route);

  const renderContent = () => {
    switch (route) {
      case AppRoute.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      
      case AppRoute.REGISTER:
        return <Register onNavigate={handleNavigate} />;
      
      case AppRoute.DASHBOARD:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <Dashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;

      case AppRoute.LAUNCHER:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <Launcher onNavigate={handleNavigate} />;
      
      case AppRoute.VIDEO_HUB:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <VideoHub onNavigate={handleNavigate} />;

      case AppRoute.CHAT_HUB:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <ChatHub onNavigate={handleNavigate} />;

      case AppRoute.AI_HUB:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <AIHub onNavigate={handleNavigate} />;

      case AppRoute.MARKETPLACE:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <Marketplace onNavigate={handleNavigate} />;

      case AppRoute.SECTION_DETAIL:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <SectionDetail onNavigate={handleNavigate} section={currentSection} />;
        
      case AppRoute.SERVICE_CATEGORY:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <ServiceCategory onNavigate={handleNavigate} categoryData={currentServiceCategory} />;

      case AppRoute.PROFILE:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <Profile user={user} onNavigate={handleNavigate} />;

      case AppRoute.UPI_CENTER:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <UPIPaymentCenter user={user} onNavigate={handleNavigate} initialView={upiView} />;

      case AppRoute.CRM_DASHBOARD:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <NetworkCRM user={user} onNavigate={handleNavigate} />;

      case AppRoute.CRM_MEMBER_DETAIL:
        if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
        return <CRMMemberDetail onNavigate={handleNavigate} memberId={selectedUserId} />;

      // --- ADMIN ROUTES ---
      case AppRoute.ADMIN_LOGIN:
        return <AdminLogin onNavigate={handleNavigate} />;
      
      case AppRoute.ADMIN_DASHBOARD:
        return <AdminDashboard onNavigate={handleNavigate} />;
      
      case AppRoute.ADMIN_USERS:
        return <AdminUsers onNavigate={handleNavigate} />;
      
      case AppRoute.ADMIN_USER_DETAIL:
        return <AdminUserDetail onNavigate={handleNavigate} userId={selectedUserId} />;
      
      case AppRoute.ADMIN_APPROVALS:
        return <AdminApprovals onNavigate={handleNavigate} />;
        
      case AppRoute.ADMIN_STATS:
        return <AdminStats onNavigate={handleNavigate} />;

      default:
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderContent()}
      {showBottomNav && <BottomNav activeRoute={route} onNavigate={handleNavigate} />}
    </>
  );
};

export default App;
