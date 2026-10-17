import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { LiveChatSupportModal } from './components/common/LiveChatSupportModal';
import { OwnerAuthModal } from './components/admin/OwnerAuthModal';
import { GameSelector } from './components/games/GameSelector';
import { MorpionFive } from './components/games/MorpionFive';
import { DominoGame } from './components/games/DominoGame';
import { QuizHaiti } from './components/games/QuizHaiti';
import { BidAuction } from './components/games/BidAuction';
import { TournamentsSection } from './components/tournaments/TournamentsSection';
import { WalletSection } from './components/wallet/WalletSection';
import { ReferralSection } from './components/referral/ReferralSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeGame, activeTab, toast } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative">
      {/* Offline Connectivity Monitor */}
      <OfflineIndicator />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          <div className="text-xs text-slate-200 leading-snug font-medium flex-1">
            {toast.message}
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <Header />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* PWA Prominent Install Banner */}
        <PWAInstallBanner />

        {/* View Router */}
        {activeGame === 'morpion' && <MorpionFive />}
        {activeGame === 'domino' && <DominoGame />}
        {activeGame === 'quiz' && <QuizHaiti />}

        {!activeGame && (
          <>
            {activeTab === 'games' && <GameSelector />}
            {activeTab === 'tournaments' && <TournamentsSection />}
            {activeTab === 'bids' && <BidAuction />}
            {activeTab === 'wallet' && <WalletSection />}
            {activeTab === 'referral' && <ReferralSection />}
            {activeTab === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* 24/7 Live Support Assistant Modal */}
      <LiveChatSupportModal />

      {/* Master Owner Lock & Verification Modal */}
      <OwnerAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
