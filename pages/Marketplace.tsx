
import React from 'react';
import { AppRoute } from '../types';
import { ShoppingBag, ShoppingCart, Shirt, Smartphone, Home, Coffee, Gift, Plane, Building2, Landmark, Zap, PenTool } from 'lucide-react';
import { Search, MapPin } from 'lucide-react';

interface MarketplaceProps {
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onNavigate }) => {
  
  const handleCategoryClick = (name: string) => {
    alert(`Marketplace for ${name} will launch in future versions.`);
  };

  const categories = [
    { name: "Shopping", icon: <ShoppingBag size={24} />, color: "bg-blue-100 text-blue-600" },
    { name: "Grocery", icon: <ShoppingCart size={24} />, color: "bg-green-100 text-green-600" },
    { name: "Fashion", icon: <Shirt size={24} />, color: "bg-purple-100 text-purple-600" },
    { name: "Electronics", icon: <Smartphone size={24} />, color: "bg-gray-100 text-gray-600" },
    { name: "Home", icon: <Home size={24} />, color: "bg-orange-100 text-orange-600" },
    { name: "Food", icon: <Coffee size={24} />, color: "bg-red-100 text-red-600" },
    { name: "Travel", icon: <Plane size={24} />, color: "bg-sky-100 text-sky-600" },
    { name: "Real Estate", icon: <Building2 size={24} />, color: "bg-amber-100 text-amber-600" },
    { name: "Finance", icon: <Landmark size={24} />, color: "bg-emerald-100 text-emerald-600" },
    { name: "Services", icon: <Zap size={24} />, color: "bg-yellow-100 text-yellow-600" },
    { name: "Digital", icon: <PenTool size={24} />, color: "bg-indigo-100 text-indigo-600" },
    { name: "Gifting", icon: <Gift size={24} />, color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
       {/* Header */}
       <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <ShoppingBag className="text-rose-500" size={24} />
                <h1 className="text-xl font-bold text-gray-900">Marketplace</h1>
             </div>
             <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <MapPin size={12} /> Bangalore
             </div>
          </div>
          
          <div className="relative">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search for products, brands and more" 
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
             />
          </div>
       </div>

       {/* Banner */}
       <div className="p-4">
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
             <div className="relative z-10">
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Grand Launch Offer</span>
                <h2 className="text-2xl font-bold mb-1">Up to 50% OFF</h2>
                <p className="text-sm opacity-90 mb-4">On Fashion & Electronics</p>
                <button className="bg-white text-rose-600 text-xs font-bold px-4 py-2 rounded-full">Shop Now</button>
             </div>
             <div className="absolute -right-4 -bottom-8 opacity-20 transform rotate-12">
                <ShoppingBag size={120} />
             </div>
          </div>
       </div>

       {/* Categories Grid */}
       <div className="px-4 pb-4">
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Shop by Category</h3>
          <div className="grid grid-cols-3 gap-3">
             {categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                >
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.color}`}>
                      {cat.icon}
                   </div>
                   <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                </button>
             ))}
          </div>
       </div>

       {/* Deal of the Day Placeholder */}
       <div className="px-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">Deal of the Day</h3>
                <span className="text-xs text-rose-500 font-bold">View All</span>
             </div>
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="flex-none w-32">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative">
                         <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded">-20%</span>
                      </div>
                      <p className="text-xs font-medium text-gray-800 truncate">Premium Headphones</p>
                      <p className="text-xs text-gray-500">₹1,999</p>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};
