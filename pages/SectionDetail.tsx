
import React from 'react';
import { AppRoute, AppSectionItem } from '../types';
import { SectionIcon } from '../components/SectionIcon';
import { ArrowLeft, Hammer, Clock } from 'lucide-react';
import { Button } from '../components/Button';

interface SectionDetailProps {
  onNavigate: (route: AppRoute) => void;
  section: AppSectionItem | null;
}

export const SectionDetail: React.FC<SectionDetailProps> = ({ onNavigate, section }) => {
  if (!section) return null;

  const isCore = section.isCore;
  
  // Logic to determine if it's strictly a "Coming Soon" section or a placeholder core section
  const isComingSoon = !isCore;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
        <button 
          onClick={() => onNavigate(AppRoute.LAUNCHER)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">{section.name.replace(" (Coming Soon)", "")}</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6 text-teal-600">
          <SectionIcon name={section.name} category="" size={48} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {section.name.replace(" (Coming Soon)", "")}
        </h2>

        {isComingSoon ? (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-medium text-sm mb-6">
              <Clock size={16} />
              Coming Soon
            </div>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              We are working hard to bring this feature to you. This section will be available in the next major update.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm mb-6">
              <Hammer size={16} />
              Core Module
            </div>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              This is a core system module active in the backend. Full visual interface is being finalized for Version 2.
            </p>
          </>
        )}

        <Button onClick={() => onNavigate(AppRoute.LAUNCHER)} variant="outline">
          Go Back to Launcher
        </Button>
      </div>
    </div>
  );
};
