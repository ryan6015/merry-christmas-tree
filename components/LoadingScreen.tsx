
import React from 'react';
import { COLORS } from '../colors';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02040a] transition-opacity duration-1000">
      <div className="relative w-64 h-80 flex flex-col items-center justify-center">
        {/* Ambient Glow */}
        <div 
          className="absolute inset-0 blur-[80px] opacity-20 rounded-full animate-pulse"
          style={{ backgroundColor: COLORS.loadingTree }}
        />
        
        {/* Tree Silhouette - High Contrast */}
        <div className="relative flex flex-col items-center z-10 scale-125 filter drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          {/* Top Star */}
          <div className="w-3 h-3 bg-yellow-200 rotate-45 mb-1 animate-pulse" />
          
          {/* Layered Cones */}
          <div 
            className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-current animate-pulse"
            style={{ color: COLORS.loadingTree, animationDelay: '0s' }}
          />
          <div 
            className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[45px] border-b-current -mt-5 animate-pulse"
            style={{ color: COLORS.loadingTree, animationDelay: '0.2s' }}
          />
          <div 
            className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[60px] border-b-current -mt-7 animate-pulse"
            style={{ color: COLORS.loadingTree, animationDelay: '0.4s' }}
          />
          {/* Trunk */}
          <div className="w-5 h-8 bg-[#2d1b0f] -mt-1 rounded-sm" />
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/40 text-[10px] tracking-[0.6em] uppercase font-light mb-6">
            Summoning Winter Spirits
          </p>
          
          {/* Custom Animated Progress Bar */}
          <div className="w-40 h-[1px] bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-white/60 animate-load-progress shadow-[0_0_10px_white]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes load-progress {
          0% { width: 0%; left: -10%; }
          50% { width: 40%; left: 30%; }
          100% { width: 0%; left: 110%; }
        }
        .animate-load-progress {
          animation: load-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
