export type Language = 'ht' | 'fr';

export type PaymentMethod = 'moncash' | 'natcash';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  balanceHTG: number;
  points: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  totalEarningsFromReferrals: number;
  isOwner: boolean;
  avatar: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'bet_won' | 'bet_placed' | 'referral_bonus' | 'tournament_prize';

export interface Transaction {
  id: string;
  type: TransactionType;
  method?: PaymentMethod;
  amountHTG: number;
  phone?: string;
  senderPhone?: string;
  smsTransactionCode?: string;
  referenceNumber: string;
  status: 'completed' | 'pending' | 'rejected';
  date: string;
  description: string;
  rejectionReason?: string;
}

export interface Tournament {
  id: string;
  title: string;
  titleFr: string;
  game: 'morpion' | 'domino' | 'quiz' | string;
  entryFeeHTG: number;
  prizePoolHTG: number;
  maxParticipants: number;
  currentParticipants: number;
  registeredUserIds: string[];
  startDate: string;
  status: 'upcoming' | 'active' | 'completed';
  winner?: string;
  createdByOwner: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'payment' | 'game' | 'system' | 'referral' | 'tournament';
}

export interface InGameChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isOpponent?: boolean;
}

export interface BidItem {
  id: string;
  title: string;
  imageUrl: string;
  retailValueHTG: number;
  currentPriceHTG: number;
  lastBidder: string;
  bidCostHTG: number;
  secondsRemaining: number;
  totalBids: number;
  isEnded: boolean;
}

export interface GameSettings {
  id: string;
  title: string;
  isActive: boolean;
  minBetHTG: number;
  maxBetHTG: number;
  description: string;
  badge: string;
}

export interface CustomGame {
  id: string;
  title: string;
  category: string;
  minBet: number;
  maxBet: number;
  imageUrl: string;
  status: 'available' | 'coming_soon';
  rules: string;
}

export interface SiteSettings {
  siteName: string;
  assistantPhone: string;
  moncashReceiverPhone: string;
  natcashReceiverPhone: string;
  whatsappGroupUrl: string;
  announcementBanner: string;
  showAnnouncement: boolean;
  ownerPin: string;
  autoApproveDeposits: boolean;
}
