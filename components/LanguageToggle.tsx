import React from 'react';
import { useLanguage } from '../services/language';

export const LanguageToggle: React.FC = () => {
  const { lang, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner">
      <button
        onClick={() => setLanguage('EN')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          lang === 'EN' 
            ? 'bg-white text-teal-600 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('HI')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          lang === 'HI' 
            ? 'bg-white text-teal-600 shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        हिं
      </button>
    </div>
  );
};