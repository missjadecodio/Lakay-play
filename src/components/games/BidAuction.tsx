import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Timer, Flame, CheckCircle, Smartphone, Wifi, DollarSign, ArrowUpCircle } from 'lucide-react';

export const BidAuction: React.FC = () => {
  const { bids, placeBid, user, language } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 p-6 sm:p-8 border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider mb-3 border border-red-500/30">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'ht' ? 'Vant Ouzanchè an Dirèk' : 'Enchères en Direct'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'ht' ? 'Bid Lakay — Genyen ak Ti Kòb!' : 'Bid Lakay — Gagnez avec de Petits Montants !'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'ht'
              ? 'Chak bid ogmante pri a pa sèlman 10 a 15 Goud epi ajoute 15 segonn sou kronomèt la. Dènye moun ki mete bid anvan tan an fini ranpòte atik la ak pri redui a!'
              : 'Chaque mise augmente le prix d’une fraction et réinitialise le compte à rebours. Le dernier enchérisseur remporte le lot au prix affiché !'}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-amber-400">
            <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Sparkles className="w-4 h-4" />
              {language === 'ht' ? 'Atik 100% otantik & nouvo' : 'Articles 100% neufs & certifiés'}
            </span>
            <span className="text-slate-400">Livrezon gratis toupatou Ayiti 🇭🇹</span>
          </div>
        </div>
      </div>

      {/* Bids Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bids.map(item => {
          const isUrgent = item.secondsRemaining <= 15;

          return (
            <div
              key={item.id}
              className={`rounded-3xl bg-slate-900 border transition-all p-5 shadow-xl flex flex-col justify-between relative overflow-hidden ${
                isUrgent ? 'border-red-500/80 shadow-red-950/50 ring-1 ring-red-500/30' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Item Image */}
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-300 border border-slate-700">
                    Valè: {item.retailValueHTG.toLocaleString()} HTG
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-black text-white text-base mt-3 leading-snug">{item.title}</h3>

                {/* Countdown & Current Price */}
                <div className="my-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pri Aktyèl</span>
                    <div className="text-xl font-black text-amber-400">
                      {item.currentPriceHTG.toLocaleString()} <span className="text-xs text-white">HTG</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-end gap-1">
                      <Timer className="w-3 h-3 text-red-400" />
                      Tan Ki Rete
                    </span>
                    <div
                      className={`text-xl font-black font-mono ${
                        isUrgent ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                      }`}
                    >
                      00:{item.secondsRemaining.toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* Last Bidder Tag */}
                <div className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Dènye Bid:</span>
                  <span className="font-bold text-sky-400 truncate max-w-[150px]">{item.lastBidder}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => placeBid(item.id)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                    isUrgent
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-950/40 animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-950/30'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Mete Bid ({item.bidCostHTG} HTG)</span>
                </button>
                <div className="text-center text-[10px] text-slate-400 mt-2">
                  Total {item.totalBids} bid deja plase
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
