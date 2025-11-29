
import React, { useState } from 'react';
import { AppRoute } from '../../types';
import { loginAdmin } from '../../services/storage';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Shield, Lock } from 'lucide-react';
import { ADMIN_ID, ADMIN_PASSWORD } from '../../constants';

interface AdminLoginProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigate }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(id, password)) {
      onNavigate(AppRoute.ADMIN_DASHBOARD);
    } else {
      setError("Invalid Admin ID or Password");
    }
  };

  const fillDemo = () => {
    setId(ADMIN_ID);
    setPassword(ADMIN_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Secure Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Admin ID" 
            placeholder="Enter ID" 
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth className="bg-blue-600 hover:bg-blue-700">
            <Lock size={18} className="mr-2" />
            Login to Console
          </Button>

          <div className="text-center pt-4">
             <button 
               type="button"
               onClick={() => onNavigate(AppRoute.LOGIN)}
               className="text-sm text-gray-400 hover:text-gray-600"
             >
               Back to User App
             </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
             <button onClick={fillDemo} className="text-xs text-gray-400 hover:text-gray-600 underline">
               Fill Admin Credentials (Demo)
             </button>
        </div>
      </div>
    </div>
  );
};
