import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { PhoneCall, MessageSquare, ShieldCheck, Clock, Share2, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { supportPhone, whatsappGroupLink, setIsSupportChatOpen, language } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs pt-10 pb-24 lg:pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-3">
            <Logo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed">
              {language === 'ht'
                ? 'Lakay Play se platfòm jwèt an liy ofisyèl pou tout kominote Ayisyen an. Jwe Morpion 5 pyon, Domino, Quiz, patisipe nan gwo tournwa epi retire lajan w sou MonCash ak Natcash nenpòt lè!'
                : 'Lakay Play est la plateforme officielle de jeux en ligne pour la communauté haïtienne. Jouez au Morpion 5 pions, Domino, Quiz, tournois et retraits 24/7 sur MonCash et Natcash !'}
            </p>
            <div className="pt-2">
              <PWAInstallButton variant="header" />
            </div>
          </div>

          {/* Assistant & Contact (Highlighted as requested) */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{language === 'ht' ? 'Asistans & Kontak' : 'Assistance & Contact'}</span>
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'ht'
                ? 'Ekip nou an disponib 24 sou 24 pou ede w ak nenpòt kesyon sou jwèt oswa tranzaksyon.'
                : 'Notre équipe est à votre disposition 24h/24 pour toute assistance.'}
            </p>
            <div className="space-y-2 pt-1">
              <a
                href={`tel:${supportPhone}`}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-sm bg-slate-800 px-3 py-2 rounded-xl border border-slate-700/80 transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{supportPhone}</span>
              </a>

              <a
                href={`https://wa.me/${supportPhone.replace(/[^0-9]/g, '')}?text=Bonswa%20Lakay%20Play%2C%20mwen%20bezwen%20asistans`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-xs bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-800/40 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'ht' ? 'Ekri nou sou WhatsApp' : 'Contact WhatsApp Direct'}</span>
              </a>

              <button
                onClick={() => setIsSupportChatOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-sky-400 hover:text-sky-300 font-semibold text-xs bg-sky-950/40 px-3 py-2 rounded-xl border border-sky-800/40 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'ht' ? 'Tchat an Dirèk (Anliy)' : 'Tchat en direct'}</span>
              </button>
            </div>
          </div>

          {/* Community & WhatsApp Group */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ht' ? 'Kominote Ayiti' : 'Communauté Haïti'}</span>
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'ht'
                ? 'Rejwenn kominote WhatsApp nou an pou resevwa alèt nouvo tournwa, kòd promo ak prèv peman!'
                : 'Rejoignez le groupe WhatsApp officiel pour les alertes tournois, codes promo et preuves de paiement !'}
            </p>
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'ht' ? 'Rejwenn Gwoup WhatsApp la' : 'Rejoindre le Groupe WhatsApp'}</span>
            </a>
            <div className="text-[11px] text-slate-400 pt-1">
              ✨ Plis pase 8,500 manm aktif nan kominote a!
            </div>
          </div>

          {/* Payments & Security */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">
              {language === 'ht' ? 'Mwayen Peman Sekirize' : 'Paiements Sécurisés'}
            </h4>
            <p className="text-xs text-slate-400">
              {language === 'ht'
                ? 'Depo ak retrè disponib 24 sou 24, 7 jou sou 7 san tann.'
                : 'Dépôts et retraits disponibles 24h/24, 7j/7 instantanément.'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-white">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-[10px] flex items-center justify-center">
                  MC
                </div>
                <div>
                  <div className="font-bold text-xs">MonCash</div>
                  <div className="text-[9px] text-slate-400">Digicel Ayiti</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-white">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                  NC
                </div>
                <div>
                  <div className="font-bold text-xs">Natcash</div>
                  <div className="text-[9px] text-slate-400">Natcom Ayiti</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'ht' ? 'Retrè tout lè (24/7)' : 'Retraits 24h/24 sans limite'}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Chifreman SSL 256-bit sekirize</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <p>© {new Date().getFullYear()} Lakay Play Ayiti. Tout dwa rezève.</p>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-medium">Ayiti Chérie 🇭🇹</span>
            <span>•</span>
            <span className="text-slate-400">Morpion 5 Pyon • Domino • Quiz • Bid</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
