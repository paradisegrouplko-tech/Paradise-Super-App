
import React from 'react';
import { X, User, Users, ShoppingBag, Wallet, Settings, LayoutGrid, HelpCircle } from 'lucide-react';
import { User as UserType, AppRoute } from '../types';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
  onNavigate: (route: AppRoute) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, user, onLogout, onNavigate }) => {
  const menuItems = [
    { icon: <LayoutGrid size={20} />, label: "Dashboard", route: AppRoute.DASHBOARD },
    { icon: <Users size={20} />, label: "My Network", comingSoon: true },
    { icon: <Wallet size={20} />, label: "Wallet & UPI", route: AppRoute.UPI_CENTER },
    { icon: <ShoppingBag size={20} />, label: "Marketplace", comingSoon: true },
    { icon: <User size={20} />, label: "Profile Settings", route: AppRoute.PROFILE },
    { icon: <HelpCircle size={20} />, label: "Support", comingSoon: true },
  ];

  const handleNavigation = (item: any) => {
    if (item.comingSoon) {
      alert("This section is coming soon!");
      return;
    }
    if (item.route) {
      onNavigate(item.route);
      onClose();
    }
  };

  // Safe Checks
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = user?.name || 'User';

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-700 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="mt-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 border-white/30 backdrop-blur-md">
              {initial}
            </div>
            <h2 className="text-xl font-bold truncate">{userName}</h2>
            <p className="text-teal-100 text-sm opacity-90">ID: {user?.id || 'N/A'}</p>
            <p className="text-xs mt-2 inline-block bg-black/20 px-2 py-1 rounded">
              {user?.occupationSubCategory || 'Member'}
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => handleNavigation(item)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left ${
                 false // placeholder for active logic if needed
                  ? 'bg-teal-50 text-teal-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.comingSoon && (
                <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-gray-50">
           <button 
             onClick={() => { onLogout(); onClose(); }}
             className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg w-full transition-colors font-medium"
           >
             <Settings size={20} />
             Sign Out
           </button>
        </div>
      </div>
    </>
  );
};
