import React, { useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  variant?: 'centered' | 'bottom-sheet';
}

const Modal: React.FC<ModalProps> = ({ onClose, children, variant = 'centered' }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const containerClasses = {
    centered: 'items-center justify-center',
    'bottom-sheet': 'items-end md:items-center justify-center',
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex z-50 p-4 ${containerClasses[variant]}`} onClick={onClose}>
      <div
        className="w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
