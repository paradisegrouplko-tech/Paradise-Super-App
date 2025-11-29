
import React, { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Launcher } from './pages/Launcher';
import { SectionDetail } from './pages/SectionDetail';
import { Profile } from './pages/Profile';
import { UPIPaymentCenter } from './pages/UPIPaymentCenter';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminUserDetail } from './pages/admin/AdminUserDetail';
import { AdminApprovals } from './pages/admin/AdminApprovals';
import { AdminStats } from './pages/admin/AdminStats';

import { AppRoute, User, AppSectionItem } from './types';
import { getCurrentSession, isAdminLoggedIn } from './services/storage';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [currentSection, setCurrentSection] = useState<AppSectionItem | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>(''); // For Admin detail view
  
  // State for UPI Deep Linking
  const [upiView, setUpiView] = useState<'HOME' | 'SEND' | 'SCAN' | 'HISTORY'>('HOME');

  useEffect(() => {
    // Check for existing user session
    const session = getCurrentSession();
    if (session) {
      setUser(session);
      setRoute(AppRoute.DASHBOARD);
    } 
    // Check for existing Admin session if no user session
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
    // Store Section
    if (newRoute === AppRoute.SECTION_DETAIL && params?.section) {
      setCurrentSection(params.section);
    }
    
    // Store User ID for Admin Detail
    if (newRoute === AppRoute.ADMIN_USER_DETAIL && params?.userId) {
      setSelectedUserId(params.userId);
    }
    
    // Handle UPI Deep Linking
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

  // Router Switch
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

    case AppRoute.SECTION_DETAIL:
      if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      return <SectionDetail onNavigate={handleNavigate} section={currentSection} />;
      
    case AppRoute.PROFILE:
      if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      return <Profile user={user} onNavigate={handleNavigate} />;

    case AppRoute.UPI_CENTER:
      if (!user) return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      return <UPIPaymentCenter user={user} onNavigate={handleNavigate} initialView={upiView} />;

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

export default App;
