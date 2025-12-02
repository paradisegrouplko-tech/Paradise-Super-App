import React from 'react';
import { AppRoute } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { getNetworkStats } from '../../services/storage'; // Note: In real imp, import ledger read function
import { Activity, DollarSign, FileText } from 'lucide-react';

interface AdminStatsProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ onNavigate }) => {
  const stats = getNetworkStats();

  return (
    <AdminLayout activeRoute={AppRoute.ADMIN_STATS} onNavigate={onNavigate}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Network Statistics</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Global Network Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
           <div className="p-4">
              <p className="text-3xl font-bold text-blue-600 mb-1">{stats.totalSponsors || 0}</p>
              <p className="text-sm text-gray-500">Active Recruiters</p>
           </div>
           <div className="p-4 border-l border-r border-gray-100">
              <p className="text-3xl font-bold text-purple-600 mb-1">{stats.avgDirects || 0}</p>
              <p className="text-sm text-gray-500">Avg Directs per Sponsor</p>
           </div>
           <div className="p-4">
              <p className="text-3xl font-bold text-green-600 mb-1">{stats.totalUsers || 0}</p>
              <p className="text-sm text-gray-500">Total Users</p>
           </div>
        </div>
      </div>

      {/* New Ledger Preview Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
         <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Recent Transactions (Ledger)</h2>
         </div>
         <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            No transactions recorded yet.<br/>
            Commission engine is active and ready.
         </div>
      </div>
    </AdminLayout>
  );
};