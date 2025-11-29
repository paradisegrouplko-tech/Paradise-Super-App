
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validateSponsor, registerUser, generateUserId, generateAndSendOTP, savePendingRegistration } from '../services/storage';
import { OCCUPATIONS } from '../constants';
import { AppRoute, User } from '../types';
import { ArrowLeft, UserPlus, CheckCircle, Lock } from 'lucide-react';

interface RegisterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // OTP State
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [sponsorDetails, setSponsorDetails] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    sponsorId: '',
    occupationCategory: '',
    occupationSubCategory: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'occupationCategory' ? { occupationSubCategory: '' } : {})
    }));
  };

  // Step 1: Validate Form & Sponsor -> Send OTP
  const handleVerifySponsor = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { fullName, phoneNumber, password, sponsorId, occupationCategory, occupationSubCategory } = formData;

    if (!fullName || !phoneNumber || !password || !sponsorId || !occupationCategory || !occupationSubCategory) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    // Validate Sponsor
    const sponsorCheck = validateSponsor(sponsorId);
    if (!sponsorCheck.valid || !sponsorCheck.sponsor) {
      setError(sponsorCheck.message || "Invalid Sponsor ID");
      setIsLoading(false);
      return;
    }

    setSponsorDetails(sponsorCheck.sponsor);

    // Simulate sending OTP to Sponsor
    setTimeout(() => {
      const otp = generateAndSendOTP(sponsorCheck.sponsor!.phoneNumber);
      setGeneratedOtp(otp);
      
      // Save Pending State for Admin Visibility
      savePendingRegistration({
        tempId: 'PENDING-' + Math.random().toString(36).substr(2, 9),
        name: fullName,
        phoneNumber: phoneNumber,
        password: password,
        sponsorId: sponsorId,
        occupationCategory,
        occupationSubCategory,
        submittedAt: new Date().toISOString(),
        otp: otp
      });

      setIsLoading(false);
      setStep('OTP'); // Move to OTP step
    }, 800);
  };

  // Step 2: Verify OTP & Register
  const handleFinalRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (otpInput !== generatedOtp) {
      setError("Incorrect OTP. Please try again.");
      setIsLoading(false);
      return;
    }

    // Register User
    const newUser: User = {
      id: generateUserId(formData.fullName),
      name: formData.fullName,
      phoneNumber: formData.phoneNumber,
      sponsorId: formData.sponsorId,
      occupationCategory: formData.occupationCategory,
      occupationSubCategory: formData.occupationSubCategory,
      joinedAt: new Date().toISOString(),
      password: formData.password,
      directMembers: []
    };

    const res = registerUser(newUser);
    
    if (res.success) {
      alert(`Registration Successful! Your Member ID is: ${newUser.id}. Please Login.`);
      onNavigate(AppRoute.LOGIN);
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  const selectedCategory = OCCUPATIONS.find(cat => cat.name === formData.occupationCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <button 
          onClick={() => step === 'OTP' ? setStep('FORM') : onNavigate(AppRoute.LOGIN)}
          className="flex items-center text-gray-500 hover:text-teal-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} className="mr-1" />
          {step === 'OTP' ? 'Back to Details' : 'Back to Login'}
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
                {step === 'OTP' ? <Lock size={24} /> : <UserPlus size={24} />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'OTP' ? 'Sponsor Approval' : 'Create Account'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {step === 'OTP' ? 'Enter the OTP sent to your sponsor' : 'Join the Paradise Network today'}
              </p>
            </div>

            {step === 'FORM' ? (
              <form onSubmit={handleVerifySponsor} className="space-y-4">
                <Input 
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <Input 
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  placeholder="0912345678"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />

                <Input 
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <div className="pt-2 border-t border-gray-100 mt-2">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-3 tracking-wider">Network Details</p>
                  <Input 
                    label="Sponsor ID"
                    name="sponsorId"
                    placeholder="Enter Sponsor ID"
                    value={formData.sponsorId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation Category</label>
                  <select 
                    name="occupationCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white text-gray-700"
                    value={formData.occupationCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {OCCUPATIONS.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation Sub-Category</label>
                  <select 
                    name="occupationSubCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white disabled:bg-gray-50 text-gray-700"
                    value={formData.occupationSubCategory}
                    onChange={handleChange}
                    disabled={!formData.occupationCategory}
                    required
                  >
                    <option value="">Select Sub-Category</option>
                    {selectedCategory?.groups ? (
                      selectedCategory.groups.map(group => (
                        <optgroup key={group.name} label={group.name}>
                          {group.options.map(sub => (
                             <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </optgroup>
                      ))
                    ) : (
                      selectedCategory?.subCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))
                    )}
                  </select>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
                  {isLoading ? 'Verifying...' : 'Next: Verify Sponsor'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleFinalRegistration} className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 text-sm text-teal-800">
                  <p className="font-semibold mb-1">Sponsor Found:</p>
                  <p>{sponsorDetails?.name} ({sponsorDetails?.id})</p>
                  <div className="mt-3 pt-3 border-t border-teal-200">
                    <p>We have sent an OTP to your sponsor's mobile number ending in <span className="font-mono font-bold">...{sponsorDetails?.phoneNumber.slice(-4)}</span>.</p>
                    <p className="mt-1">Please ask them for the code to complete your registration.</p>
                  </div>
                </div>

                <Input 
                  label="Enter OTP"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="text-center tracking-widest text-xl"
                  required
                />

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Confirm OTP & Register'}
                </Button>
                
                <div className="text-center">
                   <button 
                    type="button"
                    onClick={() => {
                       const otp = generateAndSendOTP(sponsorDetails!.phoneNumber);
                       setGeneratedOtp(otp);
                    }}
                    className="text-sm text-teal-600 hover:text-teal-700 underline"
                   >
                     Resend OTP
                   </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
