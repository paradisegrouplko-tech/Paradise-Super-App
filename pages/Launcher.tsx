
import React from 'react';
import { AppRoute, AppSectionItem } from '../types';
import { APP_SECTIONS } from '../constants';
import { SectionIcon } from '../components/SectionIcon';
import { ArrowLeft, Search } from 'lucide-react';

interface LauncherProps {
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const Launcher: React.FC<LauncherProps> = ({ onNavigate }) => {
  const handleSectionClick = (section: AppSectionItem) => {
    if (section.name.includes("UPI Payments")) {
      onNavigate(AppRoute.UPI_CENTER);
      return;
    }
    onNavigate(AppRoute.SECTION_DETAIL, { section });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.DASHBOARD)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">App Drawer</h1>
            <p className="text-teal-100 text-xs opacity-90">All Services & Modules</p>
          </div>
        </div>
        
        {/* Search Bar Placeholder */}
        <div className="max-w-md mx-auto px-4 pb-4">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search services..." 
               className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
             />
           </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 py-6 space-y-8 pb-20">
        {APP_SECTIONS.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-3 px-1">
              {category.title}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl active:scale-95 transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm text-white bg-white`}>
                    <SectionIcon 
                      name={item.name} 
                      category={category.title} 
                      size={26} 
                      className="text-teal-600"
                    />
                  </div>
                  <span className="text-[10px] text-center font-medium text-gray-700 leading-tight line-clamp-2 w-full">
                    {item.name.replace(" (Coming Soon)", "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
