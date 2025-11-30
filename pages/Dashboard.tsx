import React, { useState } from 'react';
import { User, AppRoute } from '../types';
import { logoutUser } from '../services/storage';
import { 
  Bell, QrCode, User as UserIcon,
  Landmark, Wallet, History,
  Users, Trophy, Network, UserPlus, ShieldCheck, Banknote, Star,
  LayoutGrid, Zap, ShoppingBag, Heart, Plane, MonitorPlay, TrendingUp, Sun, GraduationCap,
  Building2, Key, FileCheck, Percent, Map, Home, Eye, MapPin, ArrowRight,
  Clock, Pin, Smartphone, Globe, BookOpen, HelpCircle
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

  const navigateUPI = (view: string) => {
    onNavigate(AppRoute.UPI_CENTER, { view });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
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
      case 'Globe': return <Globe size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Home': return <Home size={size} />;
      case 'HelpCircle': return <HelpCircle size={size} />;
      default: return <Wallet size={size} />;
    }
  };

  const realEstateServices = [
    { icon: <Map size={20} />, label: "Buy Res. Plot" },
    { icon: <Home size={20} />, label: "Buy Farm Land" },
    { icon: <Building2 size={20} />, label: "Buy Comm. Plot" },
    { icon: <LayoutGrid size={20} />, label: "Property Viewer" },
    { icon: <MapPin size={20} />, label: "Site Visit", action: () => onNavigate(AppRoute.SITE_VISIT_BOOKING) },
    { icon: <FileCheck size={20} />, label: "Verification" },
    { icon: <Key size={20} />, label: "Sell Property" },
    { icon: <Percent size={20} />, label: "Commission Plan" },
  ];

  // Recently Used Mock
  const defaultRecent = [
    { name: "Mobile Recharge", icon: <Smartphone size={20} /> },
    { name: "Quick Grocery", icon: <ShoppingBag size={20} /> },
    { name: "Taxi & Auto", icon: <Plane size={20} /> },
    { name: "Online Courses", icon: <GraduationCap size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <AppDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user} 
        onLogout={handleLogout}
        onNavigate={onNavigate}
      />

      <header className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsDrawerOpen(true)} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-bold shadow-sm">
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
             <button onClick={() => navigateUPI('SCAN')} className="p-2 hover:bg-white/10 rounded-full transition-colors"><QrCode size={22} /></button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative"><Bell size={22} /><span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span></button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-6">
        
        {/* UPI + WALLET */}
        <div>
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wide">Transfer Money</p>
             <div className="grid grid-cols-5 gap-2 text-center">
                <button onClick={() => navigateUPI('SCAN')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform border border-indigo-100"><QrCode size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">Quick Pay</span></button>
                <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><UserIcon size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">To Mobile</span></button>
                <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><Landmark size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">To Bank</span></button>
                <button onClick={() => navigateUPI('HOME')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><Wallet size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">To Self</span></button>
                <button onClick={() => navigateUPI('HISTORY')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><History size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">History</span></button>
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

        {/* NETWORK TOOLS */}
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

        {/* EXPLORE SERVICES (12 ICONS 4x3 Grid) */}
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
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight h-8 flex items-center justify-center w-full overflow-hidden">
                      {category.title.split(' ')[0]} {/* Shortened label for grid fitting */}
                    </span>
                 </button>
              ))}
           </div>
        </div>

        {/* RECENTLY USED (Using Mock for V1) */}
        <div>
           <div className="flex items-center gap-2 mb-3"><Clock size={18} className="text-blue-600" /><h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Recently Used</h2></div>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {defaultRecent.map((item, idx) => (
                 <button key={idx} onClick={() => alert(`${item.name} - Coming Soon`)} className="flex-none w-24 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform relative group">
                    <div className={`absolute top-1 right-1 p-1 rounded-full text-gray-300 hover:text-gray-500`}>
                       <Pin size={10} />
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-600`}>
                       {item.icon}
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight h-6 flex items-center justify-center w-full overflow-hidden">{item.name}</span>
                 </button>
              ))}
           </div>
        </div>

        {/* CRM */}
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

        {/* REAL ESTATE SERVICES */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-2 border-t-4 border-orange-500">
           <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                <Building2 size={18} className="text-orange-600" />
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Real Estate Services</p>
             </div>
             <button className="text-[10px] text-teal-600 font-bold" onClick={() => onNavigate(AppRoute.ALL_REAL_ESTATE)}>View All</button>
           </div>
           <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {realEstateServices.map((item, idx) => (
                <button 
                   key={idx} 
                   className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                   onClick={item.action ? item.action : () => alert(`${item.label} - Coming Soon`)}
                >
                   <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors shadow-sm border border-orange-100">
                      {item.icon}
                   </div>
                   <span className="text-[10px] text-gray-600 font-medium text-center leading-tight h-6 flex items-center justify-center w-full">
                      {item.label}
                   </span>
                </button>
              ))}
           </div>
           
           <button 
              onClick={() => onNavigate(AppRoute.ALL_REAL_ESTATE)}
              className="w-full mt-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-1"
           >
              View All Real Estate Services <ArrowRight size={14} />
           </button>
        </div>

        <p className="text-center text-[10px] text-gray-300 py-4">
          Secured by Paradise Systems • Version 2.3
        </p>

      </main>
    </div>
  );
};