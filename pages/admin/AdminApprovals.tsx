
import React, { useState, useEffect } from 'react';
import { AppRoute, PendingRegistration, User } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { getPendingRegistrations, removePendingRegistration, registerUser, generateUserId } from '../../services/storage';
import { Check, X, Clock } from 'lucide-react';

interface AdminApprovalsProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminApprovals: React.FC<AdminApprovalsProps> = ({ onNavigate }) => {
  const [pending, setPending] = useState<PendingRegistration[]>([]);

  useEffect(() => {
    setPending(getPendingRegistrations());
  }, []);

  const handleApprove = (reg: PendingRegistration) => {
    const newUser: User = {
      id: generateUserId(reg.name),
      name: reg.name,
      phoneNumber: reg.phoneNumber,
      sponsorId: reg.sponsorId,
      occupationCategory: reg.occupationCategory,
      occupationSubCategory: reg.occupationSubCategory,
      joinedAt: new Date().toISOString(),
      password: reg.password,
      directMembers: []
    };
    
    const result = registerUser(newUser);
    if(result.success) {
      alert("Registration Force Approved!");
      setPending(getPendingRegistrations()); // Refresh list
    } else {
      alert("Error: " + result.message);
    }
  };

  const handleReject = (phone: string) => {
    if(window.confirm("Reject this registration request?")) {
      removePendingRegistration(phone);
      setPending(getPendingRegistrations());
    }
  };

  return (
    <AdminLayout activeRoute={AppRoute.ADMIN_APPROVALS} onNavigate={onNavigate}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h1>

      {pending.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100">
           <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
           </div>
           <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
           <p className="text-gray-500">No pending registrations requiring OTP override.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sponsor ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pending.map((req, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 font-medium text-gray-900">{req.name}</td>
                  <td className="px-6 py-4 text-gray-500">{req.phoneNumber}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{req.sponsorId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1">
                     <Clock size={14} /> {new Date(req.submittedAt).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleApprove(req)}
                         className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold hover:bg-green-200 flex items-center gap-1"
                       >
                         <Check size={14} /> Force Approve
                       </button>
                       <button 
                         onClick={() => handleReject(req.phoneNumber)}
                         className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200 flex items-center gap-1"
                       >
                         <X size={14} /> Reject
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};
