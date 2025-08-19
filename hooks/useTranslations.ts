import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslations = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return translations[context.language];
};
