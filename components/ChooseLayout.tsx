import React, { useState } from 'react';
import type { LayoutOption } from '../types';
import { LAYOUTS } from '../constants';
import { useTranslations } from '../hooks/useTranslations';

interface ChooseLayoutProps {
  onSelect: (layout: LayoutOption) => void;
}

const ChooseLayout: React.FC<ChooseLayoutProps> = ({ onSelect }) => {
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption | null>(null);
  const t = useTranslations();

  return (
    <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-pink-500">{t.layoutTitle}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {LAYOUTS.map((layout) => (
          <div 
            key={layout.id} 
            onClick={() => setSelectedLayout(layout)}
            className={`cursor-pointer p-4 border-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${selectedLayout?.id === layout.id ? 'border-pink-400 shadow-xl bg-white/70' : 'border-transparent bg-white/50'}`}
          >
            <div 
              className={`mx-auto bg-pink-100/80 rounded-lg grid gap-1 p-1`} 
              style={{ 
                aspectRatio: layout.aspectRatio.replace('/', ' / '),
                gridTemplateColumns: `repeat(${layout.grid.cols}, 1fr)`,
                gridTemplateRows: `repeat(${layout.grid.rows}, 1fr)`,
              }}
            >
              {[...Array(layout.poses)].map((_, i) => (
                <div key={i} className="bg-pink-200/80 rounded-sm"></div>
              ))}
            </div>
            <p className="mt-4 font-semibold text-gray-700">{t.layoutPose(layout.poses)}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={() => selectedLayout && onSelect(selectedLayout)} 
        disabled={!selectedLayout}
        className="mt-10 bg-pink-400 text-white font-bold py-3 px-10 text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-pink-300"
      >
        {t.layoutContinueButton}
      </button>
    </div>
  );
};

export default ChooseLayout;