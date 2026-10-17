import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Copy,
  CheckCheck,
  Share2,
  Gift,
  Coins,
  Sparkles,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import { getPublicAppUrl } from '../../utils/url';

export const ReferralSection: React.FC = () => {
  const { user, language, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // Dynamic public shareable link that anyone can open without login!
  const publicBaseUrl = getPublicAppUrl();
  const referralLink = `${publicBaseUrl}/?ref=${user.referralCode}`;

  const shareText =
    language === 'ht'
      ? `🇭🇹 Vin jwe Morpion 5 Pyon, Domino ak Quiz sou Lakay Play! Itilize kòd mwen an [${user.referralCode}] pou w resevwa 250 HTG kado byenvini epi fè retrè 24/7 sou MonCash ak Natcash: ${referralLink}`
      : `🇭🇹 Rejoins-moi sur Lakay Play pour jouer au Morpion 5 Pions, Domino et Quiz ! Utilise mon code [${user.referralCode}] pour recevoir 250 HTG gratuits et retirer 24/7 par MonCash/Natcash : ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast(language === 'ht' ? 'Lyen parènaj kopye ak siksè!' : 'Lien copié avec succès !', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lakay Play - Jwèt an Liy Ayiti',
          text: shareText,
          url: referralLink,
        });
      } catch (err) {
        /* User canceled share */
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 p-6 sm:p-8 text-slate-950 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 font-black text-xs uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>{language === 'ht' ? 'Sistèm Parènaj Ofisyèl' : 'Système de Parrainage'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {language === 'ht'
              ? 'Envite Zanmi w, Fè Kòb Sou Chak Enskripsyon!'
              : 'Invitez vos Amis, Gagnez à Chaque Inscription !'}
          </h2>

          <p className="mt-2 text-sm sm:text-base font-medium opacity-90 leading-relaxed">
            {language === 'ht'
              ? 'Chak fwa yon zanmi enskri ak kòd inik ou a, ou resevwa 250 HTG kach kredite otomatikman sou bous ou + 500 Pwen Lakay!'
              : 'Chaque ami inscrit avec votre code unique vous rapporte 250 HTG cash crédités instantanément + 500 Points Lakay !'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-slate-950/15 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-950/20">
              <span className="text-[11px] font-bold uppercase opacity-80">Zanmi Envite</span>
              <div className="text-2xl font-black">{user.referralCount}</div>
            </div>
            <div className="bg-slate-950/15 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-950/20">
              <span className="text-[11px] font-bold uppercase opacity-80">Gains Parènaj</span>
              <div className="text-2xl font-black">{user.totalEarningsFromReferrals.toLocaleString()} HTG</div>
            </div>
            <div className="bg-slate-950/15 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-950/20 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold uppercase opacity-80">Bonis Pou Zanmi w</span>
              <div className="text-2xl font-black">+250 HTG</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Unique Referral Code & Link Box */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>{language === 'ht' ? 'Kòd & Lyen Parènaj Pèsonèl Ou' : 'Votre Code & Lien Personnel'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ht'
              ? 'Pataje kòd sa a sou tout rezo sosyal ou yo pou w kòmanse touche kòb toutan.'
              : 'Partagez ce lien unique sur vos réseaux sociaux pour générer des gains continus.'}
          </p>
        </div>

        {/* Personalized Code Chip */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ht' ? 'Kòd Referans Ou' : 'Votre Code de Référence'}
            </span>
            <div className="text-2xl font-black tracking-widest text-amber-400 font-mono">
              {user.referralCode}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition border border-slate-700 cursor-pointer"
            >
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopye!' : 'Kopye Kòd la'}</span>
            </button>
          </div>
        </div>

        {/* Shareable Link Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
            {language === 'ht' ? 'Lyen Enskripsyon Dirèk' : 'Lien d’Inscription Direct'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs font-mono text-slate-200 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Kopye</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
            {language === 'ht' ? 'Pataje Rapid sou Rezo Sosyal yo' : 'Partager Rapidement sur les Réseaux'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={shareOnWhatsApp}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/30 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={shareOnFacebook}
              className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/30 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Facebook</span>
            </button>

            <button
              onClick={shareOnTwitter}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition border border-slate-700 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>X (Twitter)</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-900/30 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Tout Rezo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral History Preview */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
          <span>{language === 'ht' ? 'Dènye Zanmi Ou Envite' : 'Derniers Amis Invités'}</span>
          <span className="text-xs text-amber-400 font-bold">{user.referralCount} manm enskri</span>
        </h4>

        <div className="space-y-3">
          {[
            { name: 'Woody Joseph (Okap)', date: 'Jodi a, 09:30 AM', bonus: '+250 HTG', status: 'Konfime' },
            { name: 'Fabiola Chery (Pòtoprens)', date: 'Yè, 06:15 PM', bonus: '+250 HTG', status: 'Konfime' },
            { name: 'Jean-Baptiste M. (Jakmèl)', date: 'Sa gen 2 jou', bonus: '+250 HTG', status: 'Konfime' },
            { name: 'Kervens Louis (Gonaïves)', date: 'Sa gen 3 jou', bonus: '+250 HTG', status: 'Konfime' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                  🇭🇹
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-emerald-400">{item.bonus}</div>
                <div className="text-[10px] text-slate-400">{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
