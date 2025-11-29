
import React from 'react';
import { AppRoute } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { getNetworkStats } from '../../services/storage';

interface AdminStatsProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ onNavigate }) => {
  const stats = getNetworkStats();

  return (
    <AdminLayout activeRoute={AppRoute.ADMIN_STATS} onNavigate={onNavigate}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Network Statistics</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Occupation Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {Object.entries(stats.occupationCounts).map(([occ, count]) => {
              const percentage = ((count / stats.totalUsers) * 100).toFixed(1);
              return (
                <div key={occ} className="bg-gray-50 p-4 rounded-lg">
                   <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 text-sm">{occ}</span>
                      <span className="font-bold text-gray-900">{count}</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                   </div>
                   <p className="text-xs text-gray-500 mt-1">{percentage}% of total users</p>
                </div>
              );
           })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
         <h2 className="text-lg font-bold text-gray-800 mb-4">Global Network Health</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
               <p className="text-3xl font-bold text-blue-600 mb-1">{stats.totalSponsors}</p>
               <p className="text-sm text-gray-500">Active Recruiters</p>
            </div>
            <div className="p-4 border-l border-r border-gray-100">
               <p className="text-3xl font-bold text-purple-600 mb-1">{stats.avgDirects}</p>
               <p className="text-sm text-gray-500">Avg Directs per Sponsor</p>
            </div>
            <div className="p-4">
               <p className="text-3xl font-bold text-green-600 mb-1">{stats.totalUsers - stats.totalSponsors}</p>
               <p className="text-sm text-gray-500">Passive Members</p>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
};
