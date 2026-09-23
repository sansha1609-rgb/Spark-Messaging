export interface PerContactPrivacy {
  hideBlueTicks: boolean;       // Sender sees gray double ticks even if read
  hideSecondTick: boolean;      // Sender sees single gray tick (thinks offline)
  hideTyping: boolean;          // Never show "typing..." or "recording..."
  hideStatusView: boolean;      // View contact stories anonymously
  antiDelete: boolean;          // Retain sender-deleted messages with revoked badge
  freezeLastSeen: boolean;      // Freeze last seen time for this contact
  isChatLocked: boolean;        // Require biometric / PIN to open this specific chat
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  online: boolean;
  lastSeen: string;
  isTyping?: boolean;
  isHidden?: boolean;           // In the GB Hidden Vault
  isArchived?: boolean;
  unreadCount: number;
  privacy: PerContactPrivacy;
  safetyNumber: string;         // 60-digit E2EE safety code
}

export interface Message {
  id: string;
  senderId: string;            // 'me' or contact.id
  recipientId: string;
  text: string;
  timestamp: string;
  status: 'pending' | 'sent' | 'delivered' | 'read';
  isRevoked?: boolean;          // Deleted by sender (Anti-delete shows it with badge)
  revokedAt?: string;
  mediaType?: 'image' | 'audio' | 'document' | 'none';
  mediaUrl?: string;
  audioDuration?: string;
  cipherPayload?: {
    algorithm: string;
    iv: string;
    tag: string;
    ciphertext: string;
  };
  isScheduled?: boolean;
}

export interface ScheduledMessage {
  id: string;
  recipientId: string;
  text: string;
  scheduledTime: string;       // ISO string
  repeat: 'once' | 'daily' | 'weekly';
  status: 'pending' | 'sent' | 'cancelled';
  createdAt: string;
}

export interface StatusStory {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  caption: string;
  mediaUrl?: string;
  bgColor?: string;
  timestamp: string;
  viewersCount: number;
  isViewedByMe: boolean;
  viewedAnonymously?: boolean;
}

export interface AccountProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  statusBio: string;
  lastSeenPrivacy: 'everyone' | 'contacts' | 'nobody';
  onlinePrivacy: 'same_as_last_seen' | 'everyone' | 'stealth';
  freezeLastSeen: boolean;
  frozenTimestamp?: string;
  disableForwardedTag: boolean;
  antiViewOnce: boolean;
  callPrivacy: 'everyone' | 'contacts' | 'nobody';
  appLockTimeout: 'immediate' | '1m' | '5m' | 'off';
  biometricEnabled: boolean;
  masterPin: string;
}

export type ThemePreset = 'emerald' | 'cyberpunk' | 'oled' | 'amethyst' | 'solar' | 'arctic';

export interface ThemeConfig {
  preset: ThemePreset;
  isDark: boolean;
  accentColor: string;
  bubbleStyle: 'rounded' | 'modern' | 'sharp';
  wallpaper: 'doodle' | 'solid' | 'minimal' | 'grid';
  fontSize: 'small' | 'medium' | 'large';
}

export interface BackupSnapshot {
  version: string;
  createdAt: string;
  accountId: string;
  accountName: string;
  chatsCount: number;
  messagesCount: number;
  checksum: string;
  data: string;                 // Encrypted or serialized data payload
}
