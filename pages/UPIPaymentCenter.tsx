
import React, { useState, useEffect } from 'react';
import { AppRoute, User } from '../types';
import { ArrowLeft, QrCode, Send, FileText, History, Zap, Droplet, Flame, Wifi, Smartphone } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { updateUserProfile } from '../services/storage';

interface UPIProps {
  user: User;
  onNavigate: (route: AppRoute) => void;
  initialView?: 'HOME' | 'SEND' | 'SCAN' | 'HISTORY';
}

type UPIView = 'HOME' | 'SEND' | 'SCAN' | 'HISTORY';

export const UPIPaymentCenter: React.FC<UPIProps> = ({ user, onNavigate, initialView = 'HOME' }) => {
  const [view, setView] = useState<UPIView>(initialView);
  const [upiId, setUpiId] = useState(user.upiId || '');
  
  // Update view if prop changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);
  
  // Send Money State
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');

  const handleUpdateUpi = () => {
    const updatedUser = { ...user, upiId: upiId };
    updateUserProfile(updatedUser);
    alert("UPI ID Updated!");
  };

  const renderHome = () => (
    <>
      {/* UPI Header Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden animate-fadeIn">
         <div className="relative z-10">
           <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">My UPI ID</p>
           <div className="flex items-center gap-2 mb-4">
             <input 
               value={upiId}
               onChange={(e) => setUpiId(e.target.value)}
               className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:bg-white/20 w-full max-w-[200px]"
             />
             <button onClick={handleUpdateUpi} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors">Save</button>
           </div>
           <h2 className="text-2xl font-bold">{user.name}</h2>
           <p className="text-indigo-100 text-sm opacity-80">{user.phoneNumber}</p>
         </div>
         <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <button onClick={() => setView('SCAN')} className="flex flex-col items-center gap-2">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-indigo-100 transition-colors">
             <QrCode size={24} />
           </div>
           <span className="text-xs font-medium text-gray-700">Scan & Pay</span>
        </button>
        <button onClick={() => setView('SEND')} className="flex flex-col items-center gap-2">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-indigo-100 transition-colors">
             <Send size={24} />
           </div>
           <span className="text-xs font-medium text-gray-700">To Contact</span>
        </button>
        <button onClick={() => alert("Bill payments coming soon.")} className="flex flex-col items-center gap-2">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-indigo-100 transition-colors">
             <FileText size={24} />
           </div>
           <span className="text-xs font-medium text-gray-700">Pay Bills</span>
        </button>
        <button onClick={() => setView('HISTORY')} className="flex flex-col items-center gap-2">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm hover:bg-indigo-100 transition-colors">
             <History size={24} />
           </div>
           <span className="text-xs font-medium text-gray-700">History</span>
        </button>
      </div>

      {/* Quick Bills Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Recharge & Pay Bills</h3>
        <div className="grid grid-cols-4 gap-4">
           {[
             { icon: <Smartphone size={20} />, label: "Mobile" },
             { icon: <Zap size={20} />, label: "Electric" },
             { icon: <Droplet size={20} />, label: "Water" },
             { icon: <Flame size={20} />, label: "Gas" },
             { icon: <Wifi size={20} />, label: "Broadband" },
           ].map((item, idx) => (
             <button key={idx} onClick={() => alert(`${item.label} bill payment coming soon.`)} className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                 {item.icon}
               </div>
               <span className="text-[10px] text-gray-600 font-medium">{item.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-4 text-white flex justify-between items-center shadow-md">
         <div>
           <h4 className="font-bold">Get 5% Cashback</h4>
           <p className="text-xs text-pink-100">On your first electricity bill payment.</p>
         </div>
         <button className="bg-white text-pink-600 px-3 py-1 rounded-lg text-xs font-bold uppercase" onClick={() => alert("Offers coming soon!")}>
           View Offer
         </button>
      </div>
    </>
  );

  const renderSendMoney = () => (
    <div className="animate-fadeIn">
       <h2 className="text-xl font-bold text-gray-800 mb-6">Send Money</h2>
       <div className="space-y-4">
          <Input 
            label="Receiver Name" 
            placeholder="Enter name"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <Input 
            label="Receiver UPI ID / Phone" 
            placeholder="example@upi"
          />
          <Input 
            label="Amount (₹)" 
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input 
            label="Note (Optional)" 
            placeholder="What is this for?"
          />
          <Button 
            fullWidth 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
               if(!amount) return alert("Please enter amount");
               alert("UPI payments will be activated in future versions. This is a preview screen.");
            }}
          >
            Proceed to Pay
          </Button>
       </div>
    </div>
  );

  const renderScan = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fadeIn">
       <div className="w-64 h-64 bg-gray-800 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden border-4 border-indigo-500 shadow-2xl">
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
             <div className="w-full h-1 bg-indigo-500 animate-pulse absolute top-1/2"></div>
          </div>
          <QrCode size={64} className="text-white opacity-50" />
       </div>
       <h2 className="text-xl font-bold text-gray-800 mb-2">Scanning...</h2>
       <p className="text-gray-500 max-w-xs">
         UPI Scan & Pay will be available soon. This is a preview screen.
       </p>
    </div>
  );

  const renderHistory = () => (
     <div className="animate-fadeIn">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction History</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <History size={32} />
           </div>
           <p className="text-gray-800 font-medium">No transactions yet</p>
           <p className="text-sm text-gray-500 mt-1">This section will be active in future versions.</p>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="bg-indigo-600 px-4 py-4 flex items-center gap-4 text-white shadow-md sticky top-0 z-20">
        <button 
          onClick={() => {
            if (view === 'HOME') onNavigate(AppRoute.LAUNCHER);
            else setView('HOME');
          }}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">UPI Payment Center</h1>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
         {view === 'HOME' && renderHome()}
         {view === 'SEND' && renderSendMoney()}
         {view === 'SCAN' && renderScan()}
         {view === 'HISTORY' && renderHistory()}
      </div>
    </div>
  );
};
