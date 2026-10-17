import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gamepad2, Trophy, Sparkles, Users, Wallet, Crown, Lock } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setActiveGame,
    isOwnerAuthenticated,
    setIsOwnerModalOpen,
    language,
  } = useApp();

  const handleAdminClick = () => {
    if (isOwnerAuthenticated) {
      setActiveTab('admin');
      setActiveGame(null);
    } else {
      setIsOwnerModalOpen(true);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 py-2 px-3 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => {
          setActiveTab('games');
          setActiveGame(null);
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'games' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Gamepad2 className={`w-5 h-5 ${activeTab === 'games' ? 'stroke-[2.5]' : ''}`} />
        <span>{language === 'ht' ? 'Jwèt' : 'Jeux'}</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('tournaments');
          setActiveGame(null);
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'tournaments' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Trophy className={`w-5 h-5 ${activeTab === 'tournaments' ? 'stroke-[2.5]' : ''}`} />
        <span>{language === 'ht' ? 'Tournwa' : 'Tournois'}</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('bids');
          setActiveGame(null);
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'bids' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sparkles className={`w-5 h-5 ${activeTab === 'bids' ? 'stroke-[2.5]' : ''}`} />
        <span>{language === 'ht' ? 'Bid' : 'Enchères'}</span>
      </button>

      <button
        onClick={() => setActiveTab('referral')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'referral' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Users className={`w-5 h-5 ${activeTab === 'referral' ? 'stroke-[2.5]' : ''}`} />
        <span>{language === 'ht' ? 'Parènaj' : 'Parrainage'}</span>
      </button>

      <button
        onClick={() => setActiveTab('wallet')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'wallet' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Wallet className={`w-5 h-5 ${activeTab === 'wallet' ? 'stroke-[2.5]' : ''}`} />
        <span>{language === 'ht' ? 'Bous' : 'Caisse'}</span>
      </button>

      <button
        onClick={handleAdminClick}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition cursor-pointer ${
          activeTab === 'admin' ? 'text-red-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {isOwnerAuthenticated ? (
          <Crown className="w-5 h-5 text-amber-400" />
        ) : (
          <Lock className="w-5 h-5 text-slate-400" />
        )}
        <span>{isOwnerAuthenticated ? 'Mèt Sit' : 'Responsab'}</span>
      </button>
    </div>
  );
};
