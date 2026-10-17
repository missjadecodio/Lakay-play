import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageSquare,
  Lock,
} from 'lucide-react';

export const WalletSection: React.FC = () => {
  const {
    user,
    transactions,
    depositFunds,
    withdrawFunds,
    language,
    siteSettings,
    showToast,
    isOwnerAuthenticated,
    setActiveTab,
  } = useApp();

  const [activeMode, setActiveMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('moncash');
  const [amount, setAmount] = useState<string>('100');
  const [phone, setPhone] = useState<string>(user.phone || '');
  const [trxId, setTrxId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [recentMessage, setRecentMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const presets = [25, 50, 100, 250, 500, 1000, 2500, 5000];

  const officialReceiver =
    selectedMethod === 'moncash'
      ? siteSettings.moncashReceiverPhone || siteSettings.assistantPhone || '+50946532833'
      : siteSettings.natcashReceiverPhone || siteSettings.assistantPhone || '+50946532833';

  const handleCopyReceiver = () => {
    navigator.clipboard.writeText(officialReceiver.replace(/[^0-9]/g, ''));
    setCopiedNumber(true);
    showToast(`Nimewo ${selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'} kopye!`, 'success');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Tanpri antre yon montan valab.', 'error');
      return;
    }

    if (!phone || phone.trim().length < 8) {
      showToast('Tanpri antre yon nimewo telefòn Ayiti valab (eg: 46532833).', 'error');
      return;
    }

    setLoading(true);
    setRecentMessage(null);

    if (activeMode === 'deposit') {
      try {
        const res = await depositFunds(numAmount, selectedMethod, phone.trim(), trxId.trim());
        if (res.requiresApproval) {
          setRecentMessage({
            type: 'info',
            text: `Demann depo ${numAmount.toLocaleString()} HTG pa ${
              selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'
            } anrejistre ak siksè! Mèt sit la ap verifye transfè ou a sou nimewo ${officialReceiver} pou l kredite kont ou.`,
          });
        } else {
          setRecentMessage({
            type: 'success',
            text: `Depo ${numAmount.toLocaleString()} HTG pa ${
              selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'
            } konfime epi kredite sou bous ou!`,
          });
        }
        setTrxId('');
      } catch (err) {
        showToast('Erè pandan anrejistreman depo a.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await withdrawFunds(numAmount, selectedMethod, phone.trim());
        if (res.success) {
          setRecentMessage({
            type: 'success',
            text: `Demann retrè ${numAmount.toLocaleString()} HTG sou nimewo ${phone} pa ${
              selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'
            } anrejistre (24/7)! Mèt sit la ap transfere kòb la sou kont ou kounye a.`,
          });
        } else {
          showToast(res.message, 'error');
        }
      } catch (err) {
        showToast('Erè pandan demann retrè a.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wallet Balance Hero Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-red-950 border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>{language === 'ht' ? 'Bous Lakay Play Ou' : 'Votre Portefeuille'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Kès Reyèl (HTG)
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                {user.balanceHTG.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-400">HTG</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="text-slate-400">
                Pwen Lakay: <strong className="text-sky-400 font-bold">{user.points.toLocaleString()} pts</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {language === 'ht' ? 'Retrè disponib 24/7' : 'Retraits 24h/24'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setActiveMode('deposit');
                setRecentMessage(null);
              }}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                activeMode === 'deposit'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{language === 'ht' ? 'Fè Depo' : 'Dépôt'}</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('withdraw');
                setRecentMessage(null);
              }}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                activeMode === 'withdraw'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{language === 'ht' ? 'Fè Retrè (24/7)' : 'Retrait (24/7)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Box: Deposit / Withdraw */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activeMode === 'deposit'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {activeMode === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {activeMode === 'deposit'
                  ? 'Depo MonCash & Natcash Reyèl'
                  : 'Retrè 24/7 sou MonCash & Natcash'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeMode === 'deposit'
                  ? 'Voye kòb la sou nimewo ofisyèl Lakay Play la, antre enfòmasyon yo pou bous ou kredite.'
                  : 'Retrè yo trete rapid a nenpòt ki lè san tann sou nimewo MonCash oswa Natcash ou.'}
              </p>
            </div>
          </div>

          {isOwnerAuthenticated && (
            <button
              onClick={() => setActiveTab('admin')}
              className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition cursor-pointer"
            >
              👑 Panèl Mèt la (Valide Depo)
            </button>
          )}
        </div>

        {recentMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-xs ${
              recentMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : recentMessage.type === 'info'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}
          >
            {recentMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {recentMessage.type === 'info' && <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {recentMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            <div>
              <p className="font-bold text-sm text-white">{recentMessage.text}</p>
              <p className="mt-1 text-slate-300">
                Ou ka verifye estati a anba nan tablo &quot;Istorik Tranzaksyon Yo&quot;.
              </p>
            </div>
          </div>
        )}

        {/* Real Deposit Receiver Box */}
        {activeMode === 'deposit' && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Nimewo Ofisyèl Pou Fè Transfè a ({selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'}) :
              </span>
              <button
                type="button"
                onClick={handleCopyReceiver}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-xl transition cursor-pointer shadow"
              >
                {copiedNumber ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNumber ? 'Kopye!' : 'Kopye Nimewo a'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider">
                {officialReceiver}
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg">
                {selectedMethod === 'moncash' ? 'Digicel MonCash' : 'Natcom Natcash'}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              <p className="font-semibold text-white">Enstriksyon Transfè :</p>
              <p>
                1. Ale sou aplikasyon {selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'} ou oswa fè{' '}
                <code className="text-amber-400 font-bold">*202#</code> sou telefòn ou.
              </p>
              <p>
                2. Fè transfè a bay nimewo Lakay Play la :{' '}
                <strong className="text-white font-mono">{officialReceiver}</strong>.
              </p>
              <p>
                3. Antre nimewo ou a ak kòd SMS la nan fòmilè ki anba a epi klike sou &quot;Soumèt Depo a&quot;.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              {language === 'ht' ? '1. Chwazi Mwayen Peman' : '1. Choisissez le moyen de paiement'}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedMethod('moncash')}
                className={`p-4 rounded-2xl border-2 transition flex items-center justify-between text-left cursor-pointer ${
                  selectedMethod === 'moncash'
                    ? 'border-red-500 bg-red-950/30 shadow-lg shadow-red-950/50'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    MC
                  </div>
                  <div>
                    <div className="font-black text-sm text-white">MonCash</div>
                    <div className="text-[11px] text-slate-400">Digicel Ayiti</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'moncash' ? 'border-red-500 bg-red-500' : 'border-slate-600'
                  }`}
                >
                  {selectedMethod === 'moncash' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('natcash')}
                className={`p-4 rounded-2xl border-2 transition flex items-center justify-between text-left cursor-pointer ${
                  selectedMethod === 'natcash'
                    ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-950/50'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    NC
                  </div>
                  <div>
                    <div className="font-black text-sm text-white">Natcash</div>
                    <div className="text-[11px] text-slate-400">Natcom Ayiti</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'natcash' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                  }`}
                >
                  {selectedMethod === 'natcash' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>

          {/* 2. Amount input & presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'ht' ? '2. Montan an Goud (HTG)' : '2. Montant en Gourdes (HTG)'}
              </label>
              {activeMode === 'withdraw' && (
                <span className="text-xs text-amber-400 font-semibold">
                  Balans ou: {user.balanceHTG.toLocaleString()} HTG
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="number"
                min="25"
                step="5"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="100"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-lg font-black text-white focus:outline-hidden focus:border-amber-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                HTG
              </span>
            </div>

            {/* Presets chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p.toString())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    amount === p.toString()
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {p.toLocaleString()} HTG
                </button>
              ))}
            </div>
          </div>

          {/* 3. Phone number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              {activeMode === 'deposit'
                ? `3. Nimewo Telefòn Ou Te Itilize Pou Fè Transfè a`
                : `3. Nimewo Telefòn Pou Resevwa Retrè a (${selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'})`}
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="eg: 46532833 oswa +509 4653 2833"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-hidden focus:border-amber-400"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 4. SMS Transaction ID (for deposit) */}
          {activeMode === 'deposit' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                4. Kòd Tranzaksyon ki nan SMS MonCash / Natcash la
              </label>
              <input
                type="text"
                value={trxId}
                onChange={e => setTrxId(e.target.value)}
                placeholder="eg: 2024-MC-81923 oswa TRX981248"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-mono text-white focus:outline-hidden focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Lè w fin voye kòb la sou {officialReceiver}, mete kòd tranzaksyon SMS la la pou verifikasyon rapid.
              </p>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === 'deposit'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-emerald-900/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/30'
            }`}
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : activeMode === 'deposit' ? (
              <>
                <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                <span>
                  Soumèt Depo {parseFloat(amount || '0').toLocaleString()} HTG pa {selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'}
                </span>
              </>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                <span>
                  Soumèt Retrè {parseFloat(amount || '0').toLocaleString()} HTG (24/7 sou {selectedMethod === 'moncash' ? 'MonCash' : 'Natcash'})
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transaction History Section */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
          <span>{language === 'ht' ? 'Istorik Tranzaksyon Yo' : 'Historique des Transactions'}</span>
          <span className="text-xs text-slate-400">{transactions.length} operasyon</span>
        </h4>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Pa gen okenn tranzaksyon anrejistre pou moman an. Fè yon depo pou kòmanse!
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      tx.type === 'deposit'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : tx.type === 'withdrawal'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {tx.type === 'deposit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : tx.type === 'withdrawal' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{tx.description}</div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{tx.referenceNumber}</span>
                      {tx.smsTransactionCode && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400">SMS: {tx.smsTransactionCode}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div
                    className={`font-black text-sm ${
                      tx.type === 'deposit' || tx.type === 'bet_won' || tx.type === 'referral_bonus'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {tx.type === 'deposit' || tx.type === 'bet_won' || tx.type === 'referral_bonus' ? '+' : '-'}
                    {tx.amountHTG.toLocaleString()} HTG
                  </div>

                  <div>
                    {tx.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Konfime
                      </span>
                    )}
                    {tx.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md animate-pulse">
                        <Clock className="w-3 h-3" /> Pandan Verifikasyon
                      </span>
                    )}
                    {tx.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3 h-3" /> Rejte
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
