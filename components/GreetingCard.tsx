
import React from 'react';
import { COLORS } from '../colors';
import { GREETING_IMAGE_URL } from '../App';

interface GreetingCardProps {
  onClose: () => void;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#02040a]/80 backdrop-blur-md transition-all duration-500 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-[280px] w-full bg-white rounded-[1.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all animate-in zoom-in-90 slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Festive Header Image */}
        <div className="w-full aspect-square overflow-hidden bg-gray-100 relative">
          <img 
            src={GREETING_IMAGE_URL} 
            alt="Christmas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Text Content */}
        <div className="px-6 pb-8 pt-4 text-center bg-white">
          <h3 className="text-2xl font-bold mb-1 text-gray-800 tracking-wider">
            圣诞快乐
          </h3>
          <p className="text-[10px] font-medium text-gray-400 mb-5 tracking-[0.3em] uppercase">
            Merry Christmas
          </p>
          
          <button 
            className="mx-auto px-10 py-2.5 rounded-full text-white text-sm font-medium shadow-md transition-all hover:brightness-110 active:scale-95 flex items-center justify-center"
            style={{ backgroundColor: COLORS.accent }}
            onClick={onClose}
          >
            <span>收起</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;
