import React, { useState } from 'react';
import { X, User, Users, ShoppingBag, Wallet, Settings, LayoutGrid, HelpCircle, Crown, Bell, Moon, Globe, LogOut, ChevronDown, ChevronRight, Share2 } from 'lucide-react';
import { User as UserType, AppRoute } from '../types';
import { PremiumBadge } from './PremiumBadge';
import { useLanguage } from '../services/language';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, user, onLogout, onNavigate }) => {
  const { t } = useLanguage();
  
  const handleNavigation = (route: AppRoute) => {
    onNavigate(route);
    onClose();
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  
  // Defensive check for occupation category
  const occupationLabel = (user && user.occupationCategory) 
    ? user.occupationCategory.split('&')[0].trim() 
    : 'Member';

  const coreMenu = [
    { icon: <LayoutGrid size={20} />, label: t('HOME_DASHBOARD'), route: AppRoute.DASHBOARD },
    { icon: <Users size={20} />, label: t('MY_NETWORK_CRM'), route: AppRoute.CRM_DASHBOARD },
    { icon: <Wallet size={20} />, label: t('WALLET_UPI'), route: AppRoute.UPI_CENTER },
    { icon: <ShoppingBag size={20} />, label: t('MARKETPLACE'), route: AppRoute.MARKETPLACE },
    { icon: <Crown size={20} />, label: t('PREMIUM_ACCESS'), route: AppRoute.PREMIUM_ACCESS, isPremium: true },
  ];

  const secondaryMenu = [
    { icon: <User size={18} />, label: t('PROFILE_SETTINGS'), route: AppRoute.PROFILE },
    { icon: <Share2 size={18} />, label: "Refer & Earn", route: AppRoute.REFER_AND_EARN }, // New Item
    { icon: <Bell size={18} />, label: t('NOTIFICATIONS'), action: () => alert("No new notifications") },
    { icon: <HelpCircle size={18} />, label: t('HELP_SUPPORT'), action: () => alert("Support Center coming soon") },
    { icon: <Globe size={18} />, label: t('LANGUAGE'), action: () => alert("Language settings coming soon") },
    { icon: <Moon size={18} />, label: t('APPEARANCE'), action: () => alert("Dark mode coming soon") },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* --- TOP PROFILE BLOCK (PREMIUM STYLE) --- */}
        <div className="p-6 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
             <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
               {initial}
             </div>
             <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
               <X size={24} />
             </button>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-900 truncate">{user.name || 'User'}</h2>
            <PremiumBadge plan={user.plan} size={14} />
          </div>
          
          {/* Updated to show Sponsor Code instead of internal ID if available */}
          <p className="text-xs text-gray-500 font-mono mb-2">
             {user.sponsorCode || `ID: ${user.id}`}
          </p>
          
          <div className="flex items-center gap-2">
             <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-medium">
               {occupationLabel}
             </span>
             <span className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded font-medium">
               Level 1
             </span>
          </div>
        </div>

        {/* --- CORE NAVIGATION MENU --- */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('MENU')}</p>
            <div className="space-y-1">
              {coreMenu.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleNavigation(item.route)}
                  className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-colors ${
                    item.isPremium ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={item.isPremium ? 'text-amber-600' : 'text-gray-500'}>{item.icon}</div>
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* --- SECONDARY MENU --- */}
          <div className="px-4 mt-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t('SETTINGS')}</p>
            <div className="space-y-1">
              {secondaryMenu.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={item.route ? () => handleNavigation(item.route!) : item.action}
                  className="flex items-center gap-3 p-2.5 rounded-lg w-full text-left text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-gray-400">{item.icon}</div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
           <button 
             onClick={() => { onLogout(); onClose(); }}
             className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl w-full transition-colors font-semibold justify-center mb-2"
           >
             <LogOut size={18} />
             {t('SIGN_OUT')}
           </button>
           <p className="text-center text-[10px] text-gray-400">
             {t('SECURED_BY')}
           </p>
        </div>
      </div>
    </>
  );
};