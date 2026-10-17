import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallButton } from './PWAInstallButton';
import { Sparkles, X, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const { language } = useApp();

  if (isInstalled || dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-red-950/70 border border-amber-500/30 p-4 sm:p-5 shadow-xl my-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
        title="Fèmen"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                {language === 'ht' ? 'Enstale Lakay Play sou Telefòn Ou' : 'Installez Lakay Play sur votre Mobile'}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PWA Rapid
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {language === 'ht'
                ? 'Jwe Morpion 5 pyon, Domino, Quiz san entèripsyon epi resevwa notifikasyon peman MonCash ak Natcash an tan reyèl!'
                : 'Jouez au Morpion 5 pions, Domino, Quiz et recevez vos alertes de paiement MonCash & Natcash instantanément !'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-amber-400/90 font-medium">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {language === 'ht' ? '0 Megabayt gaspiye' : 'Ultra léger & fluide'}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'ht' ? 'Peman sekirize 100%' : 'Paiements 100% sécurisés'}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 sm:min-w-[200px]">
          <PWAInstallButton variant="banner" />
        </div>
      </div>
    </div>
  );
};
