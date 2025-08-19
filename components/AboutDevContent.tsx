import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface AboutDevContentProps {
  onClose?: () => void;
}

const AboutDevContent: React.FC<AboutDevContentProps> = ({ onClose }) => {
  const [toastMessage, setToastMessage] = useState('');
  const t = useTranslations();
  const email = 'bosslyyxx.dev@gmail.com';

  const handleCopyEmail = () => {
    if (!navigator.clipboard) {
        // Fallback for older browsers
        alert("Clipboard functionality not available.");
        return;
    }
    navigator.clipboard.writeText(email).then(() => {
      setToastMessage(t.aboutToastCopied);
      setTimeout(() => setToastMessage(''), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setToastMessage(t.aboutToastFailed);
      setTimeout(() => setToastMessage(''), 2000);
    });
  };

  return (
    <>
      <div className="bg-pink-100/70 backdrop-blur-xl rounded-t-3xl md:rounded-2xl md:max-w-sm md:mx-auto relative text-center p-6 text-gray-700 w-full">
        {/* Background sparkles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl -z-10">
          <div className="absolute top-[20%] left-[15%] text-5xl opacity-40 animate-pulse">✨</div>
          <div className="absolute bottom-[25%] right-[20%] text-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>💖</div>
        </div>

        <img
          src="https://lh3.googleusercontent.com/a/ACg8ocI2YXDFTQA43zOJtq2SFGgD5pgWAa4tuI5z3We61sjfpYuNjys=s360-c-no"
          alt="BossLyyxx!!"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-pink-200 shadow-lg"
        />
        <h3 className="text-3xl font-bold text-pink-500">BossLyyxx!!</h3>
        <p className="font-semibold text-gray-600 mb-4">{t.aboutCreator}</p>
        <p className="max-w-xs mx-auto text-sm" dangerouslySetInnerHTML={{ __html: t.aboutBio }} />

        <div className="flex flex-col items-center space-y-3 mt-6">
          <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 w-full max-w-xs bg-white/80 font-bold py-2.5 px-4 rounded-full hover:bg-pink-100 transition-all shadow-md transform hover:scale-105">
            ✉️ {t.aboutEmailButton}
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full max-w-xs bg-white/80 font-bold py-2.5 px-4 rounded-full hover:bg-pink-100 transition-all shadow-md transform hover:scale-105">
            🐱 {t.aboutGithubButton}
          </a>
          <a href="https://www.instagram.com/bosslyxx_2006?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full max-w-xs bg-white/80 font-bold py-2.5 px-4 rounded-full hover:bg-pink-100 transition-all shadow-md transform hover:scale-105">
            📸 {t.aboutInstagramButton}
          </a>
          <button onClick={handleCopyEmail} className="flex items-center justify-center gap-2 w-full max-w-xs bg-white/80 font-bold py-2.5 px-4 rounded-full hover:bg-pink-100 transition-all shadow-md transform hover:scale-105">
            📎 {t.aboutCopyEmailButton}
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white font-bold py-2 px-8 rounded-full hover:bg-gray-500 transition-colors shadow-md transform hover:scale-105"
            aria-label="Close developer info"
          >
            {t.aboutCloseButton}
          </button>
        </div>
      </div>
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm font-bold py-2 px-5 rounded-full shadow-lg z-[100] animate-fade-in">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default AboutDevContent;