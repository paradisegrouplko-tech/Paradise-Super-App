import { useState, useEffect } from 'react';
import { TRANSLATIONS, Language } from '../translations';

// Simple event bus for language changes
type Listener = (lang: Language) => void;
let listeners: Listener[] = [];

let currentLanguage: Language = (localStorage.getItem('paradise_language') as Language) || 'EN';

export const getLanguage = (): Language => currentLanguage;

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem('paradise_language', lang);
  listeners.forEach(l => l(lang));
};

export const subscribeLanguage = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

// React Hook
export const useLanguage = () => {
  const [lang, setLang] = useState<Language>(currentLanguage);
  
  useEffect(() => {
    return subscribeLanguage(setLang);
  }, []);

  const t = (key: keyof typeof TRANSLATIONS['EN']) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['EN'][key] || key;
  };

  return { lang, setLanguage, t };
};