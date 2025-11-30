import React from 'react';
import { AppRoute } from '../../types';
import { ArrowLeft, Building2, HardHat, Map, FileCheck, Key, Percent, Briefcase, Home, Calculator, PenTool, Scale, Construction, Eye, MapPin } from 'lucide-react';

interface AllRealEstateProps {
  onNavigate: (route: AppRoute) => void;
}

export const AllRealEstate: React.FC<AllRealEstateProps> = ({ onNavigate }) => {

  const handleServiceClick = (serviceName: string) => {
     if (serviceName === 'Site Visit Booking') {
        onNavigate(AppRoute.SITE_VISIT_BOOKING);
     } else {
        alert(`${serviceName} - This feature will be available soon.`);
     }
  };

  const homeServices = [
    { icon: <Map size={20} />, label: "Buy Residential Plot" },
    { icon: <Home size={20} />, label: "Buy Farm Land" },
    { icon: <Building2 size={20} />, label: "Buy Commercial Plot" },
    { icon: <Eye size={20} />, label: "Property Viewer" },
    { icon: <MapPin size={20} />, label: "Site Visit Booking" },
    { icon: <FileCheck size={20} />, label: "Property Verification" },
    { icon: <Key size={20} />, label: "Sell My Property" },
    { icon: <Percent size={20} />, label: "Real Estate Commission Plan" },
  ];

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
        <h1 className="text-xl font-bold text-gray-900">All Real Estate Services</h1>
      </div>

      <div className="p-4 space-y-8">
        
        {/* Home Screen Services */}
        <div>
           <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Core Services</h2>
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
                     {item.label}
                   </span>
                </button>
              ))}
           </div>
        </div>

        {/* More Services */}
        <div>
           <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Additional Services</h2>
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