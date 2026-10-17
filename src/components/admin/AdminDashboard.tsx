import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tournament, CustomGame, BidItem } from '../../types';
import {
  ShieldAlert,
  Trophy,
  PlusCircle,
  Wallet,
  Users,
  Send,
  CheckCircle2,
  Trash2,
  Coins,
  Settings,
  Bell,
  Smartphone,
  Flame,
  Gamepad2,
  ArrowDownLeft,
  ArrowUpRight,
  Crown,
  Lock,
  Layers,
  Copy,
  Share2,
  Check,
  Clock,
  AlertCircle,
  CheckSquare,
  XSquare,
} from 'lucide-react';
import { getPublicAppUrl } from '../../utils/url';

export const AdminDashboard: React.FC = () => {
  const {
    tournaments,
    createTournament,
    deleteTournament,
    transactions,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    manualCreditUser,
    addNotification,
    user,
    gameSettings,
    toggleGameStatus,
    customGames,
    addCustomGame,
    deleteCustomGame,
    bids,
    createBidItem,
    deleteBidItem,
    siteSettings,
    updateSiteSettings,
    logoutOwner,
    language,
    showToast,
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'transactions' | 'tournaments' | 'games' | 'bids' | 'settings'>('transactions');

  // Tournament Form
  const [tTitle, setTTitle] = useState('');
  const [tTitleFr, setTTitleFr] = useState('');
  const [tGame, setTGame] = useState<'morpion' | 'domino' | 'quiz'>('morpion');
  const [tEntryFee, setTEntryFee] = useState('100');
  const [tPrizePool, setTPrizePool] = useState('25000');
  const [tMaxParts, setTMaxParts] = useState('64');
  const [tStartDate, setTStartDate] = useState('Samdi k ap vini an a 8:00 PM');

  // Add Custom Game Form
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameCategory, setNewGameCategory] = useState('Kat & Estrateji');
  const [newGameMinBet, setNewGameMinBet] = useState('5');
  const [newGameMaxBet, setNewGameMaxBet] = useState('1000');
  const [newGameImage, setNewGameImage] = useState('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80');
  const [newGameRules, setNewGameRules] = useState('');

  // Add Bid Form
  const [bidTitle, setBidTitle] = useState('');
  const [bidImage, setBidImage] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80');
  const [bidValue, setBidValue] = useState('45000');
  const [bidStartPrice, setBidStartPrice] = useState('50');
  const [bidCost, setBidCost] = useState('10');
  const [bidSeconds, setBidSeconds] = useState('120');

  // Manual Credit Form
  const [creditPhone, setCreditPhone] = useState('+509 4653 2833');
  const [creditAmount, setCreditAmount] = useState('500');
  const [creditReason, setCreditReason] = useState('Kredi Manyèl pa Mèt la');

  // Site Settings Form
  const [assistantPhone, setAssistantPhone] = useState(siteSettings.assistantPhone);
  const [moncashPhone, setMoncashPhone] = useState(siteSettings.moncashReceiverPhone || siteSettings.assistantPhone);
  const [natcashPhone, setNatcashPhone] = useState(siteSettings.natcashReceiverPhone || siteSettings.assistantPhone);
  const [whatsappUrl, setWhatsappUrl] = useState(siteSettings.whatsappGroupUrl);
  const [announcement, setAnnouncement] = useState(siteSettings.announcementBanner);
  const [newPin, setNewPin] = useState(siteSettings.ownerPin);
  const [autoApprove, setAutoApprove] = useState(siteSettings.autoApproveDeposits);

  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim()) {
      showToast('Tanpri mete yon non pou tournwa a.', 'error');
      return;
    }
    createTournament({
      title: tTitle,
      titleFr: tTitleFr || tTitle,
      game: tGame,
      entryFeeHTG: parseFloat(tEntryFee) || 0,
      prizePoolHTG: parseFloat(tPrizePool) || 10000,
      maxParticipants: parseInt(tMaxParts) || 32,
      startDate: tStartDate,
    });
    setTTitle('');
    setTTitleFr('');
  };

  const handleAddCustomGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameTitle.trim()) {
      showToast('Mete yon non pou nouvo jwèt la.', 'error');
      return;
    }
    addCustomGame({
      title: newGameTitle,
      category: newGameCategory,
      minBet: parseFloat(newGameMinBet) || 5,
      maxBet: parseFloat(newGameMaxBet) || 1000,
      imageUrl: newGameImage,
      status: 'available',
      rules: newGameRules || 'Règ ofisyèl Lakay Play.',
    });
    setNewGameTitle('');
    setNewGameRules('');
  };

  const handleAddBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidTitle.trim()) return;
    createBidItem({
      title: bidTitle,
      imageUrl: bidImage,
      retailValueHTG: parseFloat(bidValue) || 10000,
      currentPriceHTG: parseFloat(bidStartPrice) || 50,
      bidCostHTG: parseFloat(bidCost) || 10,
      secondsRemaining: parseInt(bidSeconds) || 120,
    });
    setBidTitle('');
  };

  const handleCredit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0) return;
    manualCreditUser(creditPhone, amt, creditReason);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      assistantPhone,
      moncashReceiverPhone: moncashPhone,
      natcashReceiverPhone: natcashPhone,
      whatsappGroupUrl: whatsappUrl,
      announcementBanner: announcement,
      ownerPin: newPin,
      autoApproveDeposits: autoApprove,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Master Owner Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 border-2 border-red-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-black uppercase tracking-wider mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Panèl Mèt &amp; Responsab Sit la (Slayer - Lakay Play)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Kontwòl Total Platfòm nan
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Kòm sèl mèt sit la, se ou sèl ki ka kreye tournwa, valide depo MonCash &amp; Natcash reyèl, voye retrè bay jwè yo, epi ajoute nouvo jwèt.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
              <span className="text-amber-400 font-bold bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                👑 Mèt Sit la: Slayer
              </span>
              <span className="text-emerald-400 font-bold bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                📞 Nimewo Peman: {siteSettings.assistantPhone}
              </span>
              <span className="text-sky-400 font-bold bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
                {pendingDeposits.length} Depo k ap tann • {pendingWithdrawals.length} Retrè k ap tann
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={logoutOwner}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              Fèmen Mòd Mèt la
            </button>
          </div>
        </div>

        {/* Global Real Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Depo Pandan (K ap tann)</span>
            <div className="text-xl font-black text-amber-400">
              {pendingDeposits.length} ({pendingDeposits.reduce((sum, t) => sum + t.amountHTG, 0).toLocaleString()} HTG)
            </div>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Retrè Pandan (Pou Voye)</span>
            <div className="text-xl font-black text-red-400">
              {pendingWithdrawals.length} ({pendingWithdrawals.reduce((sum, t) => sum + t.amountHTG, 0).toLocaleString()} HTG)
            </div>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tournwa Ou Kreye</span>
            <div className="text-xl font-black text-sky-400">{tournaments.length} tournwa</div>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tranzaksyon Total</span>
            <div className="text-xl font-black text-emerald-400">{transactions.length} tranzaksyon</div>
          </div>
        </div>

        {/* Public Shareable Link Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                🌐 Lyen Piblik Sit la (Voye bay tout moun) :
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Aksè Lib Pou Nenpòt Moun
              </span>
            </div>
            <div className="font-mono text-xs text-amber-300 mt-1 select-all break-all font-bold">
              {getPublicAppUrl()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              ⚠️ Pa voye lyen ki fini ak &quot;ais-dev-...&quot; paske Google bloke lòt moun sou li! Voye lyen piblik sa a ki gen &quot;ais-pre-...&quot; pou nenpòt moun ka monte sou sit la dirèkteman san mande modpas Google.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText(getPublicAppUrl());
                showToast('Lyen piblik la kopye! Ou ka voye l bay nenpòt moun kounye a.', 'success');
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span>Kopye Lyen Piblik la</span>
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                '🇭🇹 Vin jwe sou Lakay Play! Morpion 5 Pyon, Domino, Quiz ak peman MonCash/Natcash: ' + getPublicAppUrl()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Pataje sou WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Admin Navigation Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800">
        {[
          { id: 'transactions', label: `1. Valide Peman (${pendingDeposits.length + pendingWithdrawals.length})`, icon: Wallet },
          { id: 'tournaments', label: '2. Kreye & Jere Tournwa', icon: Trophy },
          { id: 'games', label: '3. Jere Jwèt & Ajoute Nouvo', icon: Gamepad2 },
          { id: 'bids', label: '4. Jere Vant Ouzanchè (Bid)', icon: Flame },
          { id: 'settings', label: '5. Paramèt & WhatsApp', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTabSection === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REAL TRANSACTIONS & APPROVALS */}
      {activeTabSection === 'transactions' && (
        <div className="space-y-6">
          {/* 1. Pending Deposits Section */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">
                  Depo k ap Tann Verifikasyon Ou ({pendingDeposits.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Verifye SMS MonCash/Natcash sou telefòn ou anvan w klike &quot;Valide&quot;
              </span>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Pa gen okenn depo k ap tann verifikasyon pou moman an.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDeposits.map(tx => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">
                          Depo {tx.amountHTG.toLocaleString()} HTG pa {tx.method?.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                          ⏳ Ap Tann Konfimasyon
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                        <p>
                          Nimewo Moun nan: <strong className="text-amber-400">{tx.phone || tx.senderPhone}</strong>
                        </p>
                        <p>
                          Kòd SMS Transfè a: <code className="text-emerald-400 font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded">{tx.smsTransactionCode || 'Pa bay kòd'}</code>
                        </p>
                        <p className="text-[11px] text-slate-400">Dat: {tx.date} • Ref: {tx.referenceNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => approveDeposit(tx.id)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>Valide Depo a (Kredite {tx.amountHTG} HTG)</span>
                      </button>
                      <button
                        onClick={() => rejectDeposit(tx.id)}
                        className="px-3 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold transition cursor-pointer"
                      >
                        Rejte
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Pending Withdrawals Section */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">
                  Demann Retrè Jwè Yo ({pendingWithdrawals.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Fè transfè a sou telefòn moun nan via MonCash/Natcash epi klike &quot;Make Kòm Peye&quot;
              </span>
            </div>

            {pendingWithdrawals.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Pa gen okenn demann retrè k ap tann pou moman an.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingWithdrawals.map(tx => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-red-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">
                          Retrè {tx.amountHTG.toLocaleString()} HTG sou {tx.method?.toUpperCase()}
                        </span>
                        <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold">
                          🚨 Pou Peye
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                        <p>
                          Voye kòb la sou nimewo sa a:{' '}
                          <strong className="text-amber-400 font-mono text-sm">{tx.phone}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">Dat: {tx.date} • Ref: {tx.referenceNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => approveWithdrawal(tx.id)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>Make Kòm Peye / Voye ({tx.amountHTG} HTG)</span>
                      </button>
                      <button
                        onClick={() => rejectWithdrawal(tx.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition cursor-pointer"
                        title="Rejte epi ranbouse jwè a"
                      >
                        Rejte &amp; Ranbouse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Manual Credit Form */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-white text-base">Kredite Kont Yon Jwè Alamen (Manual Credit)</h3>
            </div>

            <form onSubmit={handleCredit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nimewo Telefòn Jwè a</label>
                <input
                  type="text"
                  value={creditPhone}
                  onChange={e => setCreditPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Montan pou Kredite (HTG)</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={e => setCreditAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="sm:self-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kredite Kont Jwè a Kounye a</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: TOURNAMENTS */}
      {activeTabSection === 'tournaments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator Form */}
          <div className="lg:col-span-1 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-white text-base">Kreye Nouvo Tournwa</h3>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tit Tournwa a (Kreyòl)</label>
                <input
                  type="text"
                  value={tTitle}
                  onChange={e => setTTitle(e.target.value)}
                  placeholder="eg: Gran Koup Morpion 5 Pyon Delmas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Jwèt Tournwa a</label>
                <select
                  value={tGame}
                  onChange={e => setTGame(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="morpion">Morpion 5 Pyon (Gomoku)</option>
                  <option value="domino">Domino Double-Sis Ayiti</option>
                  <option value="quiz">Quiz Kreyòl &amp; Ayiti 1804</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Frè Enskripsyon (HTG)</label>
                  <input
                    type="number"
                    value={tEntryFee}
                    onChange={e => setTEntryFee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Pri Total (Cagnotte HTG)</label>
                  <input
                    type="number"
                    value={tPrizePool}
                    onChange={e => setTPrizePool(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Limit Jwè (Max)</label>
                  <input
                    type="number"
                    value={tMaxParts}
                    onChange={e => setTMaxParts(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dat &amp; Lè Match la</label>
                  <input
                    type="text"
                    value={tStartDate}
                    onChange={e => setTStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-amber-950/40"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pibliye Tournwa Sa a Kounye a</span>
              </button>
            </form>
          </div>

          {/* Tournaments List */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-black text-white text-base">Tournwa Ki Sou Sit la Kounye a ({tournaments.length})</h3>

            <div className="space-y-3">
              {tournaments.map(t => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.title}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        {t.game.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1 space-x-2">
                      <span>Pri: <strong className="text-amber-400">{t.prizePoolHTG.toLocaleString()} HTG</strong></span>
                      <span>•</span>
                      <span>Enskripsyon: {t.entryFeeHTG} HTG</span>
                      <span>•</span>
                      <span>Patisipan: {t.currentParticipants}/{t.maxParticipants}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Dat: {t.startDate}</div>
                  </div>

                  <button
                    onClick={() => deleteTournament(t.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-950/40 border border-red-800/40 transition cursor-pointer"
                    title="Efase tournwa sa a"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM GAMES */}
      {activeTabSection === 'games' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-black text-white text-base">Aktive / Dezaktive Jwèt Ofisyèl Yo</h3>
            <div className="space-y-3">
              {gameSettings.map(game => (
                <div
                  key={game.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{game.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          game.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {game.isActive ? 'Aktif sou sit la' : 'Dezaktive'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1">{game.description}</p>
                  </div>

                  <button
                    onClick={() => toggleGameStatus(game.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                      game.isActive
                        ? 'bg-red-950 text-red-300 border border-red-800 hover:bg-red-900'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {game.isActive ? 'Dezaktive' : 'Aktive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-black text-white text-base">Ajoute Nouvo Jwèt Pa Ou</h3>
            <form onSubmit={handleAddCustomGame} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Non Jwèt la</label>
                <input
                  type="text"
                  value={newGameTitle}
                  onChange={e => setNewGameTitle(e.target.value)}
                  placeholder="eg: Kazino Lakay, Domino 4 Men"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Kategori</label>
                <input
                  type="text"
                  value={newGameCategory}
                  onChange={e => setNewGameCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Miz Minimòm (HTG)</label>
                  <input
                    type="number"
                    value={newGameMinBet}
                    onChange={e => setNewGameMinBet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Miz Maksimòm (HTG)</label>
                  <input
                    type="number"
                    value={newGameMaxBet}
                    onChange={e => setNewGameMaxBet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mete Nouvo Jwèt Sa a Sou Sit la</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: BIDS */}
      {activeTabSection === 'bids' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-black text-white text-base">Ajoute Nouvo Atik Vant Ouzanchè</h3>

            <form onSubmit={handleAddBid} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Non Atik la</label>
                <input
                  type="text"
                  value={bidTitle}
                  onChange={e => setBidTitle(e.target.value)}
                  placeholder="eg: Moto Haojue 125cc Tou Nèf"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Lyen Imaj Atik la (URL)</label>
                <input
                  type="text"
                  value={bidImage}
                  onChange={e => setBidImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Valè Reyèl (HTG)</label>
                  <input
                    type="number"
                    value={bidValue}
                    onChange={e => setBidValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kou pou chak Bid (HTG)</label>
                  <input
                    type="number"
                    value={bidCost}
                    onChange={e => setBidCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pibliye Atik Ouzanchè a</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="font-black text-white text-base">Atik Ouzanchè Ki Sou Sit la ({bids.length})</h3>

            <div className="space-y-3">
              {bids.map(b => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={b.imageUrl} alt={b.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-white text-sm">{b.title}</div>
                      <div className="text-slate-400 text-[11px]">
                        Valè: {b.retailValueHTG.toLocaleString()} HTG • Pri kounye a: <strong className="text-amber-400">{b.currentPriceHTG} HTG</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteBidItem(b.id)}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-950/40 border border-red-800/40 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GENERAL SETTINGS */}
      {activeTabSection === 'settings' && (
        <div className="max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-black text-white text-base">Paramèt Peman &amp; Nimewo Asistans</h3>
              <p className="text-xs text-slate-400">Modifye nimewo w, lyen WhatsApp ak kòd PIN aksè responsab la.</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Nimewo Asistans &amp; Apèl</label>
              <input
                type="text"
                value={assistantPhone}
                onChange={e => setAssistantPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nimewo Pou Resevwa MonCash</label>
                <input
                  type="text"
                  value={moncashPhone}
                  onChange={e => setMoncashPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nimewo Pou Resevwa Natcash</label>
                <input
                  type="text"
                  value={natcashPhone}
                  onChange={e => setNatcashPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Lyen Gwoup WhatsApp Lakay Play Ou</label>
              <input
                type="text"
                value={whatsappUrl}
                onChange={e => setWhatsappUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Bannè Anons Ofisyèl (Anlè Sit la)</label>
              <textarea
                rows={2}
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Kòd Sekrè PIN Ou (Aksè Responsab)</label>
              <input
                type="text"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Kredi Depo Otomatik (Auto-Credit)</span>
                <span className="text-[11px] text-slate-400">
                  Si w dezaktive l, se ou ki dwe klike &quot;Valide Depo&quot; alamen pou chak moun.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={e => setAutoApprove(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
            >
              Anrejistre Tout Chanjman Yo
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
