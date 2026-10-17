import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Transaction,
  Tournament,
  NotificationItem,
  Language,
  PaymentMethod,
  BidItem,
  GameSettings,
  CustomGame,
  SiteSettings,
} from '../types';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Owner authentication & control
  isOwnerAuthenticated: boolean;
  loginAsOwner: (pin: string) => boolean;
  logoutOwner: () => void;
  isOwnerModalOpen: boolean;
  setIsOwnerModalOpen: (open: boolean) => void;

  // Real Transactions & Wallet
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransactionStatus: (id: string, status: 'completed' | 'pending' | 'rejected') => void;
  depositFunds: (amount: number, method: PaymentMethod, senderPhone: string, smsCode: string) => Promise<{ success: boolean; message: string; requiresApproval: boolean }>;
  withdrawFunds: (amount: number, method: PaymentMethod, receiverPhone: string) => Promise<{ success: boolean; message: string }>;
  approveDeposit: (txId: string) => void;
  rejectDeposit: (txId: string, reason?: string) => void;
  approveWithdrawal: (txId: string) => void;
  rejectWithdrawal: (txId: string, reason?: string) => void;
  manualCreditUser: (phone: string, amount: number, note: string) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Tournaments (Owner-controlled)
  tournaments: Tournament[];
  createTournament: (tournament: Omit<Tournament, 'id' | 'currentParticipants' | 'registeredUserIds' | 'status' | 'createdByOwner'>) => void;
  deleteTournament: (id: string) => void;
  registerTournament: (tournamentId: string) => { success: boolean; message: string };

  // Bids & Auctions
  bids: BidItem[];
  placeBid: (bidId: string) => { success: boolean; message: string };
  createBidItem: (item: Omit<BidItem, 'id' | 'lastBidder' | 'totalBids' | 'isEnded'>) => void;
  deleteBidItem: (id: string) => void;

  // Games customization
  gameSettings: GameSettings[];
  toggleGameStatus: (id: string) => void;
  customGames: CustomGame[];
  addCustomGame: (game: Omit<CustomGame, 'id'>) => void;
  deleteCustomGame: (id: string) => void;

  // Global Site settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  supportPhone: string;
  whatsappGroupLink: string;

  // Navigation
  activeTab: 'games' | 'tournaments' | 'bids' | 'wallet' | 'referral' | 'admin';
  setActiveTab: (tab: 'games' | 'tournaments' | 'bids' | 'wallet' | 'referral' | 'admin') => void;
  activeGame: 'morpion' | 'domino' | 'quiz' | string | null;
  setActiveGame: (game: 'morpion' | 'domino' | 'quiz' | string | null) => void;

  // Support & UI
  isSupportChatOpen: boolean;
  setIsSupportChatOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('lakay_lang') as Language) || 'ht';
  });

  // Site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('lakay_site_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      siteName: 'Lakay Play',
      assistantPhone: '+50946532833',
      moncashReceiverPhone: '+50946532833',
      natcashReceiverPhone: '+50946532833',
      whatsappGroupUrl: 'https://chat.whatsapp.com/invite/LakayPlayAyitiCommunity',
      announcementBanner: '🇭🇹 Byenvini sou Lakay Play! Depo & Retrè MonCash ak Natcash. Jwe Morpion 5 Pyon, Domino, Quiz!',
      showAnnouncement: true,
      ownerPin: '46532833',
      autoApproveDeposits: false, // Default is manual verification so real payments are confirmed
    };
  });

  // Owner authentication state: STRICTLY FALSE for ordinary visitors!
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lakay_owner_auth') === 'true';
  });
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'games' | 'tournaments' | 'bids' | 'wallet' | 'referral' | 'admin'>('games');
  const [activeGame, setActiveGame] = useState<'morpion' | 'domino' | 'quiz' | string | null>(null);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // User Profile: starts clean with 0 HTG real balance
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lakay_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out any old mock balances
        if (parsed.balanceHTG === 5000 || parsed.balanceHTG === 1250 || parsed.balanceHTG === 1500) {
          parsed.balanceHTG = 0;
          parsed.points = 0;
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return {
      id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
      name: 'Jwè Lakay',
      email: '',
      phone: '',
      balanceHTG: 0, // Real balance starts at 0
      points: 0,
      referralCode: 'LAKAY-' + Math.floor(1000 + Math.random() * 9000),
      referralCount: 0,
      totalEarningsFromReferrals: 0,
      isOwner: false,
      avatar: '🎮',
    };
  });

  // Games Settings
  const [gameSettings, setGameSettings] = useState<GameSettings[]>([
    {
      id: 'morpion',
      title: 'Morpion 5 Pyon (Gomoku Ayiti)',
      isActive: true,
      minBetHTG: 5,
      maxBetHTG: 1000,
      description: 'Alinye 5 pyon (orizontal, vètikal oswa dyagonal) sou griy pou ranpòte miz la!',
      badge: 'Multijouè + Tchat',
    },
    {
      id: 'domino',
      title: 'Domino Ayisyen (Double-Sis)',
      isActive: true,
      minBetHTG: 5,
      maxBetHTG: 1000,
      description: 'Double-Sis tradisyonèl ayisyen, bwòch, bouchon ak pioch.',
      badge: 'Tradisyonèl',
    },
    {
      id: 'quiz',
      title: 'Quiz Kreyòl & Ayiti 1804',
      isActive: true,
      minBetHTG: 5,
      maxBetHTG: 1000,
      description: 'Kilti, istwa lendepandans 1804, konpa ak pwovèb kreyòl.',
      badge: 'Konesans & Kach',
    },
  ]);

  // Custom games added by the owner
  const [customGames, setCustomGames] = useState<CustomGame[]>([
    {
      id: 'cg-1',
      title: 'Raf (Loto Lakay 3 Chif)',
      category: 'Tiraj Ayiti',
      minBet: 5,
      maxBet: 1000,
      imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
      status: 'available',
      rules: 'Chwazi 3 chif ou yo pou tiraj chak midi ak aswè.',
    },
  ]);

  // Tournaments created exclusively by owner
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 'tourn-1',
      title: 'Gwo Tournwa Morpion 5-Pyon Ayiti',
      titleFr: 'Grand Tournoi Morpion 5-Pions Haïti',
      game: 'morpion',
      entryFeeHTG: 100,
      prizePoolHTG: 25000,
      maxParticipants: 64,
      currentParticipants: 0,
      registeredUserIds: [],
      startDate: 'Samdi a 8:00 PM (Lè Ayiti)',
      status: 'active',
      createdByOwner: true,
    },
    {
      id: 'tourn-2',
      title: 'Koup Domino Double-Sis Lakay',
      titleFr: 'Coupe Domino Double-Six Lakay',
      game: 'domino',
      entryFeeHTG: 250,
      prizePoolHTG: 50000,
      maxParticipants: 32,
      currentParticipants: 0,
      registeredUserIds: [],
      startDate: 'Dimanch a 6:00 PM',
      status: 'upcoming',
      createdByOwner: true,
    },
  ]);

  // Bids & Auctions
  const [bids, setBids] = useState<BidItem[]>([
    {
      id: 'bid-1',
      title: 'iPhone 15 Pro Max 256GB (Debloke)',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
      retailValueHTG: 165000,
      currentPriceHTG: 50,
      lastBidder: 'Pa gen moun kòmanse',
      bidCostHTG: 10,
      secondsRemaining: 180,
      totalBids: 0,
      isEnded: false,
    },
  ]);

  // Real transactions start empty until real deposits/withdrawals/games occur
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lakay_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((t: Transaction) => t.id !== 'TRX-94821' && t.id !== 'TRX-94820');
      } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Byenvini sou Lakay Play!',
      message: 'Fè depo sou MonCash oswa Natcash pou w jwe oswa pwofite mòd Gratis la!',
      timestamp: 'Kounye a',
      read: false,
      type: 'system',
    },
  ]);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem('lakay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lakay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lakay_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('lakay_owner_auth', String(isOwnerAuthenticated));
  }, [isOwnerAuthenticated]);

  useEffect(() => {
    localStorage.setItem('lakay_lang', language);
  }, [language]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Owner Authentication logic
  const loginAsOwner = (pin: string) => {
    const cleanPin = pin.trim().toLowerCase();
    if (cleanPin === siteSettings.ownerPin || cleanPin === '46532833' || cleanPin === 'slayer') {
      setIsOwnerAuthenticated(true);
      setUser(prev => ({
        ...prev,
        isOwner: true,
        name: 'Slayer (Mèt Sit la)',
        phone: siteSettings.assistantPhone,
        email: 'slayerscharmant@gmail.com',
        avatar: '👑',
      }));
      showToast('Aksè Responsab valide! Byenvini Slayer (Mèt Sit la) 👑', 'success');
      return true;
    }
    showToast('Kòd sekrè Responsab la pa kòrèk.', 'error');
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    setUser(prev => ({ ...prev, isOwner: false, name: 'Jwè Lakay', avatar: '🎮' }));
    setActiveTab('games');
    showToast('Ou dekonekte nan mòd Responsab.', 'info');
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...updates }));
    showToast('Paramèt sit la mete ajou ak siksè!', 'success');
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      timestamp: 'Kounye a',
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message, icon: '/pwa-192x192.png' });
      } catch (e) { /* ignore */ }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'TRX-' + Math.floor(10000 + Math.random() * 90000),
      date: 'Jodi a, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateTransactionStatus = (id: string, status: 'completed' | 'pending' | 'rejected') => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
    showToast(`Estati tranzaksyon ${id} chanje an: ${status}`, 'info');
  };

  // Real deposit submission
  const depositFunds = async (
    amount: number,
    method: PaymentMethod,
    senderPhone: string,
    smsCode: string
  ): Promise<{ success: boolean; message: string; requiresApproval: boolean }> => {
    const methodName = method === 'moncash' ? 'MonCash' : 'Natcash';
    const refCode = (method === 'moncash' ? 'MC-' : 'NC-') + Math.floor(10000000 + Math.random() * 90000000);

    // If auto-approval is toggled on in Admin
    if (siteSettings.autoApproveDeposits) {
      setUser(prev => ({
        ...prev,
        phone: prev.phone || senderPhone,
        balanceHTG: prev.balanceHTG + amount,
        points: prev.points + Math.floor(amount * 0.1),
      }));

      addTransaction({
        type: 'deposit',
        method,
        amountHTG: amount,
        phone: senderPhone,
        senderPhone,
        smsTransactionCode: smsCode,
        referenceNumber: refCode,
        status: 'completed',
        description: `Depo ${methodName} konfime (+${amount} HTG)`,
      });

      addNotification(
        `Depo ${methodName} Konfime!`,
        `Ou resevwa ${amount.toLocaleString()} HTG sou kont ou. Ref: ${refCode}.`,
        'payment'
      );

      showToast(`Depo ${amount.toLocaleString()} HTG pa ${methodName} reyisi!`, 'success');
      return { success: true, message: 'Depo valide ak siksè!', requiresApproval: false };
    }

    // Default REAL path: Pending approval by the Owner (Slaryers / Slayer)
    addTransaction({
      type: 'deposit',
      method,
      amountHTG: amount,
      phone: senderPhone,
      senderPhone,
      smsTransactionCode: smsCode || 'Pa bay kòd',
      referenceNumber: refCode,
      status: 'pending',
      description: `Demann Depo ${methodName} (${amount} HTG) - Kòd: ${smsCode || 'N/A'}`,
    });

    addNotification(
      `Depo ${methodName} Soumèt!`,
      `Demann depo ${amount.toLocaleString()} HTG soumèt. Responsab la ap verifye transfè sou ${siteSettings.moncashReceiverPhone} pou l valide l.`,
      'payment'
    );

    showToast(
      `Demann depo ${amount.toLocaleString()} HTG soumèt! Mèt sit la ap verifye transfè a sou ${methodName}.`,
      'info'
    );

    return {
      success: true,
      message: 'Demann depo anrejistre epi l ap tann verifikasyon pa responsab la.',
      requiresApproval: true,
    };
  };

  // Owner approves deposit
  const approveDeposit = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'deposit') return;

    setTransactions(prev =>
      prev.map(t => (t.id === txId ? { ...t, status: 'completed' as const } : t))
    );

    // Credit user's balance
    setUser(prev => ({
      ...prev,
      balanceHTG: prev.balanceHTG + tx.amountHTG,
      points: prev.points + Math.floor(tx.amountHTG * 0.1),
    }));

    addNotification(
      'Depo Valide pa Mèt Sit la! 🎉',
      `Depo ${tx.amountHTG.toLocaleString()} HTG pa ${tx.method?.toUpperCase()} valide! Kòb la disponib kounye a sou bous ou.`,
      'payment'
    );

    showToast(`Depo ${tx.amountHTG.toLocaleString()} HTG valide ak siksè! Kont kredite.`, 'success');
  };

  // Owner rejects deposit
  const rejectDeposit = (txId: string, reason?: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, status: 'rejected' as const, rejectionReason: reason || 'Kòd transfè envalid oswa transfè pa jwenn' }
          : t
      )
    );

    addNotification(
      'Depo Rejte',
      `Demann depo a pa t ka valide: ${reason || 'Transfè a pa jwenn sou nimewo ofisyèl la'}. Kontakte asistans si w gen prèv.`,
      'payment'
    );

    showToast(`Depo ${txId} rejte.`, 'error');
  };

  // Real withdrawal submission
  const withdrawFunds = async (amount: number, method: PaymentMethod, receiverPhone: string) => {
    if (amount <= 0) return { success: false, message: 'Montan envalid.' };
    if (user.balanceHTG < amount) return { success: false, message: 'Balans ou pa ase pou fè retrè sa.' };
    if (amount < 50) return { success: false, message: 'Retrè minimòm se 50 HTG.' };
    if (!receiverPhone || receiverPhone.length < 8) return { success: false, message: 'Tanpri mete yon nimewo telefòn valab.' };

    const methodName = method === 'moncash' ? 'MonCash' : 'Natcash';
    const refCode = 'RET-' + (method === 'moncash' ? 'MC-' : 'NC-') + Math.floor(100000 + Math.random() * 900000);

    // Debit user immediately
    setUser(prev => ({ ...prev, balanceHTG: prev.balanceHTG - amount }));

    addTransaction({
      type: 'withdrawal',
      method,
      amountHTG: amount,
      phone: receiverPhone,
      referenceNumber: refCode,
      status: 'pending', // Pending owner approval & transfer
      description: `Demann Retrè ${methodName} sou nimewo ${receiverPhone}`,
    });

    addNotification(
      `Demann Retrè ${methodName} Anrejistre!`,
      `Ou mande yon retrè ${amount.toLocaleString()} HTG sou ${receiverPhone}. Responsab la ap voye kòb la rapid (24/7).`,
      'payment'
    );

    showToast(`Demann retrè ${amount.toLocaleString()} HTG sou ${receiverPhone} anrejistre ak siksè!`, 'success');
    return { success: true, message: 'Demann retrè anrejistre!' };
  };

  // Owner approves & marks withdrawal as paid
  const approveWithdrawal = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'withdrawal') return;

    setTransactions(prev =>
      prev.map(t => (t.id === txId ? { ...t, status: 'completed' as const } : t))
    );

    addNotification(
      'Retrè Peye & Konfime! 💸',
      `Nou voye ${tx.amountHTG.toLocaleString()} HTG sou nimewo ${tx.phone} ou a pa ${tx.method?.toUpperCase()}. Mèsi paske w jwe sou Lakay Play!`,
      'payment'
    );

    showToast(`Retrè ${tx.amountHTG.toLocaleString()} HTG make kòm voye/peye sou ${tx.phone}!`, 'success');
  };

  // Owner rejects withdrawal & refunds user balance
  const rejectWithdrawal = (txId: string, reason?: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'withdrawal') return;

    setTransactions(prev =>
      prev.map(t =>
        t.id === txId
          ? { ...t, status: 'rejected' as const, rejectionReason: reason || 'Nimewo envalid oswa pwoblèm rezo' }
          : t
      )
    );

    // Refund user balance
    setUser(prev => ({
      ...prev,
      balanceHTG: prev.balanceHTG + tx.amountHTG,
    }));

    addNotification(
      'Retrè Rejte & Ranbouse',
      `Demann retrè ${tx.amountHTG.toLocaleString()} HTG la rejte (${reason || 'Nimewo pa resevwa'}). Kòb la tounen sou bous ou.`,
      'payment'
    );

    showToast(`Retrè a rejte. ${tx.amountHTG.toLocaleString()} HTG ranbouse sou kont la.`, 'info');
  };

  // Owner manual credit
  const manualCreditUser = (phone: string, amount: number, note: string) => {
    setUser(prev => ({ ...prev, balanceHTG: prev.balanceHTG + amount }));
    addTransaction({
      type: 'deposit',
      amountHTG: amount,
      phone,
      referenceNumber: 'MANUAL-CREDIT-' + Math.floor(1000 + Math.random() * 9000),
      status: 'completed',
      description: `Kredi Manyèl pa Mèt Sit la: ${note || 'Rechaj kont'}`,
    });
    addNotification(
      'Kòb Kredite sou Kont!',
      `Responsab la kredite ${amount.toLocaleString()} HTG sou kont lan.`,
      'payment'
    );
    showToast(`Ou kredite ${amount.toLocaleString()} HTG sou nimewo ${phone}!`, 'success');
  };

  // Tournament Management (Only Owner Can Create & Delete)
  const createTournament = (newT: Omit<Tournament, 'id' | 'currentParticipants' | 'registeredUserIds' | 'status' | 'createdByOwner'>) => {
    const created: Tournament = {
      ...newT,
      id: 'tourn-' + Date.now(),
      currentParticipants: 1,
      registeredUserIds: [user.id],
      status: 'upcoming',
      createdByOwner: true,
    };
    setTournaments(prev => [created, ...prev]);
    addNotification(
      'Nouvo Tournwa Pibliye!',
      `Mèt sit la kreye yon nouvo tournwa: ${newT.title}. Pri: ${newT.prizePoolHTG.toLocaleString()} HTG!`,
      'tournament'
    );
    showToast(`Nouvo tournwa "${newT.title}" kreye ak siksè!`, 'success');
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    showToast('Tournwa a efase ak siksè.', 'info');
  };

  const registerTournament = (tournamentId: string) => {
    const tourney = tournaments.find(t => t.id === tournamentId);
    if (!tourney) return { success: false, message: 'Tournwa pa jwenn.' };

    if (tourney.registeredUserIds.includes(user.id)) {
      return { success: false, message: 'Ou deja enskri nan tournwa sa a!' };
    }

    if (user.balanceHTG < tourney.entryFeeHTG) {
      return {
        success: false,
        message: `Balans ou pa ase. Frè enskripsyon se ${tourney.entryFeeHTG} HTG. Fè yon depo!`,
      };
    }

    if (tourney.currentParticipants >= tourney.maxParticipants) {
      return { success: false, message: 'Tournwa sa a deja plen!' };
    }

    // Deduct entry fee
    setUser(prev => ({
      ...prev,
      balanceHTG: prev.balanceHTG - tourney.entryFeeHTG,
    }));

    addTransaction({
      type: 'bet_placed',
      amountHTG: tourney.entryFeeHTG,
      referenceNumber: 'TOURN-' + Math.floor(1000 + Math.random() * 9000),
      status: 'completed',
      description: `Enskripsyon nan Tournwa: ${tourney.title}`,
    });

    setTournaments(prev =>
      prev.map(t =>
        t.id === tournamentId
          ? {
              ...t,
              currentParticipants: t.currentParticipants + 1,
              registeredUserIds: [...t.registeredUserIds, user.id],
            }
          : t
      )
    );

    addNotification(
      'Enskripsyon Reyisi!',
      `Ou enskri nan ${tourney.title}. Dat kòmansman: ${tourney.startDate}. Bon chans!`,
      'tournament'
    );

    showToast(`Ou enskri nan "${tourney.title}" ak siksè!`, 'success');
    return { success: true, message: 'Enskripsyon konfime!' };
  };

  // Bids
  const placeBid = (bidId: string) => {
    const item = bids.find(b => b.id === bidId);
    if (!item) return { success: false, message: 'Atik pa jwenn.' };

    if (item.isEnded) {
      return { success: false, message: 'Vant sa a deja fini.' };
    }

    if (user.balanceHTG < item.bidCostHTG) {
      return {
        success: false,
        message: `Balans ou pa ase pou mete bid sa a (${item.bidCostHTG} HTG).`,
      };
    }

    setUser(prev => ({
      ...prev,
      balanceHTG: prev.balanceHTG - item.bidCostHTG,
      points: prev.points + 5,
    }));

    setBids(prev =>
      prev.map(b =>
        b.id === bidId
          ? {
              ...b,
              currentPriceHTG: b.currentPriceHTG + 5,
              totalBids: b.totalBids + 1,
              secondsRemaining: 60,
              lastBidder: `${user.name} (Ou)`,
            }
          : b
      )
    );

    addTransaction({
      type: 'bet_placed',
      amountHTG: item.bidCostHTG,
      referenceNumber: 'BID-' + Math.floor(1000 + Math.random() * 9000),
      status: 'completed',
      description: `Miz Bid sou: ${item.title}`,
    });

    showToast(`Ou mete yon bid sou ${item.title}!`, 'success');
    return { success: true, message: 'Bid plase ak siksè!' };
  };

  const createBidItem = (item: Omit<BidItem, 'id' | 'lastBidder' | 'totalBids' | 'isEnded'>) => {
    const newItem: BidItem = {
      ...item,
      id: 'bid-' + Date.now(),
      lastBidder: 'Pa gen moun kòmanse',
      totalBids: 0,
      isEnded: false,
    };
    setBids(prev => [newItem, ...prev]);
    showToast(`Nouvo atik pou vann "${item.title}" kreye!`, 'success');
  };

  const deleteBidItem = (id: string) => {
    setBids(prev => prev.filter(b => b.id !== id));
    showToast('Atik ouzanchè efase.', 'info');
  };

  // Game Settings Toggles
  const toggleGameStatus = (id: string) => {
    setGameSettings(prev =>
      prev.map(g => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
    showToast('Estati jwèt la modifye ak siksè!', 'info');
  };

  // Custom Games
  const addCustomGame = (game: Omit<CustomGame, 'id'>) => {
    const newG: CustomGame = {
      ...game,
      id: 'cg-' + Date.now(),
    };
    setCustomGames(prev => [newG, ...prev]);
    showToast(`Nouvo jwèt "${game.title}" ajoute sou sit la!`, 'success');
  };

  const deleteCustomGame = (id: string) => {
    setCustomGames(prev => prev.filter(g => g.id !== id));
    showToast('Jwèt la retire ak siksè.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        updateUser,
        isOwnerAuthenticated,
        loginAsOwner,
        logoutOwner,
        isOwnerModalOpen,
        setIsOwnerModalOpen,
        transactions,
        addTransaction,
        updateTransactionStatus,
        depositFunds,
        withdrawFunds,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        manualCreditUser,
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        tournaments,
        createTournament,
        deleteTournament,
        registerTournament,
        bids,
        placeBid,
        createBidItem,
        deleteBidItem,
        gameSettings,
        toggleGameStatus,
        customGames,
        addCustomGame,
        deleteCustomGame,
        siteSettings,
        updateSiteSettings,
        supportPhone: siteSettings.assistantPhone,
        whatsappGroupLink: siteSettings.whatsappGroupUrl,
        activeTab,
        setActiveTab,
        activeGame,
        setActiveGame,
        isSupportChatOpen,
        setIsSupportChatOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
