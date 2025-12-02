import React from 'react';
import { Home, PlaySquare, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { AppRoute } from '../types';
import { useLanguage } from '../services/language';

interface BottomNavProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute, onNavigate }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', label: t('HOME'), icon: <Home size={22} />, route: AppRoute.DASHBOARD },
    { id: 'chat', label: t('CHAT'), icon: <MessageCircle size={22} />, route: AppRoute.CHAT_HUB },
    { id: 'ai', label: t('PARADISE_AI'), icon: <Sparkles size={22} />, route: AppRoute.AI_HUB },
    { id: 'video', label: t('VIDEO'), icon: <PlaySquare size={22} />, route: AppRoute.VIDEO_HUB },
    { id: 'market', label: t('MARKETPLACE'), icon: <ShoppingBag size={22} />, route: AppRoute.MARKETPLACE },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-30 shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeRoute === tab.route;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.route)}
            className={`flex flex-col items-center gap-1 min-w-[60px] ${
              isActive ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'
            } transition-colors`}
          >
            {tab.icon}
            <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};