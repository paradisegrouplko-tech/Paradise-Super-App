
import React, { useState } from 'react';
import { AppRoute, User } from '../types';
import { ArrowLeft, UserCircle, Fingerprint, Shield, Smartphone } from 'lucide-react';
import { Button } from '../components/Button';
import { updateUserProfile } from '../services/storage';

interface ProfileProps {
  user: User;
  onNavigate: (route: AppRoute) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onNavigate }) => {
  const [biometricEnabled, setBiometricEnabled] = useState(user.biometricEnabled || false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleToggle = () => {
    if (!biometricEnabled) {
      // Trying to enable
      setShowConfirm(true);
    } else {
      // Trying to disable - just do it
      updateSetting(false);
    }
  };

  const updateSetting = (enabled: boolean) => {
    const updatedUser = { ...user, biometricEnabled: enabled };
    updateUserProfile(updatedUser);
    setBiometricEnabled(enabled);
    if(enabled) alert("Biometric Login Enabled for this device!");
    else alert("Biometric Login Disabled.");
  };

  const handleEnableConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPassword === user.password) {
      updateSetting(true);
      setShowConfirm(false);
      setConfirmPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Profile & Settings</h1>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
        
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
             <UserCircle size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.phoneNumber}</p>
          <div className="mt-4 flex gap-2">
             <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">ID: {user.id}</span>
             <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">{user.occupationCategory}</span>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Shield size={18} className="text-teal-600" />
              <h3 className="font-semibold text-gray-700">Security Settings</h3>
           </div>
           
           <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${biometricEnabled ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Fingerprint size={24} />
                   </div>
                   <div>
                      <p className="font-medium text-gray-900">Biometric / Face Login</p>
                      <p className="text-xs text-gray-500">Use FaceID or Fingerprint to login</p>
                   </div>
                </div>
                
                <button 
                  onClick={handleToggle}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${biometricEnabled ? 'bg-teal-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {showConfirm && (
                <form onSubmit={handleEnableConfirm} className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                   <p className="text-sm text-gray-700 mb-3">To enable biometrics, please verify your password:</p>
                   <input 
                     type="password"
                     placeholder="Enter your password"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-teal-500 outline-none"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                   />
                   {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
                   <div className="flex gap-2">
                     <Button type="submit" className="py-2 text-sm">Verify & Enable</Button>
                     <Button type="button" variant="ghost" className="py-2 text-sm" onClick={() => { setShowConfirm(false); setConfirmPassword(''); }}>Cancel</Button>
                   </div>
                </form>
              )}
           </div>
        </div>

        {/* Device Info (Mock) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Smartphone size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-700">Device Status</h3>
           </div>
           <div className="p-4">
              <p className="text-sm text-gray-600">This device supports biometric authentication.</p>
           </div>
        </div>

      </div>
    </div>
  );
};
