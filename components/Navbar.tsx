import React, { useState, useContext } from 'react';
import Modal from './Modal';
import AboutDevContent from './AboutDevContent';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageContext } from '../contexts/LanguageContext';

interface NavbarProps {
  onHomeClick: () => void;
}

const FAQContent: React.FC = () => {
    const t = useTranslations();
    return (
    <>
        <h3 className="text-xl font-bold mb-4 text-pink-500">{t.faqTitle}</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold">{t.faqQ1}</h4>
                <p>{t.faqA1}</p>
            </div>
            <div>
                <h4 className="font-semibold">{t.faqQ2}</h4>
                <p>{t.faqA2}</p>
            </div>
             <div>
                <h4 className="font-semibold">{t.faqQ3}</h4>
                <p>{t.faqA3}</p>
            </div>
        </div>
    </>
    )
};

const PrivacyPolicyContent: React.FC = () => {
    const t = useTranslations();
    return (
        <>
            <h3 className="text-xl font-bold mb-4 text-pink-500">{t.privacyTitle}</h3>
            <p>{t.privacyText}</p>
        </>
    )
};

const ContactContent: React.FC = () => {
    const t = useTranslations();
    return (
    <>
        <h3 className="text-xl font-bold mb-4 text-pink-500">{t.contactTitle}</h3>
        <p className="mb-4">{t.contactText}</p>
        <div className="flex space-x-4">
            <a href="#" className="text-pink-500 hover:text-pink-600">Twitter</a>
            <a href="#" className="text-pink-500 hover:text-pink-600">Instagram</a>
            <a href="#" className="text-pink-500 hover:text-pink-600">Facebook</a>
        </div>
        <form className="mt-6 space-y-4">
            <input type="text" placeholder={t.contactNamePlaceholder} className="w-full p-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none" />
            <input type="email" placeholder={t.contactEmailPlaceholder} className="w-full p-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none" />
            <textarea placeholder={t.contactMessagePlaceholder} rows={4} className="w-full p-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"></textarea>
            <button type="submit" className="w-full bg-pink-400 text-white font-bold py-2 px-4 rounded-full hover:bg-pink-500 transition-colors shadow-md">{t.contactSendButton}</button>
        </form>
    </>
    )
};

const SupportContent: React.FC = () => {
    const t = useTranslations();
    return (
    <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold mb-4 text-pink-500">{t.supportTitle}</h3>
         <img 
            src="https://i.postimg.cc/gk3hb8DR/532567681-759247880294516-3273403766756595692-n.jpg" 
            alt="Support QR Code" 
            className="w-48 h-48 md:w-56 md:h-56 rounded-xl shadow-lg"
        />
        <p className="text-lg mt-4 text-gray-700 font-semibold">{t.supportText}</p>
        <p className="text-sm mt-1 text-gray-500">{t.supportSubtext}</p>
    </div>
    )
};


const ModalContentWrapper: React.FC<{ children: React.ReactNode, onClose: () => void }> = ({ children, onClose }) => (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
    </div>
);


const Navbar: React.FC<NavbarProps> = ({ onHomeClick }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const t = useTranslations();
  const { toggleLanguage } = useContext(LanguageContext);


  const closeModal = () => setActiveModal(null);

  const renderModal = () => {
    if (!activeModal) return null;

    if (activeModal === 'about') {
      return (
        <Modal onClose={closeModal} variant="bottom-sheet">
          <AboutDevContent onClose={closeModal} />
        </Modal>
      );
    }
    
    let content: React.ReactNode;
    switch(activeModal) {
        case 'faq': content = <FAQContent />; break;
        case 'privacy': content = <PrivacyPolicyContent />; break;
        case 'contact': content = <ContactContent />; break;
        case 'support': content = <SupportContent />; break;
        default: return null;
    }
    
    return (
        <Modal onClose={closeModal} variant="centered">
            <ModalContentWrapper onClose={closeModal}>
                {content}
            </ModalContentWrapper>
        </Modal>
    );
  };

  return (
    <>
      <header className="w-full p-4 bg-white/30 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-pink-500 cursor-pointer" onClick={onHomeClick}>
            KiraKira Snap
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-700">
            <button onClick={onHomeClick} className="hover:text-pink-500 transition-colors">{t.navbarHome}</button>
            <button onClick={() => setActiveModal('faq')} className="hover:text-pink-500 transition-colors">{t.navbarFaq}</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-pink-500 transition-colors">{t.navbarPrivacy}</button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-pink-500 transition-colors">{t.navbarContact}</button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <button onClick={toggleLanguage} className="font-semibold py-2 px-3 rounded-full hover:bg-gray-200/80 transition-colors text-gray-600">
                🌐 TH/EN
            </button>
            <button onClick={() => setActiveModal('about')} className="bg-pink-200/80 text-pink-700 font-bold py-2 px-4 rounded-full hover:bg-pink-200 transition-colors shadow-md transform hover:scale-105">
                <span className="hidden sm:inline">{t.navbarAbout} </span>🐰
            </button>
            <button onClick={() => setActiveModal('support')} className="bg-yellow-200/80 text-yellow-800 font-bold py-2 px-4 rounded-full hover:bg-yellow-200 transition-colors shadow-md transform hover:scale-105">
                {t.navbarSupport} 💖
            </button>
          </div>
        </nav>
      </header>
      {renderModal()}
    </>
  );
};

export default Navbar;