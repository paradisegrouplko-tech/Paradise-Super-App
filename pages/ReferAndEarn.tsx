import React from 'react';
import { AppRoute, User } from '../types';
import { ArrowLeft, Copy, Share2, QrCode as QrIcon } from 'lucide-react';
import { getReferralLink } from '../services/storage';
import { Button } from '../components/Button';

interface ReferAndEarnProps {
  user: User;
  onNavigate: (route: AppRoute) => void;
}

export const ReferAndEarn: React.FC<ReferAndEarnProps> = ({ user, onNavigate }) => {
  const referralLink = getReferralLink(user.sponsorCode);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.sponsorCode);
    alert("Sponsor Code Copied!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral Link Copied!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Paradise Super App',
          text: `Join my network on Paradise using my Sponsor Code: ${user.sponsorCode}`,
          url: referralLink,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert("Sharing not supported on this browser. Copy link instead.");
    }
  };

  return (
    <div className="min-h-screen bg-teal-600 flex flex-col text-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Refer & Earn</h1>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl p-6 mt-4 text-gray-900 flex flex-col items-center">
         
         <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600 shadow-sm">
            <Share2 size={40} />
         </div>

         <h2 className="text-2xl font-bold text-center mb-2">Invite your friends</h2>
         <p className="text-gray-500 text-center text-sm mb-8 px-4">
           Share your unique link and grow your network to earn rewards.
         </p>

         {/* Sponsor Code Card */}
         <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-6 relative">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider">Your Sponsor ID</p>
            <p className="text-3xl font-mono font-bold text-teal-700 tracking-widest">{user.sponsorCode}</p>
            <button 
              onClick={handleCopyCode}
              className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-gray-400 hover:text-teal-600"
            >
              <Copy size={20} />
            </button>
         </div>

         {/* QR Code Placeholder */}
         <div className="mb-8 flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-2">
               {/* In a real app, use a QR library here. Using Icon for simulation */}
               <QrIcon size={120} className="text-gray-800" />
            </div>
            <p className="text-xs text-gray-400">Scan to Register</p>
         </div>

         {/* Link Sharing */}
         <div className="w-full space-y-3">
            <div className="flex gap-2">
               <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-600 truncate border border-gray-200">
                 {referralLink}
               </div>
               <button 
                 onClick={handleCopyLink}
                 className="bg-gray-200 text-gray-700 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
               >
                 Copy
               </button>
            </div>
            
            <Button fullWidth onClick={handleShare} className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200">
               Share Link
            </Button>
         </div>

      </div>
    </div>
  );
};