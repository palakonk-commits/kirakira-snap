import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const t = useTranslations();

  return (
    <div className="text-center bg-white/60 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-lg animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-bold text-pink-500 mb-4">{t.welcomeTitle}</h1>
      <div className="text-gray-600 space-y-3 text-lg max-w-md mx-auto">
        <p dangerouslySetInnerHTML={{ __html: t.welcomeLine1 }} />
        <p dangerouslySetInnerHTML={{ __html: t.welcomeLine2 }} />
        <p dangerouslySetInnerHTML={{ __html: t.welcomeLine3 }} />
      </div>
      <button 
        onClick={onStart} 
        className="mt-8 bg-pink-400 text-white font-bold py-3 px-10 text-xl rounded-full hover:bg-pink-500 transition-all duration-300 transform hover:scale-105 shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-300"
      >
        {t.welcomeStartButton}
      </button>
    </div>
  );
};

export default Welcome;