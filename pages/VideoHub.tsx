
import React, { useState } from 'react';
import { AppRoute } from '../types';
import { DUMMY_VIDEOS } from '../constants';
import { Search, Bell, UserCircle, Play, ThumbsUp, MessageSquare, Share2, ArrowLeft } from 'lucide-react';

interface VideoHubProps {
  onNavigate: (route: AppRoute) => void;
}

export const VideoHub: React.FC<VideoHubProps> = ({ onNavigate }) => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const activeVideo = DUMMY_VIDEOS.find(v => v.id === selectedVideo);

  if (activeVideo) {
    // Video Detail View
    return (
      <div className="min-h-screen bg-black text-white flex flex-col pb-20">
         <div className="p-4 flex items-center gap-4 sticky top-0 bg-black z-10">
           <button onClick={() => setSelectedVideo(null)}><ArrowLeft size={24} /></button>
           <h1 className="font-bold text-lg truncate">{activeVideo.title}</h1>
         </div>

         <div className="aspect-video bg-gray-800 w-full flex items-center justify-center relative">
            <Play size={48} className="text-white opacity-80" />
            <img src={activeVideo.thumbnail} alt="thumb" className="absolute inset-0 w-full h-full object-cover opacity-50" />
         </div>

         <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold leading-tight">{activeVideo.title}</h2>
            <div className="flex justify-between items-center text-gray-400 text-sm">
               <span>{activeVideo.views} • 2 days ago</span>
            </div>

            <div className="flex justify-around py-2 border-y border-gray-800">
               <button className="flex flex-col items-center gap-1 text-sm text-gray-300">
                  <ThumbsUp size={20} /> Like
               </button>
               <button className="flex flex-col items-center gap-1 text-sm text-gray-300">
                  <MessageSquare size={20} /> Comment
               </button>
               <button className="flex flex-col items-center gap-1 text-sm text-gray-300">
                  <Share2 size={20} /> Share
               </button>
            </div>

            <div className="flex items-center gap-3 p-2 bg-gray-900 rounded-lg">
               <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center font-bold">
                 {activeVideo.channel.charAt(0)}
               </div>
               <div>
                  <p className="font-bold">{activeVideo.channel}</p>
                  <p className="text-xs text-gray-400">150K Subscribers</p>
               </div>
               <button className="ml-auto bg-white text-black text-xs font-bold px-4 py-2 rounded-full">
                  Subscribe
               </button>
            </div>

            <div className="p-4 bg-gray-900 rounded-lg text-center mt-8">
               <p className="text-yellow-400 text-sm font-bold mb-1">Preview Mode</p>
               <p className="text-xs text-gray-400">Full video features will be available in future versions.</p>
            </div>
         </div>
      </div>
    );
  }

  // Video Feed View
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2 text-red-600">
            <Play size={24} fill="currentColor" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">VideoHub</span>
         </div>
         <div className="flex gap-4 text-gray-700">
            <Search size={22} />
            <Bell size={22} />
            <UserCircle size={22} />
         </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar border-b border-gray-100">
         {['All', 'New to you', 'Business', 'Real Estate', 'Motivation', 'Live'].map((filter, idx) => (
            <button 
              key={idx} 
              className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap ${idx === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
               {filter}
            </button>
         ))}
      </div>

      {/* Video List */}
      <div className="mt-2">
         {DUMMY_VIDEOS.map(video => (
            <div key={video.id} onClick={() => setSelectedVideo(video.id)} className="mb-6 cursor-pointer group">
               <div className="aspect-video bg-gray-200 relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                     12:45
                  </div>
               </div>
               <div className="flex gap-3 px-3 pt-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex-shrink-0 flex items-center justify-center font-bold text-teal-700">
                     {video.channel.charAt(0)}
                  </div>
                  <div>
                     <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {video.title}
                     </h3>
                     <p className="text-xs text-gray-500 mt-1">
                        {video.channel} • {video.views} • 5 hours ago
                     </p>
                  </div>
               </div>
            </div>
         ))}
         
         {/* Infinite Scroll Placeholder */}
         <div className="p-4 text-center text-gray-400 text-sm">
            That's all for now. Check back later!
         </div>
      </div>
    </div>
  );
};
