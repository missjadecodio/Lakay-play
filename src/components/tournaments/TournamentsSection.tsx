import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tournament } from '../../types';
import {
  Trophy,
  Users,
  Coins,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  Gamepad2,
  Clock,
  Shield,
  ArrowRight,
  Crown,
  Trash2,
  Lock,
} from 'lucide-react';

export const TournamentsSection: React.FC = () => {
  const {
    tournaments,
    registerTournament,
    deleteTournament,
    user,
    language,
    setActiveGame,
    setActiveTab,
    isOwnerAuthenticated,
    setIsOwnerModalOpen,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'morpion' | 'domino' | 'quiz'>('all');

  const filteredTournaments = tournaments.filter(t => {
    if (filter === 'all') return true;
    return t.game === filter;
  });

  const getGameLabel = (game: Tournament['game']) => {
    switch (game) {
      case 'morpion':
        return 'Morpion 5 Pyon';
      case 'domino':
        return 'Domino Double-Sis';
      case 'quiz':
        return 'Quiz Kreyòl & Ayiti';
      default:
        return game;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tournaments Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-amber-950/80 border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'ht' ? 'Chanpyona Ofisyèl Lakay' : 'Championnats Officiels'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'ht' ? 'Gwo Tournwa Lakay Play' : 'Grands Tournois Lakay Play'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'ht'
              ? 'Se sèl responsab sit la ki ka kreye nouvo tournwa. Tout jwè ka enskri ak yon sèl klik pou yo patisipe epi goumen pou gwo pakèt lajan kach!'
              : 'Seul le propriétaire du site peut créer des tournois officiels. Tous les joueurs peuvent s’inscrire en 1 clic pour décrocher le gros lot !'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Plis pase 150,000 HTG nan pri chak semèn</span>
            </div>

            {isOwnerAuthenticated ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Kreye Nouvo Tournwa (Mèt Sit la)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsOwnerModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Se Mèt la Ki Kreye Tournwa</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'all', label: language === 'ht' ? 'Tout Tournwa' : 'Tous les Tournois' },
          { id: 'morpion', label: 'Morpion 5 Pyon' },
          { id: 'domino', label: 'Domino Ayisyen' },
          { id: 'quiz', label: 'Quiz Kreyòl' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filter === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTournaments.map(tournament => {
          const isRegistered = tournament.registeredUserIds.includes(user.id);
          const percentFilled = Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100);

          return (
            <div
              key={tournament.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 group relative"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-950/60 text-sky-400 border border-blue-800/40">
                    {getGameLabel(tournament.game)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        tournament.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {tournament.status === 'active' ? '● Aktif Kounye a' : 'Vini Byento'}
                    </span>
                    {isOwnerAuthenticated && (
                      <button
                        onClick={() => deleteTournament(tournament.id)}
                        className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition cursor-pointer"
                        title="Efase tournwa sa a"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition leading-snug">
                  {language === 'ht' ? tournament.title : tournament.titleFr}
                </h3>

                {/* Prize Pool Spotlight */}
                <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pri Total (Cagnotte)</span>
                    <div className="text-xl font-black text-amber-400">
                      {tournament.prizePoolHTG.toLocaleString()} <span className="text-xs text-white">HTG</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>

                {/* Tournament details */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      Frè Enskripsyon :
                    </span>
                    <span className="font-bold text-white">
                      {tournament.entryFeeHTG === 0 ? 'GRATIS' : `${tournament.entryFeeHTG.toLocaleString()} HTG`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      Kòmansman :
                    </span>
                    <span className="font-semibold text-slate-200">{tournament.startDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Patisipan :
                    </span>
                    <span className="font-bold text-emerald-400">
                      {tournament.currentParticipants} / {tournament.maxParticipants} jwè
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-2 mt-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                {isRegistered ? (
                  <button
                    onClick={() => setActiveGame(tournament.game)}
                    className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ou Enskri! Ale nan Jwèt la</span>
                  </button>
                ) : (
                  <button
                    onClick={() => registerTournament(tournament.id)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/30 transition cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>
                      {tournament.entryFeeHTG === 0
                        ? 'Enskri Gratis Kounye a'
                        : `Enskri (${tournament.entryFeeHTG} HTG)`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
