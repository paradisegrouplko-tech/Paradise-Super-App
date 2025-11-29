
import React from 'react';
import { AppRoute } from '../types';
import { logoutAdmin } from '../services/storage';
import { 
  LayoutDashboard, Users, UserCheck, BarChart2, 
  LogOut, Shield, Search
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeRoute, onNavigate }) => {
  
  const handleLogout = () => {
    logoutAdmin();
    onNavigate(AppRoute.ADMIN_LOGIN);
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", route: AppRoute.ADMIN_DASHBOARD },
    { icon: <Users size={20} />, label: "User Management", route: AppRoute.ADMIN_USERS },
    { icon: <UserCheck size={20} />, label: "Approvals", route: AppRoute.ADMIN_APPROVALS },
    { icon: <BarChart2 size={20} />, label: "Analytics", route: AppRoute.ADMIN_STATS },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Paradise</h1>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.route)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                activeRoute === item.route 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:bg-slate-800 hover:text-red-300 w-full px-4 py-3 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};
