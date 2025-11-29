
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { getUserById, adminBlockUser, adminResetPassword, adminChangeSponsor } from '../../services/storage';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ArrowLeft, Ban, CheckCircle, Lock, Network, Edit } from 'lucide-react';

interface AdminUserDetailProps {
  onNavigate: (route: AppRoute, params?: any) => void;
  userId?: string;
}

export const AdminUserDetail: React.FC<AdminUserDetailProps> = ({ onNavigate, userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sponsorOverrideId, setSponsorOverrideId] = useState('');
  const [isEditingSponsor, setIsEditingSponsor] = useState(false);
  
  useEffect(() => {
    if (userId) {
      const u = getUserById(userId);
      setUser(u || null);
    }
  }, [userId]);

  if (!user) {
    return (
      <AdminLayout activeRoute={AppRoute.ADMIN_USERS} onNavigate={onNavigate}>
        <div>User not found</div>
      </AdminLayout>
    );
  }

  const handleBlockToggle = () => {
    adminBlockUser(user.id, !user.isBlocked);
    // Refresh
    const u = getUserById(user.id);
    setUser(u || null);
  };

  const handleResetPassword = () => {
    if(window.confirm("Are you sure you want to reset password to '123456'?")) {
      adminResetPassword(user.id);
    }
  };

  const handleChangeSponsor = () => {
    if (!sponsorOverrideId) return;
    const result = adminChangeSponsor(user.id, sponsorOverrideId);
    if (result.success) {
      alert("Sponsor updated successfully!");
      setIsEditingSponsor(false);
      // Refresh
      const u = getUserById(user.id);
      setUser(u || null);
    } else {
      alert("Error: " + result.message);
    }
  };

  return (
    <AdminLayout activeRoute={AppRoute.ADMIN_USER_DETAIL} onNavigate={onNavigate}>
      <button 
        onClick={() => onNavigate(AppRoute.ADMIN_USERS)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} /> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                 <p className="text-gray-500">ID: <span className="font-mono text-gray-700">{user.id}</span></p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {user.isBlocked ? 'Blocked' : 'Active'}
              </span>
           </div>

           <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Phone Number</p>
                <p className="text-gray-900 font-medium">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Joined Date</p>
                <p className="text-gray-900 font-medium">{new Date(user.joinedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Occupation</p>
                <p className="text-gray-900 font-medium">{user.occupationCategory}</p>
                <p className="text-sm text-gray-500">{user.occupationSubCategory}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Current Sponsor</p>
                <p className="text-gray-900 font-medium font-mono">{user.sponsorId || 'None'}</p>
              </div>
           </div>

           {/* Admin Actions */}
           <div className="mt-8 pt-8 border-t border-gray-100">
             <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">Admin Controls</h3>
             <div className="flex flex-wrap gap-4">
               <Button 
                 variant={user.isBlocked ? 'primary' : 'outline'} 
                 className={user.isBlocked ? 'bg-green-600 hover:bg-green-700 border-none' : 'border-red-200 text-red-600 hover:bg-red-50'}
                 onClick={handleBlockToggle}
               >
                 {user.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                 {user.isBlocked ? 'Unblock User' : 'Block User'}
               </Button>
               
               <Button variant="outline" onClick={handleResetPassword}>
                 <Lock size={18} />
                 Reset Password
               </Button>
             </div>
             
             {/* Sponsor Override */}
             <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                   <p className="font-bold text-gray-700 text-sm">Correct Sponsor Placement</p>
                   {!isEditingSponsor && (
                     <button onClick={() => setIsEditingSponsor(true)} className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                   )}
                </div>
                {isEditingSponsor ? (
                  <div className="flex gap-2">
                    <Input 
                       label="" 
                       placeholder="New Sponsor ID" 
                       value={sponsorOverrideId} 
                       onChange={(e) => setSponsorOverrideId(e.target.value)}
                       className="mb-0 text-sm"
                    />
                    <Button onClick={handleChangeSponsor} className="h-[42px]">Update</Button>
                    <Button variant="ghost" onClick={() => setIsEditingSponsor(false)} className="h-[42px]">Cancel</Button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Current Sponsor ID: <span className="font-mono text-gray-900">{user.sponsorId}</span>
                  </p>
                )}
             </div>
           </div>
        </div>

        {/* Network Map / Downline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Network size={20} />
              <h3 className="font-bold text-gray-900">Direct Members Map</h3>
           </div>
           
           <div className="text-center mb-6">
              <div className="inline-block px-4 py-2 bg-slate-800 text-white rounded-lg font-mono text-sm mb-2 shadow-sm">
                {user.id} (YOU)
              </div>
              <div className="w-0.5 h-6 bg-gray-300 mx-auto"></div>
              <div className="text-xs text-gray-400 font-medium bg-gray-100 inline-block px-2 rounded">
                 {user.directMembers.length} / 15 Directs
              </div>
           </div>

           <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
             {user.directMembers.map(memberId => {
               const member = getUserById(memberId);
               return (
                 <button 
                    key={memberId}
                    onClick={() => onNavigate(AppRoute.ADMIN_USER_DETAIL, { userId: memberId })}
                    className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg text-left transition-colors group"
                 >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-gray-800">{member?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 font-mono">{memberId}</p>
                      </div>
                      <Edit size={14} className="opacity-0 group-hover:opacity-100 text-blue-500" />
                    </div>
                 </button>
               )
             })}
             {user.directMembers.length === 0 && (
               <p className="text-center text-sm text-gray-400 py-4 italic">No direct members yet.</p>
             )}
           </div>
        </div>

      </div>
    </AdminLayout>
  );
};
