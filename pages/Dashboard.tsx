
import React, { useState } from 'react';
import { User, AppRoute } from '../types';
import { logoutUser } from '../services/storage';
import { 
  LayoutGrid, Bell, QrCode, User as UserIcon,
  Landmark, Wallet, History, CreditCard,
  Zap, Droplet, Flame, Wifi, ChevronRight, Users, Trophy,
  Smartphone
} from 'lucide-react';
import { Button } from '../components/Button';
import { AppDrawer } from '../components/AppDrawer';

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

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <AppDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user} 
        onLogout={handleLogout}
        onNavigate={onNavigate}
      />

      {/* Modern Fintech Header */}
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
               {/* Location Placeholder */}
               <span className="text-[10px] text-teal-200 flex items-center gap-1">
                 Bangalore, India <ChevronRight size={10} />
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
        
        {/* Money Transfers Section - PhonePe Style */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
           <p className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wide">Transfer Money</p>
           <div className="grid grid-cols-4 gap-2">
              <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-2 group">
                 <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                   <UserIcon size={24} />
                 </div>
                 <span className="text-[10px] text-gray-700 font-medium text-center">To Mobile</span>
              </button>
              <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-2 group">
                 <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                   <Landmark size={24} />
                 </div>
                 <span className="text-[10px] text-gray-700 font-medium text-center">To Bank</span>
              </button>
              <button onClick={() => navigateUPI('HOME')} className="flex flex-col items-center gap-2 group">
                 <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                   <Wallet size={24} />
                 </div>
                 <span className="text-[10px] text-gray-700 font-medium text-center">To Self</span>
              </button>
              <button onClick={() => navigateUPI('HISTORY')} className="flex flex-col items-center gap-2 group">
                 <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform">
                   <History size={24} />
                 </div>
                 <span className="text-[10px] text-gray-700 font-medium text-center">History</span>
              </button>
           </div>
        </div>

        {/* UPI & Wallet Card */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* UPI Lite / ID Card */}
          <div className="flex-none w-64 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-white shadow-md relative overflow-hidden" onClick={() => navigateUPI('HOME')}>
             <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-xs text-gray-300 font-medium">My UPI ID</p>
                   <p className="font-mono text-sm">{user.upiId || `${user.phoneNumber}@paradise`}</p>
                </div>
                <QrCode size={20} className="text-white/80" />
             </div>
             <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
               Active
             </div>
          </div>

          {/* Wallet Card */}
          <div className="flex-none w-32 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-4 text-white shadow-md flex flex-col justify-between" onClick={() => navigateUPI('HOME')}>
             <Wallet size={20} />
             <div>
                <p className="text-[10px] opacity-90">Paradise Wallet</p>
                <p className="font-bold">Activate</p>
             </div>
          </div>
        </div>

        {/* Recharge & Pay Bills */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
           <div className="flex justify-between items-center mb-4">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recharge & Pay Bills</p>
             <button className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">View All</button>
           </div>
           <div className="grid grid-cols-4 gap-y-6">
              {[
                { icon: <Smartphone size={20} />, label: "Mobile" },
                { icon: <Wifi size={20} />, label: "Broadband" },
                { icon: <Zap size={20} />, label: "Electric" },
                { icon: <CreditCard size={20} />, label: "Credit Card" },
                { icon: <Droplet size={20} />, label: "Water" },
                { icon: <Flame size={20} />, label: "Gas" },
                { icon: <History size={20} />, label: "Loan" },
                { icon: <LayoutGrid size={20} />, label: "See All" },
              ].map((item, idx) => (
                <button key={idx} className="flex flex-col items-center gap-2">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 text-teal-600 flex items-center justify-center hover:bg-teal-50 transition-colors">
                      {item.icon}
                   </div>
                   <span className="text-[10px] text-gray-600 font-medium">{item.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Ad Banner Slider */}
        <div className="rounded-xl overflow-hidden shadow-sm relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center px-6">
           <div className="text-white z-10">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 inline-block">New</span>
              <h3 className="font-bold text-lg leading-tight mb-1">Refer & Earn</h3>
              <p className="text-xs opacity-90 mb-3">Invite friends to your network.</p>
              <button className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Invite Now</button>
           </div>
           <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
              <Users size={120} />
           </div>
        </div>

        {/* My Network Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                 <Trophy size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-gray-900 text-sm">My Network Status</h3>
                 <p className="text-xs text-gray-500">Growth & Members</p>
              </div>
           </div>
           
           <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
              <div className="text-center px-4 border-r border-gray-200 w-1/2">
                 <p className="text-xs text-gray-500 mb-1">Direct Members</p>
                 <p className="font-bold text-gray-900 text-lg">{user.directMembers?.length || 0} / 15</p>
              </div>
              <div className="text-center px-4 w-1/2">
                 <p className="text-xs text-gray-500 mb-1">Total Team</p>
                 <p className="font-bold text-gray-900 text-lg">{user.directMembers?.length || 0}</p>
              </div>
           </div>
        </div>

        {/* Explore All Button */}
        <Button 
          onClick={() => onNavigate(AppRoute.LAUNCHER)}
          fullWidth
          className="py-4 shadow-lg bg-gray-900 text-white hover:bg-black"
        >
          <LayoutGrid size={20} className="mr-2" />
          Explore All Services
        </Button>

        <p className="text-center text-xs text-gray-400 py-6">
          Secured by Paradise Systems • Version 1.3
        </p>

      </main>
    </div>
  );
};
