import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Wallet,
  Bell,
  MessageSquare,
  ShieldAlert,
  Globe,
  PlusCircle,
  PhoneCall,
  CheckCircle2,
  Trophy,
  Users,
  Sparkles,
  Smartphone,
  Crown,
  Lock,
  Share2,
} from 'lucide-react';
import { getPublicAppUrl } from '../../utils/url';

export const Header: React.FC = () => {
  const {
    user,
    language,
    setLanguage,
    notifications,
    markNotificationRead,
    clearNotifications,
    activeTab,
    setActiveTab,
    setActiveGame,
    isOwnerAuthenticated,
    setIsOwnerModalOpen,
    setIsSupportChatOpen,
    siteSettings,
    showToast,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleLanguage = () => {
    const nextLang = language === 'ht' ? 'fr' : 'ht';
    setLanguage(nextLang);
    showToast(nextLang === 'ht' ? 'Lang chanje an Kreyòl' : 'Langue changée en Français', 'info');
  };

  const handleOwnerClick = () => {
    if (isOwnerAuthenticated) {
      setActiveTab('admin');
      setActiveGame(null);
      showToast('Ou nan Panèl Mèt Sit la 👑', 'info');
    } else {
      setIsOwnerModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Top Announcement Ribbon from Owner */}
      {siteSettings.showAnnouncement && siteSettings.announcementBanner && (
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-slate-950 text-xs font-black py-1 px-4 text-center overflow-hidden whitespace-nowrap text-ellipsis">
          <span>{siteSettings.announcementBanner}</span>
        </div>
      )}

      {/* Top micro bar for Assistant contact & WhatsApp group */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-red-950 text-slate-300 text-[11px] px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-slate-800/60 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <a
            href={`tel:${siteSettings.assistantPhone}`}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Asistans: {siteSettings.assistantPhone}</span>
          </a>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <a
            href={siteSettings.whatsappGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Gwoup WhatsApp Lakay Play</span>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Public Share Button */}
          <button
            onClick={() => {
              const url = getPublicAppUrl();
              navigator.clipboard.writeText(url);
              showToast('Lyen piblik sit la kopye! Nenpòt moun ka ouvri l dirèkteman.', 'success');
            }}
            className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg font-bold transition cursor-pointer"
            title="Kopye lyen piblik pou voye bay zanmi w"
          >
            <Share2 className="w-3 h-3 text-amber-400" />
            <span>Kopye Lyen Piblik</span>
          </button>

          {/* Secure Owner Access button */}
          <button
            onClick={handleOwnerClick}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition border flex items-center gap-1 cursor-pointer ${
              isOwnerAuthenticated
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-red-950/60 text-red-300 border-red-800/60 hover:bg-red-900/50'
            }`}
          >
            {isOwnerAuthenticated ? (
              <>
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Mèt Sit la (Admin)</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>Aksè Responsab</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div
          onClick={() => {
            setActiveTab('games');
            setActiveGame(null);
          }}
        >
          <Logo size="md" />
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('games');
              setActiveGame(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'games' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {language === 'ht' ? 'Jwèt yo' : 'Jeux'}
          </button>
          <button
            onClick={() => {
              setActiveTab('tournaments');
              setActiveGame(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'tournaments' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {language === 'ht' ? 'Tournwa' : 'Tournois'}
          </button>
          <button
            onClick={() => {
              setActiveTab('bids');
              setActiveGame(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'bids' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {language === 'ht' ? 'Bid Ouzanchè' : 'Enchères'}
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'referral' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {language === 'ht' ? 'Parènaj (Fè Kòb)' : 'Parrainage'}
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'wallet' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            {language === 'ht' ? 'Bous' : 'Caisse'}
          </button>
          {isOwnerAuthenticated && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/50'
                  : 'text-amber-400 hover:bg-red-950/40'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Panèl Mèt</span>
            </button>
          )}
        </nav>

        {/* Right side: Balance + Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User balance pill */}
          <div
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800/90 hover:from-slate-800 hover:to-slate-700/90 border border-slate-700/80 px-2.5 sm:px-3 py-1 rounded-xl cursor-pointer shadow-inner transition"
            title="Klike pou wè bous ou"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                {language === 'ht' ? 'Balans' : 'Solde'}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 leading-tight">
                {user.balanceHTG.toLocaleString()} <span className="text-[10px] text-slate-300">HTG</span>
              </span>
            </div>
            <div className="hidden md:flex flex-col text-left border-l border-slate-700 pl-2">
              <span className="text-[9px] text-slate-400 font-semibold uppercase leading-none">Pwen</span>
              <span className="text-xs font-bold text-sky-400 leading-tight">
                {user.points.toLocaleString()}
              </span>
            </div>
            <PlusCircle className="w-4 h-4 text-emerald-400 hidden sm:block" />
          </div>

          {/* Fast deposit button */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === 'ht' ? 'Depo' : 'Dépôt'}</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Chanje Lang (Kreyòl / Français)"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Live Chat Assistant Button */}
          <button
            onClick={() => setIsSupportChatOpen(true)}
            className="relative p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition cursor-pointer"
            title={language === 'ht' ? 'Tchat Asistans 24/7' : 'Chat Assistance 24/7'}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition relative cursor-pointer"
              title="Notifikasyon"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">Notifikasyon</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} nouvo
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition"
                    >
                      Efase tout
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Pa gen okenn notifikasyon pou moman an.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                          notif.read
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                            : 'bg-slate-800/80 border-amber-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white flex items-center gap-1.5">
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
