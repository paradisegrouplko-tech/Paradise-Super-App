
import React, { useState } from 'react';
import { X, User, Users, ShoppingBag, Wallet, Settings, LayoutGrid, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { User as UserType, AppRoute, AppCategory } from '../types';
import { APP_SECTIONS } from '../constants';
import { SectionIcon } from './SectionIcon';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
  onNavigate: (route: AppRoute, params?: any) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  route?: AppRoute;
  comingSoon?: boolean;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, user, onLogout, onNavigate }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

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

  const handleSectionClick = (section: any) => {
    onNavigate(AppRoute.SECTION_DETAIL, { section });
    onClose();
  };

  // Safe Checks
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = user?.name || 'User';

  const mainMenuItems: MenuItem[] = [
    { icon: <LayoutGrid size={20} />, label: "Dashboard", route: AppRoute.DASHBOARD },
    { icon: <Users size={20} />, label: "My Network CRM", route: AppRoute.CRM_DASHBOARD },
    { icon: <Wallet size={20} />, label: "Wallet & UPI", route: AppRoute.UPI_CENTER },
    { icon: <ShoppingBag size={20} />, label: "Marketplace", route: AppRoute.MARKETPLACE },
    { icon: <User size={20} />, label: "Profile Settings", route: AppRoute.PROFILE },
  ];

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
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-700 text-white p-6 relative flex-shrink-0">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Main Menu */}
          <div className="space-y-1">
            {mainMenuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleNavigation(item)}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors w-full text-left text-gray-700 hover:bg-gray-50"
              >
                <div className="text-gray-500">{item.icon}</div>
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                {item.comingSoon && (
                  <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          <hr className="border-gray-100" />

          {/* Explore Sections (Integrated) */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Explore All Services
            </h3>
            <div className="space-y-1">
              {APP_SECTIONS.map((category: AppCategory, idx) => {
                const isExpanded = expandedCategories[category.title];
                return (
                  <div key={idx} className="rounded-lg overflow-hidden">
                    <button 
                      onClick={() => toggleCategory(category.title)}
                      className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="text-sm font-semibold text-gray-700">{category.title}</span>
                      {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-white pl-4 border-l-2 border-gray-100 ml-3 my-1 space-y-1">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSectionClick(item)}
                            className="flex items-center gap-3 p-2 w-full text-left hover:bg-teal-50 rounded-r-lg transition-colors group"
                          >
                            <SectionIcon name={item.name} category={category.title} size={16} className="text-gray-400 group-hover:text-teal-600" />
                            <span className="text-sm text-gray-600 group-hover:text-teal-700">
                              {item.name.replace(" (Coming Soon)", "")}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
           <button 
             onClick={() => { onLogout(); onClose(); }}
             className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg w-full transition-colors font-medium justify-center"
           >
             <Settings size={20} />
             Sign Out
           </button>
        </div>
      </div>
    </>
  );
};
