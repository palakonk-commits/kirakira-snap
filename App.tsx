import React, { useState, useCallback } from 'react';
import Welcome from './components/Welcome';
import ChooseLayout from './components/ChooseLayout';
import Capture from './components/Capture';
import Preview from './components/Preview';
import Navbar from './components/Navbar';
import type { LayoutOption, Step } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [step, setStep] = useState<Step>('welcome');
  const [layout, setLayout] = useState<LayoutOption | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleStart = useCallback(() => {
    setStep('layout');
  }, []);

  const handleLayoutSelect = useCallback((selectedLayout: LayoutOption) => {
    setLayout(selectedLayout);
    setStep('capture');
  }, []);

  const handleCaptureComplete = useCallback((capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStep('preview');
  }, []);
  
  const handleRetake = useCallback(() => {
    setPhotos([]);
    // Keep layout, go back to capture
    setStep('capture');
  }, []);

  const handleReset = useCallback(() => {
    setStep('welcome');
    setLayout(null);
    setPhotos([]);
  }, []);

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <Welcome onStart={handleStart} />;
      case 'layout':
        return <ChooseLayout onSelect={handleLayoutSelect} />;
      case 'capture':
        if (!layout) {
          // Fallback if layout is not set
          handleReset();
          return null;
        }
        return <Capture layout={layout} onComplete={handleCaptureComplete} onBack={handleReset} />;
      case 'preview':
        if (!layout || photos.length === 0) {
          // Fallback if data is missing
          handleReset();
          return null;
        }
        return <Preview layout={layout} photos={photos} onRetake={handleRetake} />;
      default:
        return <Welcome onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 text-gray-800 antialiased relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80vmax] h-[80vmax] bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70vmax] h-[70vmax] bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }}></div>
        <div className="absolute bottom-[10%] left-[10%] w-[60vmax] h-[60vmax] bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        <div className="absolute inset-0 z-1 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => {
                const style = {
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 8 + 7}s`,
                    animationDelay: `${Math.random() * 7}s`,
                    fontSize: `${Math.random() * 16 + 10}px`
                };
                return <div key={i} className="sparkle" style={style}>{['💖', '✨', '⭐', '🌸'][Math.floor(Math.random() * 4)]}</div>;
            })}
        </div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onHomeClick={handleReset} />
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
          {renderStep()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    )
}

export default App;