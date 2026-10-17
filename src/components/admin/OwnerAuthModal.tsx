import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, KeyRound, X, CheckCircle, Lock, Crown } from 'lucide-react';

export const OwnerAuthModal: React.FC = () => {
  const {
    isOwnerModalOpen,
    setIsOwnerModalOpen,
    isOwnerAuthenticated,
    loginAsOwner,
    logoutOwner,
    setActiveTab,
    siteSettings,
    user,
  } = useApp();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOwnerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsOwner(pin);
    if (success) {
      setError(false);
      setPin('');
      setIsOwnerModalOpen(false);
      setActiveTab('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-red-500/40 p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={() => setIsOwnerModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto shadow-inner">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>

          <h3 className="text-xl font-black text-white">
            {isOwnerAuthenticated ? 'Espas Responsab Lakay Play' : 'Aksè Rezève Pou Mèt Sit la'}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {isOwnerAuthenticated
              ? 'Ou konekte kòm Pwopriyetè & Mèt sit la. Ou gen kontwòl total sou tout tournwa, jwèt, ak peman.'
              : 'Se sèl responsab sit la ki gen dwa kreye tournwa, mete nouvo jwèt, jere kès la ak pibliye enfòmasyon.'}
          </p>
        </div>

        {isOwnerAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Responsab :</span>
                <span className="font-bold text-white">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Telefòn :</span>
                <span className="font-bold text-amber-400">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email :</span>
                <span className="font-bold text-sky-400">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estati :</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Konfime
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsOwnerModalOpen(false);
                  setActiveTab('admin');
                }}
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Ouvri Panèl Mèt la
              </button>
              <button
                onClick={() => {
                  logoutOwner();
                  setIsOwnerModalOpen(false);
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition border border-slate-700 cursor-pointer"
              >
                Kite Mòd Responsab
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider text-left">
                Kòd Sekrè Responsab (PIN Mèt Sit la)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={e => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  placeholder="Antre kòd sekrè ou..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-black text-white tracking-widest text-center focus:outline-hidden focus:border-amber-400"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {error && (
                <p className="text-xs text-red-400 mt-2 text-center font-medium">
                  Kòd sekrè kòrèk la pa sa. Eseye nimewo telefòn ou: 46532833.
                </p>
              )}
              <div className="text-[11px] text-slate-400 text-center mt-2">
                💡 Kòd default: <span className="font-mono text-amber-400 font-bold">46532833</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs tracking-wide shadow-xl shadow-red-950/40 transition cursor-pointer"
            >
              Debloke Aksè Responsab
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
