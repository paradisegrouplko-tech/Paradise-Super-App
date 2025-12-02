import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';

interface PremiumBadgeProps {
  plan?: 'Basic' | 'Plus' | 'Premium';
  size?: number;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ plan, size = 16 }) => {
  if (plan === 'Premium') {
    return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
        <Star size={size} fill="currentColor" className="text-white" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Gold</span>
      </div>
    );
  }
  
  if (plan === 'Plus') {
    return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
        <ShieldCheck size={size} className="text-slate-600" />
        <span className="text-[10px] font-bold uppercase tracking-wide">Plus</span>
      </div>
    );
  }

  return null; // No badge for Basic
};