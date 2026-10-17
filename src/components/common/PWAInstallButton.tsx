import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' | 'footer' }> = ({ variant = 'header' }) => {
  const { isInstalled, install } = usePWAInstall();
  const { language, showToast } = useApp();

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>{language === 'ht' ? 'Aplikasyon Enstale' : 'App Installée'}</span>
      </div>
    );
  }

  // Automatic install trigger without instruction modal
  const handleInstallClick = async () => {
    try {
      const outcome = await install();
      if (!outcome) {
        showToast(
          language === 'ht'
            ? 'Enstalasyon otomatik deklanche sou aparèy ou a!'
            : 'Installation automatique déclenchée sur votre appareil !',
          'info'
        );
      }
    } catch (e) {
      showToast('Enstalasyon an kou...', 'info');
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title={language === 'ht' ? 'Enstale Lakay Play otomatikman' : 'Installer Lakay Play automatiquement'}
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">{language === 'ht' ? 'Enstale Aplikasyon' : 'Installer l’App'}</span>
          <span className="sm:hidden">{language === 'ht' ? 'Enstale' : 'Installer'}</span>
        </button>
      )}

      {variant === 'banner' && (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all active:scale-98 cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{language === 'ht' ? 'Enstale Lakay Play Kounye a (Otomatik)' : 'Installer Lakay Play (Automatique)'}</span>
        </button>
      )}
    </>
  );
};
