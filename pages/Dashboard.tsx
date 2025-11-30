
import React, { useState } from 'react';
import { User, AppRoute, ServiceCategoryData } from '../types';
import { logoutUser } from '../services/storage';
import { 
  Bell, QrCode, User as UserIcon,
  Landmark, Wallet, History, CreditCard,
  Users, Trophy, Network, UserPlus, ShieldCheck, Banknote, Star,
  Zap, ShoppingBag, Heart, Plane, MonitorPlay, TrendingUp, Sun, GraduationCap,
  ShoppingCart, Package, Pill, Car, Smartphone, Wifi, Droplet, Flame, LayoutGrid
} from 'lucide-react';
import { Button } from '../components/Button';
import { AppDrawer } from '../components/AppDrawer';
import { SERVICE_CATEGORIES } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const navigateUPI = (view: 'HOME' | 'SEND' | 'SCAN' | 'HISTORY') => {
    onNavigate(AppRoute.UPI_CENTER, { view });
  };

  // Safe name access
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  // Defensive check for directMembers
  const directMembersCount = (user.directMembers || []).length;

  const coreTools = [
    { id: 1, name: "Network Builder", icon: <Network size={20} /> },
    { id: 2, name: "Referral", icon: <UserPlus size={20} /> },
    { id: 3, name: "Team Manager", icon: <Users size={20} /> },
    { id: 4, name: "ID Registration", icon: <ShieldCheck size={20} /> },
    { id: 5, name: "Sponsor Approval", icon: <ShieldCheck size={20} /> },
    { id: 6, name: "Earnings", icon: <Banknote size={20} /> },
    { id: 7, name: "Wallet", icon: <Wallet size={20} /> },
    { id: 8, name: "Ranks", icon: <Star size={20} /> }, 
  ];

  const quickCommerce = [
    { name: "Quick Grocery", icon: <ShoppingCart size={20} />, action: () => alert("Coming soon"), color: "bg-green-100 text-green-600" },
    { name: "Quick Essentials", icon: <Package size={20} />, action: () => alert("Coming soon"), color: "bg-orange-100 text-orange-600" },
    { name: "Quick Pharmacy", icon: <Pill size={20} />, action: () => alert("Coming soon"), color: "bg-rose-100 text-rose-600" },
    { name: "Taxi & Car", icon: <Car size={20} />, action: () => alert("Coming soon"), color: "bg-blue-100 text-blue-600" },
    { name: "Entertainment", icon: <MonitorPlay size={20} />, action: () => alert("Coming soon"), color: "bg-purple-100 text-purple-600" },
  ];

  // Helper to get icon component based on name string from constants
  const getCategoryIcon = (iconName: string, size: number) => {
    switch (iconName) {
      case 'Zap': return <Zap size={size} />;
      case 'ShoppingBag': return <ShoppingBag size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'Plane': return <Plane size={size} />;
      case 'MonitorPlay': return <MonitorPlay size={size} />;
      case 'TrendingUp': return <TrendingUp size={size} />;
      case 'Sun': return <Sun size={size} />;
      case 'GraduationCap': return <GraduationCap size={size} />;
      default: return <Wallet size={size} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <AppDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user} 
        onLogout={handleLogout}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsDrawerOpen(true)}
               className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-bold shadow-sm"
             >
               {initial}
             </button>
             <div className="flex flex-col">
               <span className="text-xs font-semibold text-teal-100 opacity-90">Welcome back</span>
               <span className="text-sm font-bold leading-tight">{firstName}</span>
               <span className="text-[10px] text-teal-200 flex items-center gap-1">
                 Bangalore, India 
               </span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigateUPI('SCAN')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <QrCode size={22} />
             </button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                <Bell size={22} />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-6">
        
        {/* --- SECTION 1: UPI + WALLET --- */}
        <div>
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wide">Transfer Money</p>
             <div className="grid grid-cols-5 gap-2 text-center">
                <button onClick={() => navigateUPI('SCAN')} className="flex flex-col items-center gap-1 group">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform border border-indigo-100">
                     <QrCode size={20} />
                   </div>
                   <span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">Quick Pay</span>
                </button>
                <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-1 group">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                     <UserIcon size={20} />
                   </div>
                   <span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">To Mobile</span>
                </button>
                <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-1 group">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                     <Landmark size={20} />
                   </div>
                   <span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">To Bank</span>
                </button>
                <button onClick={() => navigateUPI('HOME')} className="flex flex-col items-center gap-1 group">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                     <Wallet size={20} />
                   </div>
                   <span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">To Self</span>
                </button>
                <button onClick={() => navigateUPI('HISTORY')} className="flex flex-col items-center gap-1 group">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                     <History size={20} />
                   </div>
                   <span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">History</span>
                </button>
             </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {/* UPI ID Card */}
            <div className="flex-none w-56 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-3 text-white shadow-md relative overflow-hidden" onClick={() => navigateUPI('HOME')}>
               <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
               <div className="flex justify-between items-start mb-2">
                  <div>
                     <p className="text-[10px] text-gray-300 font-medium">My UPI ID</p>
                     <p className="font-mono text-xs text-white/90 truncate w-32">{user.upiId || `${user.phoneNumber}@paradise`}</p>
                  </div>
                  <QrCode size={16} className="text-white/80" />
               </div>
               <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                 Active
               </div>
            </div>

            {/* Wallet Card */}
            <div className="flex-none w-28 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-3 text-white shadow-md flex flex-col justify-between" onClick={() => navigateUPI('HOME')}>
               <Wallet size={16} />
               <div>
                  <p className="text-[10px] opacity-90">Wallet</p>
                  <p className="font-bold text-sm">Activate</p>
               </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: NETWORK BUSINESS TOOLS --- */}
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-teal-700" />
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Network Business Tools</h2>
           </div>
           
           <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                 {coreTools.map(tool => (
                   <button key={tool.id} onClick={() => onNavigate(AppRoute.SECTION_DETAIL, { section: { ...tool, isCore: true } })} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-active:scale-95 transition-transform shadow-sm border border-teal-100">
                         {tool.icon}
                      </div>
                      <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{tool.name}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* --- SECTION 3: EXPLORE SERVICES (New 4x2 Grid) --- */}
        <div>
           <div className="flex items-center gap-2 mb-3">
              <LayoutGrid size={18} className="text-purple-600" />
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Explore Services</h2>
           </div>
           
           <div className="grid grid-cols-4 gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                 <button 
                   key={category.id} 
                   onClick={() => onNavigate(AppRoute.SERVICE_CATEGORY, { categoryData: category })}
                   className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                 >
                    <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center ${category.color}`}>
                       {getCategoryIcon(category.iconName, 24)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight h-8 flex items-center justify-center w-full">
                      {category.title}
                    </span>
                 </button>
              ))}
           </div>
        </div>

        {/* --- SECTION 4: QUICK COMMERCE (5 Toggles) --- */}
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-orange-600" />
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">QuickCommerce</h2>
           </div>
           
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {quickCommerce.map((item, idx) => (
                 <button 
                   key={idx} 
                   onClick={item.action}
                   className="flex-none w-24 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                 >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                       {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight h-6 flex items-center">{item.name}</span>
                 </button>
              ))}
           </div>
        </div>

        {/* --- SECTION 5: MY NETWORK CRM --- */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-2">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <Trophy size={18} className="text-amber-500" />
                 <h3 className="font-bold text-gray-900 text-sm">My Network CRM</h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold">Team Status</span>
           </div>
           
           <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-center px-2 border-r border-gray-200 w-1/2">
                 <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Directs</p>
                 <p className="font-bold text-gray-900 text-lg">{directMembersCount}</p>
              </div>
              <div className="text-center px-2 w-1/2">
                 <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Team</p>
                 <p className="font-bold text-gray-900 text-lg">{directMembersCount}</p>
              </div>
           </div>
           
           <Button onClick={() => onNavigate(AppRoute.CRM_DASHBOARD)} fullWidth variant="primary" className="bg-gray-900 hover:bg-black text-white shadow-none py-2 text-sm">
              Open Network CRM
           </Button>
        </div>

        {/* --- SECTION 6: RECHARGE & BILLS (Secondary) --- */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-2">
           <div className="flex justify-between items-center mb-3">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Recharge & Bills (Utilities)</p>
             <button className="text-[10px] text-teal-600 font-bold" onClick={() => alert("Coming soon")}>View All</button>
           </div>
           <div className="grid grid-cols-4 gap-y-4">
              {[
                { icon: <Smartphone size={18} />, label: "Mobile" },
                { icon: <Wifi size={18} />, label: "WiFi" },
                { icon: <Zap size={18} />, label: "Electric" },
                { icon: <Droplet size={18} />, label: "Water" },
                { icon: <Flame size={18} />, label: "Gas" },
                { icon: <CreditCard size={18} />, label: "Card" },
                { icon: <History size={18} />, label: "Loan" },
                { icon: <LayoutGrid size={18} />, label: "More" },
              ].map((item, idx) => (
                <button key={idx} className="flex flex-col items-center gap-1 group" onClick={() => alert("Coming soon")}>
                   <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      {item.icon}
                   </div>
                   <span className="text-[10px] text-gray-500 font-medium">{item.label}</span>
                </button>
              ))}
           </div>
        </div>

        <p className="text-center text-[10px] text-gray-300 py-4">
          Secured by Paradise Systems • Version 1.5
        </p>

      </main>
    </div>
  );
};
