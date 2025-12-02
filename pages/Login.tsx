import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { loginUser, getLastLoggedInUserPhone, getUserByPhone } from '../services/storage';
import { AppRoute } from '../types';
import { ROOT_ADMIN_PHONE } from '../constants';
import { ShieldCheck, Fingerprint, Lock } from 'lucide-react';
import { useLanguage } from '../services/language';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (route: AppRoute) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const { t } = useLanguage(); // Access translations if needed, or keep simple for Login
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canUseBiometric, setCanUseBiometric] = useState(false);

  useEffect(() => {
    const lastPhone = getLastLoggedInUserPhone();
    if (lastPhone) {
      const user = getUserByPhone(lastPhone);
      if (user && user.biometricEnabled) {
        setCanUseBiometric(true);
        setPhoneNumber(lastPhone);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const result = loginUser(phoneNumber, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Invalid Credentials');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
       const lastPhone = getLastLoggedInUserPhone();
       if (lastPhone) {
         const user = getUserByPhone(lastPhone);
         if (user) {
            onLoginSuccess(user);
         } else {
           setError("Biometric failed.");
           setIsLoading(false);
         }
       }
    }, 1000);
  };

  const fillDemoUser = () => {
    setPhoneNumber(ROOT_ADMIN_PHONE);
    setPassword('admin');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Login to Paradise Super App
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input 
            label="Phone Number"
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
          />

          <Input 
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            {canUseBiometric && (
              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={isLoading}
                onClick={handleBiometricLogin}
                className="flex items-center justify-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <Fingerprint size={20} />
                Biometric Login
              </Button>
            )}

            <Button 
              type="button"
              variant="ghost"
              fullWidth
              className="text-gray-500 font-normal hover:bg-gray-100"
              onClick={() => alert("Coming soon")}
            >
              Forgot Password
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
            </div>

            <Button 
              type="button"
              variant="outline"
              fullWidth
              onClick={() => onNavigate(AppRoute.REGISTER)}
            >
              Create New Account
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => onNavigate(AppRoute.ADMIN_LOGIN)}
            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Lock size={16} />
            Admin Login
          </button>
          
          <div className="mt-4">
             <button onClick={fillDemoUser} className="text-xs text-gray-400 hover:text-gray-600 underline">
               Fill Demo User
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};