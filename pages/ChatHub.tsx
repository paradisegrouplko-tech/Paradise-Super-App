
import React, { useState } from 'react';
import { AppRoute } from '../types';
import { DUMMY_CHATS } from '../constants';
import { Search, Camera, MoreVertical, ArrowLeft, Phone, Video, Send, Paperclip, Smile, MessageSquare } from 'lucide-react';
import { Input } from '../components/Input';

interface ChatHubProps {
  onNavigate: (route: AppRoute) => void;
}

export const ChatHub: React.FC<ChatHubProps> = ({ onNavigate }) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');

  const activeChat = DUMMY_CHATS.find(c => c.id === selectedChat);

  if (activeChat) {
    // Conversation View
    return (
      <div className="min-h-screen bg-[#efeae2] flex flex-col pb-0">
         {/* Header */}
         <div className="bg-[#008069] text-white px-2 py-2 flex items-center gap-2 shadow-sm sticky top-0 z-10">
            <button onClick={() => setSelectedChat(null)} className="p-1 rounded-full hover:bg-white/10">
               <ArrowLeft size={24} />
            </button>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
               {activeChat.avatar}
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-sm leading-tight">{activeChat.name}</h3>
               <p className="text-[10px] opacity-80">Online</p>
            </div>
            <div className="flex gap-4 pr-2">
               <Video size={20} />
               <Phone size={20} />
               <MoreVertical size={20} />
            </div>
         </div>

         {/* Chat Area */}
         <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-[#dcf8c6] p-2 rounded-lg max-w-[80%] ml-auto shadow-sm text-sm text-gray-800 relative">
               <p>Hey! Welcome to Paradise App.</p>
               <span className="text-[10px] text-gray-500 block text-right mt-1">10:00 AM</span>
            </div>
            <div className="bg-white p-2 rounded-lg max-w-[80%] mr-auto shadow-sm text-sm text-gray-800 relative">
               <p>{activeChat.lastMessage}</p>
               <span className="text-[10px] text-gray-500 block text-right mt-1">{activeChat.time}</span>
            </div>
            
            {/* Preview Warning */}
            <div className="flex justify-center my-4">
               <span className="bg-[#fff5c4] text-gray-800 text-xs px-3 py-1 rounded shadow-sm text-center">
                  Real-time messaging will be available in future versions.<br/>This is a preview chat interface.
               </span>
            </div>
         </div>

         {/* Input Area */}
         <div className="p-2 bg-gray-100 flex items-center gap-2 sticky bottom-0">
             <div className="bg-white flex-1 rounded-full flex items-center px-4 py-2 shadow-sm">
                <Smile size={20} className="text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Type a message" 
                  className="flex-1 outline-none text-sm text-gray-700"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Paperclip size={20} className="text-gray-400 ml-2 transform -rotate-45" />
                <Camera size={20} className="text-gray-400 ml-3" />
             </div>
             <button 
               className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white shadow-sm"
               onClick={() => {
                 if(messageText) {
                   setMessageText('');
                   alert("Message sent! (Simulation)");
                 }
               }}
             >
                <Send size={18} />
             </button>
         </div>
      </div>
    );
  }

  // Chat List View
  return (
    <div className="min-h-screen bg-white pb-20">
       {/* Header */}
       <div className="bg-[#008069] text-white pt-4 pb-0 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center px-4 mb-4">
             <h1 className="font-bold text-xl">Paradise Chat</h1>
             <div className="flex gap-4">
                <Camera size={22} />
                <Search size={22} />
                <MoreVertical size={22} />
             </div>
          </div>
          
          <div className="flex text-sm font-bold uppercase text-white/70">
             <div className="w-12 flex justify-center pb-3 border-b-2 border-transparent"><Camera size={16}/></div>
             <div className="flex-1 text-center pb-3 border-b-2 border-white text-white cursor-pointer">Chats</div>
             <div className="flex-1 text-center pb-3 border-b-2 border-transparent cursor-pointer">Status</div>
             <div className="flex-1 text-center pb-3 border-b-2 border-transparent cursor-pointer">Calls</div>
          </div>
       </div>

       {/* Chat List */}
       <div className="divide-y divide-gray-100">
          {DUMMY_CHATS.map(chat => (
             <div key={chat.id} onClick={() => setSelectedChat(chat.id)} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0">
                   {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{chat.name}</h3>
                      <span className={`text-xs ${chat.unread > 0 ? 'text-[#25d366]' : 'text-gray-500'}`}>{chat.time}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                         <span className="bg-[#25d366] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                           {chat.unread}
                         </span>
                      )}
                   </div>
                </div>
             </div>
          ))}
       </div>

       {/* Floating Action Button */}
       <button className="fixed bottom-20 right-4 w-12 h-12 bg-[#008069] rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-700/30">
          <MessageSquare size={20} />
       </button>
    </div>
  );
};
