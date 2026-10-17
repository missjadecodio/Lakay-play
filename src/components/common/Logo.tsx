import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      {/* Visual Emblem */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-red-700 p-0.5 shadow-lg shadow-blue-950/60 transition-transform group-hover:scale-105`}>
        <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center overflow-hidden relative">
          <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" fill="none">
            {/* Palm & Shield emblem */}
            <circle cx="50" cy="50" r="44" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.8" />
            <path d="M50 30 Q49 55 50 72" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
            {/* Palm leaves */}
            <path d="M50 32 Q35 22 24 30" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 32 Q65 22 76 30" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 32 Q40 16 32 20" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M50 32 Q60 16 68 20" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
            {/* Morpion dot & Domino pip */}
            <circle cx="32" cy="54" r="5" fill="#EF4444" />
            <circle cx="68" cy="54" r="5" fill="#3B82F6" />
            <polygon points="50,15 52,20 57,20 53,23 55,28 50,25 45,28 47,23 43,20 48,20" fill="#FBBF24" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`font-black tracking-tight ${textSizes[size]} text-white flex items-center gap-1.5`}>
          <span>LAKAY</span>
          <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">PLAY</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-600/30 text-red-400 font-bold border border-red-500/30 uppercase tracking-widest ml-1">
            HT
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Jwèt &amp; Paryaj Ayiti
          </span>
        )}
      </div>
    </div>
  );
};
