import React, { useState } from 'react';
import { User, AppRoute } from '../types';
import { logoutUser, getUserAdStatus } from '../services/database';
import { 
  Bell, QrCode, User as UserIcon, Landmark, Wallet, History,
  Users, Trophy, Network, UserPlus, ShieldCheck, Banknote, Star,
  LayoutGrid, Zap, ShoppingBag, Heart, Plane, MonitorPlay, TrendingUp, Sun, GraduationCap,
  Building2, Key, FileCheck, Percent, Map, Home, Eye, MapPin, ArrowRight,
  ShoppingCart, Package, Pill, Car, Globe, BookOpen, HelpCircle,
  Clock, Pin
} from 'lucide-react';
import { Button } from '../components/Button';
import { AppDrawer } from '../components/AppDrawer';
import { SERVICE_CATEGORIES } from '../constants';
import { useLanguage } from '../services/language';
import { LanguageToggle } from '../components/LanguageToggle';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = useLanguage();
  
  // Ad Logic
  const showAds = getUserAdStatus(user.user_id);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const navigateUPI = (view: string) => {
    onNavigate(AppRoute.UPI_CENTER, { view });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  // Defensive check
  const directMembersCount = (user.direct_members || []).length;

  const coreTools = [
    { id: 1, name: "NETWORK_BUILDER", icon: <Network size={20} /> },
    { id: 2, name: "REFERRAL", icon: <UserPlus size={20} /> },
    { id: 3, name: "TEAM_MANAGER", icon: <Users size={20} /> },
    { id: 4, name: "ID_REGISTRATION", icon: <ShieldCheck size={20} /> },
    { id: 5, name: "SPONSOR_APPROVAL", icon: <ShieldCheck size={20} /> },
    { id: 6, name: "EARNINGS", icon: <Banknote size={20} /> },
    { id: 7, name: "WALLET", icon: <Wallet size={20} /> },
    { id: 8, name: "RANKS", icon: <Star size={20} /> }, 
  ];

  const quickCommerce = [
    { name: "QUICK_GROCERY", icon: <ShoppingCart size={20} />, action: () => alert(t('ALERTS_COMING_SOON')), color: "bg-green-100 text-green-600" },
    { name: "QUICK_ESSENTIALS", icon: <Package size={20} />, action: () => alert(t('ALERTS_COMING_SOON')), color: "bg-orange-100 text-orange-600" },
    { name: "QUICK_PHARMACY", icon: <Pill size={20} />, action: () => alert(t('ALERTS_COMING_SOON')), color: "bg-rose-100 text-rose-600" },
    { name: "TAXI_CAR", icon: <Car size={20} />, action: () => alert(t('ALERTS_COMING_SOON')), color: "bg-blue-100 text-blue-600" },
    { name: "ENTERTAINMENT", icon: <MonitorPlay size={20} />, action: () => alert(t('ALERTS_COMING_SOON')), color: "bg-purple-100 text-purple-600" },
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
    { icon: <Map size={20} />, label: "BUY_RES_PLOT" },
    { icon: <Home size={20} />, label: "BUY_FARM_LAND" },
    { icon: <Building2 size={20} />, label: "BUY_COMM_PLOT" },
    { icon: <LayoutGrid size={20} />, label: "PROPERTY_VIEWER" },
    { icon: <MapPin size={20} />, label: "SITE_VISIT", action: () => onNavigate(AppRoute.SITE_VISIT_BOOKING) },
    { icon: <FileCheck size={20} />, label: "VERIFICATION" },
    { icon: <Key size={20} />, label: "SELL_PROPERTY" },
    { icon: <Percent size={20} />, label: "COMMISSION_PLAN" },
  ];
  
  const getCategoryTitleKey = (id: string): string => {
    switch(id) {
      case 'payments': return 'CAT_PAYMENTS';
      case 'quick_commerce': return 'CAT_QUICK_COMMERCE';
      case 'health': return 'CAT_HEALTH';
      case 'travel': return 'CAT_TRAVEL';
      case 'entertainment': return 'CAT_ENTERTAINMENT';
      case 'finance': return 'CAT_FINANCE';
      case 'spirituality': return 'CAT_SPIRITUALITY';
      case 'learning': return 'CAT_LEARNING';
      case 'digital_services': return 'CAT_DIGITAL';
      case 'education_training': return 'CAT_EDUCATION';
      case 'home_services': return 'CAT_HOME';
      case 'support': return 'CAT_SUPPORT';
      default: return id;
    }
  };
  
  // Safe Translation Helper
  const getTranslatedTitle = (id: string, defaultTitle: string) => {
      const key = getCategoryTitleKey(id);
      // Ensure t() is called and we handle potential non-string returns safely (though t returns string)
      const translated = t(key as any);
      if (translated && typeof translated === 'string') {
          return translated.split(' ')[0];
      }
      // Fallback to default title split
      return (defaultTitle || "").split(' ')[0];
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

      <header className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsDrawerOpen(true)} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-bold shadow-sm">
               {initial}
             </button>
             <div className="flex flex-col">
               <span className="text-xs font-semibold text-teal-100 opacity-90">{t('WELCOME_BACK')}</span>
               <span className="text-sm font-bold leading-tight">{firstName}</span>
               <span className="text-[10px] text-teal-200 flex items-center gap-1">
                 {t('BANGALORE_INDIA')}
               </span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <LanguageToggle />
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                <Bell size={22} />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-6">
        
        {/* --- AD BANNER (Server Controlled) --- */}
        {showAds && (
          <div className="w-full h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-between px-4 text-white shadow-sm animate-fadeIn">
             <div>
                <p className="text-xs font-bold uppercase bg-white/20 inline-block px-2 py-0.5 rounded mb-1">Ad</p>
                <p className="text-sm font-bold">Upgrade to Paradise Plus</p>
                <p className="text-[10px] opacity-90">Remove ads for just $1/mo</p>
             </div>
             <button 
               onClick={() => onNavigate(AppRoute.PREMIUM_ACCESS)}
               className="bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg"
             >
               Upgrade
             </button>
          </div>
        )}

        {/* UPI + WALLET */}
        <div>
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wide">{t('TRANSFER_MONEY')}</p>
             <div className="grid grid-cols-5 gap-2 text-center">
                <button onClick={() => navigateUPI('SCAN')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform border border-indigo-100"><QrCode size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">{t('QUICK_PAY')}</span></button>
                <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><UserIcon size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">{t('TO_MOBILE')}</span></button>
                <button onClick={() => navigateUPI('SEND')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><Landmark size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">{t('TO_BANK')}</span></button>
                <button onClick={() => navigateUPI('HOME')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><Wallet size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">{t('TO_SELF')}</span></button>
                <button onClick={() => navigateUPI('HISTORY')} className="flex flex-col items-center gap-1 group"><div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-active:scale-95 transition-transform"><History size={20} /></div><span className="text-[10px] text-gray-700 font-medium whitespace-nowrap">{t('HISTORY')}</span></button>
             </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {/* UPI ID Card */}
            <div className="flex-none w-56 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-3 text-white shadow-md relative overflow-hidden" onClick={() => navigateUPI('HOME')}>
               <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
               <div className="flex justify-between items-start mb-2">
                  <div><p className="text-[10px] text-gray-300 font-medium">{t('MY_UPI_ID')}</p><p className="font-mono text-xs text-white/90 truncate w-32">{user.upiId || `${user.mobile_number}@paradise`}</p></div>
                  <QrCode size={16} className="text-white/80" />
               </div>
               <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>{t('ACTIVE')}</div>
            </div>

            {/* Wallet Card */}
            <div className="flex-none w-28 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-3 text-white shadow-md flex flex-col justify-between" onClick={() => navigateUPI('HOME')}>
               <Wallet size={16} />
               <div><p className="text-[10px] opacity-90">{t('WALLET')}</p><p className="font-bold text-sm">{t('ACTIVATE')}</p></div>
            </div>
          </div>
        </div>

        {/* NETWORK TOOLS */}
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-teal-700" />
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{t('NETWORK_BUSINESS_TOOLS')}</h2>
           </div>
           
           <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                 {coreTools.map(tool => (
                   <button key={tool.id} onClick={() => onNavigate(AppRoute.SECTION_DETAIL, { section: { ...tool, isCore: true } })} className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-active:scale-95 transition-transform shadow-sm border border-teal-100">
                         {tool.icon}
                      </div>
                      <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{t(tool.name as any)}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* EXPLORE SERVICES (12 ICONS 4x3 Grid) */}
        <div>
           <div className="flex items-center gap-2 mb-3">
              <LayoutGrid size={18} className="text-purple-600" />
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{t('EXPLORE_SERVICES')}</h2>
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
                      {getTranslatedTitle(category.id, category.title)}
                    </span>
                 </button>
              ))}
           </div>
        </div>

        {/* QUICK COMMERCE */}
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-orange-600" />
              <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{t('QUICK_COMMERCE')}</h2>
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
                    <span className="text-[10px] font-bold text-gray-700 text-center leading-tight h-6 flex items-center justify-center w-full">
                      {t(item.name as any)}
                   </span>
                 </button>
              ))}
           </div>
        </div>

        {/* CRM */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-2">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <Trophy size={18} className="text-amber-500" />
                 <h3 className="font-bold text-gray-900 text-sm">{t('MY_NETWORK_CRM')}</h3>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold">{t('TEAM_STATUS')}</span>
           </div>
           
           <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-center px-2 border-r border-gray-200 w-1/2">
                 <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t('DIRECTS')}</p>
                 <p className="font-bold text-gray-900 text-lg">{directMembersCount}</p>
              </div>
              <div className="text-center px-2 w-1/2">
                 <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{t('TOTAL_TEAM')}</p>
                 <p className="font-bold text-gray-900 text-lg">{directMembersCount}</p>
              </div>
           </div>
           
           <Button onClick={() => onNavigate(AppRoute.CRM_DASHBOARD)} fullWidth variant="primary" className="bg-gray-900 hover:bg-black text-white shadow-none py-2 text-sm">
              {t('OPEN_NETWORK_CRM')}
           </Button>
        </div>

        {/* REAL ESTATE SERVICES */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-2 border-t-4 border-orange-500">
           <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
                <Building2 size={18} className="text-orange-600" />
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">{t('REAL_ESTATE_SERVICES')}</p>
             </div>
             <button className="text-[10px] text-teal-600 font-bold" onClick={() => onNavigate(AppRoute.ALL_REAL_ESTATE)}>{t('VIEW_ALL')}</button>
           </div>
           <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {realEstateServices.map((item, idx) => (
                <button 
                   key={idx} 
                   className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                   onClick={item.action ? item.action : () => alert(t('ALERTS_COMING_SOON'))}
                >
                   <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors shadow-sm border border-orange-100">
                      {item.icon}
                   </div>
                   <span className="text-[10px] text-gray-600 font-medium text-center leading-tight h-6 flex items-center justify-center w-full">
                      {t(item.label as any)}
                   </span>
                </button>
              ))}
           </div>
           
           <button 
              onClick={() => onNavigate(AppRoute.ALL_REAL_ESTATE)}
              className="w-full mt-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-1"
           >
              {t('VIEW_ALL_REAL_ESTATE')} <ArrowRight size={14} />
           </button>
        </div>

        <p className="text-center text-[10px] text-gray-300 py-4">
          {t('SECURED_BY')}
        </p>

      </main>
    </div>
  );
};