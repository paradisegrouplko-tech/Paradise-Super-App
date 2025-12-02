import React from 'react';
import { AppRoute } from '../../types';
import { ArrowLeft, Building2, Map, FileCheck, Key, Percent, Home, Calculator, PenTool, Scale, Construction, Eye, MapPin } from 'lucide-react';
import { useLanguage } from '../../services/language';

interface AllRealEstateProps {
  onNavigate: (route: AppRoute) => void;
}

export const AllRealEstate: React.FC<AllRealEstateProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  
  const handleServiceClick = (serviceName: string) => {
     if (serviceName === 'SITE_VISIT') {
        onNavigate(AppRoute.SITE_VISIT_BOOKING);
     } else {
        alert(`${t('FEATURE_UNAVAILABLE')}`);
     }
  };

  const homeServices = [
    { icon: <Map size={20} />, label: "BUY_RES_PLOT" },
    { icon: <Home size={20} />, label: "BUY_FARM_LAND" },
    { icon: <Building2 size={20} />, label: "BUY_COMM_PLOT" },
    { icon: <Eye size={20} />, label: "PROPERTY_VIEWER" },
    { icon: <MapPin size={20} />, label: "SITE_VISIT" },
    { icon: <FileCheck size={20} />, label: "VERIFICATION" },
    { icon: <Key size={20} />, label: "SELL_PROPERTY" },
    { icon: <Percent size={20} />, label: "COMMISSION_PLAN" },
  ];

  // Keeping others as text for now, or map to keys if needed
  const moreServices = [
    { icon: <Building2 size={20} />, label: "Buy Apartment / Flat" },
    { icon: <Home size={20} />, label: "Buy Villa / Luxury Property" },
    { icon: <Percent size={20} />, label: "Real Estate Loan Assistance" },
    { icon: <FileCheck size={20} />, label: "Property Registration Help" },
    { icon: <Map size={20} />, label: "Plot Layout Map" },
    { icon: <FileCheck size={20} />, label: "Document Support" },
    { icon: <Calculator size={20} />, label: "Property Valuation" },
    { icon: <Construction size={20} />, label: "Construction Services" },
    { icon: <Map size={20} />, label: "Land Conversion Support" },
    { icon: <Scale size={20} />, label: "Legal Advisory" },
    { icon: <Calculator size={20} />, label: "EMI Calculator" },
    { icon: <PenTool size={20} />, label: "Interior & Architecture" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">{t('ALL_REAL_ESTATE')}</h1>
      </div>

      <div className="p-4 space-y-8">
        
        <div>
           <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">{t('CORE_SERVICES')}</h2>
           <div className="grid grid-cols-4 gap-3">
              {homeServices.map((item, idx) => (
                <button 
                   key={idx} 
                   className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                   onClick={() => handleServiceClick(item.label)}
                >
                   <div className="w-14 h-14 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors shadow-sm">
                      {item.icon}
                   </div>
                   <span className="text-[10px] font-medium text-gray-600 text-center leading-tight h-8 flex items-center justify-center w-full">
                     {t(item.label as any) !== item.label ? t(item.label as any) : item.label}
                   </span>
                </button>
              ))}
           </div>
        </div>

        <div>
           <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">{t('ADDITIONAL_SERVICES')}</h2>
           <div className="grid grid-cols-4 gap-3">
              {moreServices.map((item, idx) => (
                <button 
                   key={idx} 
                   className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                   onClick={() => handleServiceClick(item.label)}
                >
                   <div className="w-14 h-14 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-teal-200 group-hover:text-teal-600 transition-colors shadow-sm">
                      {item.icon}
                   </div>
                   <span className="text-[10px] font-medium text-gray-600 text-center leading-tight h-8 flex items-center justify-center w-full">
                     {item.label}
                   </span>
                </button>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};