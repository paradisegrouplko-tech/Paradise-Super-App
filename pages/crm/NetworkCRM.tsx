import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../../types';
import { getUserById } from '../../services/storage';
import { ArrowLeft, Search, Filter, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../../services/language';

interface NetworkCRMProps {
  user: User;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const NetworkCRM: React.FC<NetworkCRMProps> = ({ user, onNavigate }) => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [todaysFollowUps, setTodaysFollowUps] = useState<User[]>([]);

  useEffect(() => {
    if (user.directMembers) {
      const fetchedMembers = user.directMembers
        .map(id => getUserById(id))
        .filter((u): u is User => !!u);
      
      setMembers(fetchedMembers);
      setFilteredMembers(fetchedMembers);

      const todayStr = new Date().toISOString().split('T')[0];
      const followUps = fetchedMembers.filter(m => {
        const crm = user.crmData?.[m.id];
        return crm?.nextFollowUpDate === todayStr;
      });
      setTodaysFollowUps(followUps);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredMembers(members.filter(m => m.name.toLowerCase().includes(term) || m.id.toLowerCase().includes(term)));
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{t('MY_NETWORK_CRM')}</h1>
          <p className="text-xs text-gray-500">{members.length} {t('DIRECTS')}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-md">
           <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} className="text-indigo-100" />
              <h2 className="font-bold text-sm uppercase tracking-wide">{t('TODAYS_FOLLOW_UPS')}</h2>
           </div>
           
           {todaysFollowUps.length > 0 ? (
             <div className="space-y-2">
               {todaysFollowUps.map(m => (
                 <div key={m.id} onClick={() => onNavigate(AppRoute.CRM_MEMBER_DETAIL, { memberId: m.id })} className="bg-white/10 p-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/20">
                    <span className="font-medium text-sm">{m.name}</span>
                    <span className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded font-bold">Open</span>
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-sm text-indigo-100 italic">{t('NO_FOLLOW_UPS')}</p>
           )}
        </div>

        <div className="relative">
           <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
           <input 
             type="text" 
             placeholder={t('SEARCH_PLACEHOLDER')}
             className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="space-y-3">
           {filteredMembers.map(member => (
             <div 
               key={member.id} 
               onClick={() => onNavigate(AppRoute.CRM_MEMBER_DETAIL, { memberId: member.id })}
               className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                      {member.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{member.name}</h3>
                      <p className="text-xs text-gray-500 font-mono mb-1">{member.id}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};