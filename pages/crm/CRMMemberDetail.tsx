
import React, { useState, useEffect } from 'react';
import { AppRoute, User, MemberStatus } from '../../types';
import { getUserById, updateMemberCRM, getCurrentSession } from '../../services/storage';
import { ArrowLeft, Phone, Calendar, Save, User as UserIcon, Briefcase } from 'lucide-react';
import { Button } from '../../components/Button';

interface CRMMemberDetailProps {
  onNavigate: (route: AppRoute) => void;
  memberId?: string;
}

export const CRMMemberDetail: React.FC<CRMMemberDetailProps> = ({ onNavigate, memberId }) => {
  const [member, setMember] = useState<User | null>(null);
  const [sponsor, setSponsor] = useState<User | null>(null);
  
  // CRM Form State
  const [status, setStatus] = useState<MemberStatus>('New');
  const [lastContact, setLastContact] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const currentSponsor = getCurrentSession();
    if (currentSponsor) {
      setSponsor(currentSponsor);
      
      if (memberId) {
        const mem = getUserById(memberId);
        setMember(mem || null);

        // Load existing CRM data
        const crmData = currentSponsor.crmData?.[memberId];
        if (crmData) {
           setStatus(crmData.status || 'New');
           setLastContact(crmData.lastContactDate || '');
           setNextFollowUp(crmData.nextFollowUpDate || '');
           setNotes(crmData.notes || '');
        }
      }
    }
  }, [memberId]);

  const handleSave = () => {
    if (sponsor && memberId) {
      updateMemberCRM(sponsor.id, memberId, {
        status,
        lastContactDate: lastContact,
        nextFollowUpDate: nextFollowUp,
        notes
      });
      alert("Notes updated successfully.");
      // In a real app, we might want to refresh the sponsor object here
    }
  };

  if (!member) return <div className="p-8 text-center text-gray-500">Member not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => onNavigate(AppRoute.CRM_DASHBOARD)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Member Detail</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-2xl font-bold mb-4">
              {member.name.charAt(0)}
           </div>
           <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
           <p className="text-gray-500 text-sm mb-4 font-mono">{member.id}</p>
           
           <div className="w-full grid grid-cols-2 gap-4 text-left mt-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Phone</p>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone size={14} className="text-gray-400" /> {member.phoneNumber}
                 </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Joined</p>
                 <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar size={14} className="text-gray-400" /> {new Date(member.joinedAt).toLocaleDateString()}
                 </div>
              </div>
           </div>

           <div className="w-full mt-4 bg-gray-50 p-3 rounded-lg text-left">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Occupation</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                 <Briefcase size={14} className="text-gray-400" />
                 <span className="truncate">{member.occupationSubCategory}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 pl-6">{member.occupationCategory}</p>
           </div>
        </div>

        {/* CRM Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-6 text-gray-800">
              <UserIcon size={20} className="text-indigo-600" />
              <h3 className="font-bold text-lg">Follow-Up & Notes</h3>
           </div>

           <div className="space-y-4">
              {/* Status Dropdown */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Member Status</label>
                 <select 
                   className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                   value={status}
                   onChange={(e) => setStatus(e.target.value as MemberStatus)}
                 >
                    <option value="New">New</option>
                    <option value="Active">Active</option>
                    <option value="Needs Training">Needs Training</option>
                    <option value="Not Responding">Not Responding</option>
                    <option value="Prospect for Real Estate">Prospect for Real Estate</option>
                 </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Contact</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                      value={lastContact}
                      onChange={(e) => setLastContact(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Next Follow-Up</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                    />
                 </div>
              </div>

              {/* Notes */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                 <textarea 
                   rows={4}
                   className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                   placeholder="Enter notes about this member (e.g. Interested in new projects, needs call back...)"
                   value={notes}
                   onChange={(e) => setNotes(e.target.value)}
                 />
              </div>

              <Button onClick={handleSave} fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white">
                 <Save size={18} />
                 Save Notes
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};
