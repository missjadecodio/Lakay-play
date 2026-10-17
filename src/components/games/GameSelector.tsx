import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
  PlusCircle,
  Crown,
} from 'lucide-react';

export const GameSelector: React.FC = () => {
  const {
    setActiveGame,
    setActiveTab,
    language,
    isOwnerAuthenticated,
    gameSettings,
    customGames,
  } = useApp();

  const isMorpionActive = gameSettings.find(g => g.id === 'morpion')?.isActive ?? true;
  const isDominoActive = gameSettings.find(g => g.id === 'domino')?.isActive ?? true;
  const isQuizActive = gameSettings.find(g => g.id === 'quiz')?.isActive ?? true;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-red-950 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>{language === 'ht' ? 'Platfòm Jwèt Ayisyen #1' : 'Plateforme de Jeux Haïtienne #1'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === 'ht' ? (
              <>
                Jwe, Goumen ak Zanmi w, <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Touche Kòb Sou MonCash &amp; Natcash!
                </span>
              </>
            ) : (
              <>
                Jouez, Défiez vos Amis, <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Gagnez du Cash sur MonCash &amp; Natcash !
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {language === 'ht'
              ? 'Morpion 5 Pyon ak tchat an dirèk, Domino Ayisyen tradisyonèl, Quiz Kreyòl, ak Vant Ouzanchè. Peman ak retrè disponib 24/7 san tann!'
              : 'Morpion 5 Pions avec chat en temps réel, Domino Haïtien Double-Six, Quiz Créole et Enchères. Retraits 24h/24 sans limite !'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveGame('morpion')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-950/40 transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'ht' ? 'Jwe Morpion 5 Pyon' : 'Jouer Morpion 5 Pions'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tournaments')}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition border border-slate-700 cursor-pointer flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{language === 'ht' ? 'Wè Tournwa yo' : 'Voir les Tournois'}</span>
            </button>

            {isOwnerAuthenticated && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-3.5 rounded-2xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-2"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Panèl Mèt Sit la</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Featured Games Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {language === 'ht' ? 'Chwazi Jwèt Ou Vle Jwe a' : 'Sélectionnez votre Jeu'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ht'
                ? 'Jwe gratis pou plezi oswa mete miz an goud pou w touche lajan kach!'
                : 'Jouez gratuitement ou misez en gourdes réelles pour remporter le cash !'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerAuthenticated && (
              <button
                onClick={() => setActiveTab('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Mete Nouvo Jwèt (Mèt)</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Games Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Morpion 5 Pyon (Flagship game requested) */}
          {isMorpionActive && (
            <div className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Multijouè + Tchat An Dirèk
                  </span>
                  <span className="text-xs font-bold text-amber-400">Pri: Jiska 10,000 HTG</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-lg">
                    #5
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition">
                      Morpion 5 Pyon (Gomoku Ayiti)
                    </h3>
                    <p className="text-xs text-slate-400">Règ ofisyèl: Alinye 5 pyon pou genyen</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {language === 'ht'
                    ? 'Fè konpetisyon kont lòt jwè an liy sou yon griy 12x12. Alinye 5 pyon vètikal, orizontal oswa dyagonal epi tchat an dirèk pandan match la!'
                    : 'Affrontez des joueurs en ligne sur une grille 12x12. Alignez 5 pions consécutifs pour remporter la mise et discutez en direct !'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Mòd Gratis oswa Miz
                  </span>
                  <span>•</span>
                  <span>Tchat rapid</span>
                  <span>•</span>
                  <span>Miz depi 50 HTG</span>
                </div>
              </div>

              <button
                onClick={() => setActiveGame('morpion')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ht' ? 'Lanse Morpion 5 Pyon' : 'Lancer Morpion 5 Pions'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2. Domino Ayisyen Double-Sis */}
          {isDominoActive && (
            <div className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Jwèt Nasyonal Ayiti
                  </span>
                  <span className="text-xs font-bold text-amber-400">Double-Sis Tradisyonèl</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                    🁢
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition">
                      Domino Ayisyen (Double-Sis)
                    </h3>
                    <p className="text-xs text-slate-400">Bwòch, bouchon, pioch ak pase</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {language === 'ht'
                    ? 'Eksperyans reyèl domino ayisyen an. Chwazi pyès ou yo, mete taktik sou tab la, bwòch opozan an epi ranpòte goud yo sou plas!'
                    : 'La véritable ambiance du domino haïtien. Posez vos tuiles stratégiquement, bloquez votre adversaire et empochez vos gains !'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Mòd Gratis oswa Miz
                  </span>
                  <span>•</span>
                  <span>28 Pyès ofisyèl</span>
                </div>
              </div>

              <button
                onClick={() => setActiveGame('domino')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ht' ? 'Lanse Domino Ayisyen' : 'Lancer le Domino'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. Quiz Kreyòl & Ayiti */}
          {isQuizActive && (
            <div className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Kilti • Istwa 1804 • Konpa
                  </span>
                  <span className="text-xs font-bold text-amber-400">Pri: 2.2x Miz la</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
                    💡
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition">
                      Quiz Ayiti &amp; Kilti Kreyòl
                    </h3>
                    <p className="text-xs text-slate-400">Genyen lajan ak konesans ou</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {language === 'ht'
                    ? 'Teste memwa w sou istwa lendepandans 1804, eroz nou yo, sit istorik tankou Sitadèl, mizik konpa dirèk ak pwovèb ayisyen!'
                    : 'Testez votre culture sur l’histoire de 1804, les héros de la nation, les rythmes compas et les proverbes créoles avec gain immédiat !'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Mòd Gratis oswa Miz
                  </span>
                  <span>•</span>
                  <span>Repons eksplike</span>
                </div>
              </div>

              <button
                onClick={() => setActiveGame('quiz')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ht' ? 'Lanse Quiz Kreyòl' : 'Lancer le Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4. Vant Ouzanchè (Bid Lakay) */}
          <div className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Enchères • Ti Kòb
                </span>
                <span className="text-xs font-bold text-red-400">iPhone, Starlink, Cash</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-lg">
                  🔥
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition">
                    Bid Lakay (Vant Ouzanchè)
                  </h3>
                  <p className="text-xs text-slate-400">Mete 15 a 25 HTG pou genyen gwo lòt</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {language === 'ht'
                  ? 'Plase bid ou sou iPhone 15 Pro, Starlink Kit, moto oswa 50,000 HTG MonCash. Dènye moun ki mete bid anvan kronomèt la fini ranpòte l!'
                  : 'Placez des enchères sur des iPhones, forfaits Starlink ou 50 000 HTG cash. Le dernier enchérisseur remporte le gros lot !'}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Kronomèt an dirèk
                </span>
                <span>•</span>
                <span>Livrezon gratis</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('bids')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-red-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'ht' ? 'Ale nan Bid Lakay' : 'Accéder aux Enchères'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Any Custom Games Added by the Owner ("mete sam vle sou li") */}
          {customGames.map(cg => (
            <div
              key={cg.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all hover:-translate-y-1 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Ajoute pa Mèt Sit la
                  </span>
                  <span className="text-xs font-bold text-amber-400">{cg.category}</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img src={cg.imageUrl} alt={cg.title} className="w-12 h-12 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition">
                      {cg.title}
                    </h3>
                    <p className="text-xs text-slate-400">Miz depi {cg.minBet} HTG</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cg.rules}
                </p>
              </div>

              <button
                onClick={() => setActiveGame('morpion')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-950/40 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Jwe {cg.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
