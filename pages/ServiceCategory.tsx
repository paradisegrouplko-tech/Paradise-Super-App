import React from 'react';
import { AppRoute, ServiceCategoryData } from '../types';
import { ArrowLeft, Clock, LayoutGrid } from 'lucide-react';

interface ServiceCategoryProps {
  onNavigate: (route: AppRoute) => void;
  categoryData: ServiceCategoryData | null;
}

export const ServiceCategory: React.FC<ServiceCategoryProps> = ({ onNavigate, categoryData }) => {
  if (!categoryData) return null;

  const handleSubCategoryClick = (sub: string) => {
    alert(`${sub} - Coming Soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => onNavigate(AppRoute.DASHBOARD)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 truncate flex-1">{categoryData.title}</h1>
      </div>

      <div className="p-4">
        <div className={`w-full h-32 rounded-2xl mb-6 flex items-center justify-center ${categoryData.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 ')}`}>
           <div className="text-center">
              <LayoutGrid size={40} className={`mx-auto mb-2 ${categoryData.color.split(' ')[0]}`} />
              <p className={`font-bold ${categoryData.color.split(' ')[0]}`}>Explore {categoryData.title}</p>
           </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categoryData.subCategories.map((sub, idx) => (
            <button key={idx} onClick={() => handleSubCategoryClick(sub)} className="flex flex-col items-center gap-2 group active:scale-95 transition-transform">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:border-teal-200 transition-colors">
                 <Clock size={20} />
              </div>
              <span className="text-[10px] font-medium text-gray-600 text-center leading-tight line-clamp-2 h-8 flex items-center justify-center w-full">{sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};