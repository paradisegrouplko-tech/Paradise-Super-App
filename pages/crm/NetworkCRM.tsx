
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../../types';
import { getUserById } from '../../services/storage';
import { ArrowLeft, Search, Filter, Calendar, Users, Phone } from 'lucide-react';
import { Button } from '../../components/Button';

interface NetworkCRMProps {
  user: User;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export const NetworkCRM: React.FC<NetworkCRMProps> = ({ user, onNavigate }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
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
    } else {
      setMembers([]);
      setFilteredMembers([]);
      setTodaysFollowUps([]);
    }

  }, [user]);

  useEffect(() => {
    let result = members;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(term) || 
        m.id.toLowerCase().includes(term)
      );
    }

    if (activeFilter !== 'All') {
      if (activeFilter === 'Teachers') result = result.filter(m => m.occupationCategory.includes('Teachers'));
      else if (activeFilter === 'Defense') result = result.filter(m => m.occupationCategory.includes('Defense'));
      else if (activeFilter === 'Business') result = result.filter(m => m.occupationCategory.includes('Business'));
      else if (activeFilter === 'Workers') result = result.filter(m => m.occupationCategory.includes('Workers'));
    }

    setFilteredMembers(result);
  }, [searchTerm, activeFilter, members]);

  const getStatusColor = (memberId: string) => {
    const status = user.crmData?.[memberId]?.status || 'New';
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Needs Training': return 'bg-yellow-100 text-yellow-700';
      case 'Not Responding': return 'bg-red-100 text-red-700';
      case 'Prospect for Real Estate': return 'bg-purple-100 text-purple-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

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
          <h1 className="text-xl font-bold text-gray-900">My Network CRM</h1>
          <p className="text-xs text-gray-500">{members.length} Direct Members</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-md">
           <div className="flex items-center gap-2 mb-3">
              <Calendar size={20} className="text-indigo-100" />
              <h2 className="font-bold text-sm uppercase tracking-wide">Today's Follow-Ups</h2>
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
             <p className="text-sm text-indigo-100 italic">No follow-ups scheduled for today.</p>
           )}
        </div>

        <div className="space-y-3">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search by name or ID" 
               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Teachers', 'Defense', 'Business', 'Workers'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter 
                      ? 'bg-gray-800 text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
           </div>
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
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(member.id)}`}>
                        {user.crmData?.[member.id]?.status || 'New'}
                      </span>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-400">Joined</p>
                   <p className="text-xs text-gray-600 font-medium">{new Date(member.joinedAt).toLocaleDateString()}</p>
                </div>
             </div>
           ))}

           {filteredMembers.length === 0 && (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Users size={32} />
               </div>
               <p className="text-gray-500 text-sm">No members found.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
