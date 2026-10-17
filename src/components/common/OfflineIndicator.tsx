import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useApp();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/95 text-slate-950 font-bold px-4 py-2.5 text-xs shadow-2xl border border-amber-300 backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4 text-slate-950" />
      <span>
        {language === 'ht'
          ? 'Mòd Oflayn — Done yo kach sou aparèy ou a'
          : 'Mode Hors-ligne — Données locales synchronisées'}
      </span>
    </div>
  );
};
