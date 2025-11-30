import React, { useState } from 'react';
import { AppRoute } from '../../types';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, Eye, CheckCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface SiteVisitBookingProps {
  onNavigate: (route: AppRoute) => void;
}

export const SiteVisitBooking: React.FC<SiteVisitBookingProps> = ({ onNavigate }) => {
  const [bookingType, setBookingType] = useState<'PHYSICAL' | 'VIRTUAL'>('PHYSICAL');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => onNavigate(AppRoute.DASHBOARD)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Site Visit Options</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Toggle Options */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={() => setBookingType('PHYSICAL')}
             className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
               bookingType === 'PHYSICAL' 
                 ? 'border-teal-500 bg-teal-50 text-teal-700' 
                 : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
             }`}
           >
              <MapPin size={32} />
              <span className="font-bold text-sm">Physical Visit</span>
           </button>
           <button 
             onClick={() => setBookingType('VIRTUAL')}
             className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
               bookingType === 'VIRTUAL' 
                 ? 'border-purple-500 bg-purple-50 text-purple-700' 
                 : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
             }`}
           >
              <Eye size={32} />
              <span className="font-bold text-sm">Virtual AR/VR Tour</span>
           </button>
        </div>

        {bookingType === 'PHYSICAL' ? (
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Book Physical Site Visit</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <CheckCircle size={32} />
                   </div>
                   <h3 className="font-bold text-gray-800 mb-2">Request Submitted!</h3>
                   <p className="text-gray-500 text-sm">Your physical site visit request has been submitted successfully.</p>
                   <Button 
                     variant="outline" 
                     className="mt-6"
                     onClick={() => setSubmitted(false)}
                   >
                     Book Another
                   </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                   <Input label="Full Name" placeholder="Your Name" required icon={<User size={16}/>} />
                   <Input label="Phone Number" placeholder="Your Phone" type="tel" required icon={<Phone size={16}/>} />
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <div className="relative">
                           <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                           <input type="date" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <div className="relative">
                           <Clock size={16} className="absolute left-3 top-3 text-gray-400" />
                           <input type="time" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required />
                        </div>
                      </div>
                   </div>
                   
                   <Input label="Location / Project" placeholder="e.g. Paradise Enclave, Phase 1" required icon={<MapPin size={16}/>} />
                   
                   <Button type="submit" fullWidth>Submit Request</Button>
                </form>
              )}
           </div>
        ) : (
           <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg border border-gray-800 text-center flex flex-col items-center justify-center h-80 animate-fadeIn relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-50"></div>
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                    <Eye size={48} className="text-purple-300" />
                 </div>
                 <h2 className="text-xl font-bold mb-2">360° Virtual Tour</h2>
                 <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                    Experience properties from the comfort of your home with our immersive AR/VR technology.
                 </p>
                 <span className="inline-block bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Coming Soon
                 </span>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};