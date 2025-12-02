import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validateSponsor, registerUser, generateUserId, generateAndSendOTP, savePendingRegistration, getPendingReferralCode } from '../services/storage';
import { OCCUPATIONS } from '../constants';
import { AppRoute, RegistrationStage } from '../types';
import { ArrowLeft, Smartphone, UserCheck, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [stage, setStage] = useState<RegistrationStage>(RegistrationStage.MOBILE_OTP);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sponsorCode, setSponsorCode] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorOtp, setSponsorOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [occupationCategory, setOccupationCategory] = useState('');
  const [occupationSubCategory, setOccupationSubCategory] = useState('');
  const [emailBase, setEmailBase] = useState('');
  const [isSponsorLocked, setIsSponsorLocked] = useState(false);

  useEffect(() => {
    // Check for autofill
    const pendingRef = getPendingReferralCode();
    if (pendingRef) {
      setSponsorCode(pendingRef);
      setIsSponsorLocked(true);
    }
  }, []);

  // ... Handlers ...

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    const res = await (await import('../services/storage')).RegistrationFlow.startMobileVerification(mobileNumber);
    setIsLoading(false);
    if (res.success) setSuccessMsg(res.message); 
    else setError(res.message);
  };

  const handleVerifyMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    const res = await (await import('../services/storage')).RegistrationFlow.verifyMobileOTP(mobileNumber, otp);
    setIsLoading(false);
    if (res.success) {
      setStage(RegistrationStage.SPONSOR_ENTRY);
      setSuccessMsg('');
      setOtp('');
    } else {
      setError(res.message);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    const res = await (await import('../services/storage')).RegistrationFlow.validateSponsorAndTriggerOTP(mobileNumber, sponsorCode);
    setIsLoading(false);
    if (res.success) {
      setSponsorName(res.sponsorName || 'Sponsor');
      setStage(RegistrationStage.SPONSOR_OTP);
      setSuccessMsg(`OTP sent to ${res.sponsorName}'s mobile.`);
    } else {
      setError(res.message);
      if (isSponsorLocked) {
         setError("The referral link used is invalid. Please enter a different ID.");
         setIsSponsorLocked(false);
         setSponsorCode('');
      } else {
         setSponsorCode('');
      }
    }
  };

  const handleVerifySponsorOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    const res = await (await import('../services/storage')).RegistrationFlow.verifySponsorOTP(mobileNumber, sponsorOtp);
    setIsLoading(false);
    if (res.success) {
      setStage(RegistrationStage.FINAL_DETAILS);
      setSuccessMsg('');
    } else {
      setError(res.message);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    
    const res = await (await import('../services/storage')).RegistrationFlow.commitUser(mobileNumber, {
      name: fullName,
      password,
      occupation: occupationCategory,
      subOccupation: occupationSubCategory,
      emailBase: emailBase
    });

    setIsLoading(false);

    if (res.success) {
      alert(`Welcome to Paradise! Your Member ID: ${res.user?.user_id} and Sponsor Code: ${res.user?.sponsor_code}`);
      onNavigate(AppRoute.LOGIN);
    } else {
      setError(res.message);
      if (res.message.includes("limit reached")) {
        setStage(RegistrationStage.SPONSOR_ENTRY);
        setSponsorCode('');
        setSponsorOtp('');
      }
    }
  };

  const selectedCategory = OCCUPATIONS.find(cat => cat.name === occupationCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-8 px-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-teal-600 p-4 flex items-center gap-3 text-white">
          <button onClick={() => onNavigate(AppRoute.LOGIN)}><ArrowLeft /></button>
          <h1 className="font-bold text-lg">Registration</h1>
        </div>

        <div className="px-6 py-8">
          
          <div className="flex justify-between mb-8 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span className={stage === RegistrationStage.MOBILE_OTP ? "text-teal-600" : ""}>1. Mobile</span>
            <span className={stage === RegistrationStage.SPONSOR_ENTRY ? "text-teal-600" : ""}>2. Sponsor</span>
            <span className={stage === RegistrationStage.SPONSOR_OTP ? "text-teal-600" : ""}>3. Verify</span>
            <span className={stage === RegistrationStage.FINAL_DETAILS ? "text-teal-600" : ""}>4. Finish</span>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
          {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2"><CheckCircle size={16} /> {successMsg}</div>}

          {stage === RegistrationStage.MOBILE_OTP && (
            <>
              {!successMsg ? (
                <form onSubmit={handleMobileSubmit} className="space-y-4">
                   <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600"><Smartphone size={32}/></div>
                      <h2 className="text-xl font-bold text-gray-900">Mobile Verification</h2>
                   </div>
                   <Input label="Mobile Number" type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} required placeholder="Enter 10-digit number" />
                   <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? 'Sending...' : 'Send OTP'}</Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyMobileOtp} className="space-y-4">
                   <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Enter OTP</h2>
                      <p className="text-sm text-gray-500">Sent to {mobileNumber}</p>
                   </div>
                   <Input label="OTP Code" value={otp} onChange={e => setOtp(e.target.value)} required className="text-center text-2xl tracking-widest" />
                   <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify Mobile'}</Button>
                </form>
              )}
            </>
          )}

          {stage === RegistrationStage.SPONSOR_ENTRY && (
             <form onSubmit={handleSponsorSubmit} className="space-y-4">
                <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><UserCheck size={32}/></div>
                   <h2 className="text-xl font-bold text-gray-900">Sponsor ID</h2>
                   <p className="text-sm text-gray-500">Enter the valid Sponsor ID (PRD-XXXXXXX)</p>
                </div>
                <Input 
                   label="Sponsor ID" 
                   value={sponsorCode} 
                   onChange={e => !isSponsorLocked && setSponsorCode(e.target.value.toUpperCase())} 
                   required 
                   placeholder="PRD-XXXXXXX" 
                   disabled={isSponsorLocked}
                   className={isSponsorLocked ? "bg-gray-100 text-gray-500 border-gray-200" : ""}
                />
                <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? 'Validating...' : 'Verify Sponsor'}</Button>
             </form>
          )}

          {stage === RegistrationStage.SPONSOR_OTP && (
             <form onSubmit={handleVerifySponsorOtp} className="space-y-4">
                <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><Lock size={32}/></div>
                   <h2 className="text-xl font-bold text-gray-900">Sponsor Approval</h2>
                   <p className="text-sm text-gray-500">OTP sent to sponsor: <b>{sponsorName}</b></p>
                   <p className="text-xs text-gray-400 mt-1">Ask your sponsor for the code to proceed.</p>
                </div>
                <Input label="Sponsor OTP" value={sponsorOtp} onChange={e => setSponsorOtp(e.target.value)} required className="text-center text-2xl tracking-widest" />
                <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? 'Verifying...' : 'Approve & Continue'}</Button>
             </form>
          )}

          {stage === RegistrationStage.FINAL_DETAILS && (
             <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="text-center mb-6">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><UserPlus size={32}/></div>
                   <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
                </div>
                <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Username</label>
                  <div className="flex items-center">
                    <input 
                      className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      value={emailBase}
                      onChange={e => setEmailBase(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      placeholder="john.doe"
                      required
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 px-3 py-2 rounded-r-lg text-gray-500 text-sm">
                      .[tag]@paradise.com
                    </span>
                  </div>
                </div>

                <Input label="Create Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <select className="w-full px-4 py-2 border rounded-lg bg-white" value={occupationCategory} onChange={e => setOccupationCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    {OCCUPATIONS.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sub-Category</label>
                  <select className="w-full px-4 py-2 border rounded-lg bg-white" value={occupationSubCategory} onChange={e => setOccupationSubCategory(e.target.value)} disabled={!occupationCategory} required>
                    <option value="">Select Sub-Category</option>
                    {selectedCategory?.groups ? selectedCategory.groups.map(g => (
                      <optgroup key={g.name} label={g.name}>{g.options.map(o => <option key={o} value={o}>{o}</option>)}</optgroup>
                    )) : selectedCategory?.subCategories.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <Button type="submit" fullWidth disabled={isLoading} className="mt-4">{isLoading ? 'Finalizing...' : 'Create Account'}</Button>
             </form>
          )}

        </div>
      </div>
    </div>
  );
};