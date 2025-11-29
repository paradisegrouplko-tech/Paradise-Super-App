
import React from 'react';
import { Home, PlaySquare, MessageCircle, ShoppingBag, LayoutGrid } from 'lucide-react';
import { AppRoute } from '../types';

interface BottomNavProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: <Home size={22} />, route: AppRoute.DASHBOARD },
    { id: 'video', label: 'Video', icon: <PlaySquare size={22} />, route: AppRoute.VIDEO_HUB },
    { id: 'chat', label: 'Chat', icon: <MessageCircle size={22} />, route: AppRoute.CHAT_HUB },
    { id: 'market', label: 'Marketplace', icon: <ShoppingBag size={22} />, route: AppRoute.MARKETPLACE },
    { id: 'explore', label: 'Explore', icon: <LayoutGrid size={22} />, route: AppRoute.LAUNCHER },
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
