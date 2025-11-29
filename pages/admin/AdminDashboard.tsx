
import React from 'react';
import { AppRoute } from '../../types';
import { AdminLayout } from '../../components/AdminLayout';
import { getNetworkStats } from '../../services/storage';
import { Users, UserPlus, ShieldCheck, Activity, Search, List, CheckCircle } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const stats = getNetworkStats();

  const StatCard = ({ label, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} text-white`}>
        {icon}
      </div>
    </div>
  );

  return (
    <AdminLayout activeRoute={AppRoute.ADMIN_DASHBOARD} onNavigate={onNavigate}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          label="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={24} />} 
          color="bg-blue-600" 
        />
        <StatCard 
          label="New Users Today" 
          value={stats.newUsersToday} 
          icon={<UserPlus size={24} />} 
          color="bg-green-500" 
        />
        <StatCard 
          label="Active Sponsors" 
          value={stats.totalSponsors} 
          icon={<ShieldCheck size={24} />} 
          color="bg-purple-600" 
        />
        <StatCard 
          label="Pending Approvals" 
          value={stats.pendingCount} 
          icon={<Activity size={24} />} 
          color="bg-amber-500" 
        />
        <StatCard 
          label="Avg Directs / Sponsor" 
          value={stats.avgDirects} 
          icon={<Users size={24} />} 
          color="bg-indigo-500" 
        />
        <StatCard 
          label="Top Category" 
          value={stats.topOccupation} 
          icon={<List size={24} />} 
          color="bg-teal-500" 
        />
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => onNavigate(AppRoute.ADMIN_USERS)}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center"
        >
          <List size={24} className="text-blue-600" />
          <span className="font-semibold text-gray-700">View All Users</span>
        </button>

        <button 
          onClick={() => onNavigate(AppRoute.ADMIN_USERS)}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center"
        >
          <Search size={24} className="text-purple-600" />
          <span className="font-semibold text-gray-700">Search User</span>
        </button>

        <button 
          onClick={() => onNavigate(AppRoute.ADMIN_APPROVALS)}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center"
        >
          <CheckCircle size={24} className="text-green-600" />
          <span className="font-semibold text-gray-700">Approvals ({stats.pendingCount})</span>
        </button>

        <button 
          onClick={() => onNavigate(AppRoute.ADMIN_STATS)}
          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center gap-2 text-center"
        >
          <Activity size={24} className="text-amber-600" />
          <span className="font-semibold text-gray-700">Network Stats</span>
        </button>
      </div>
    </AdminLayout>
  );
};
