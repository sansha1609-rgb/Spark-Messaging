import React, { useState } from 'react';
import {
  Contact,
  AccountProfile,
  ThemeConfig,
  Message,
} from '../types/chat';
import {
  Shield,
  Lock,
  Search,
  Users,
  Palette,
  Cloud,
  Clock,
  CircleDashed,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  Sparkles,
  CheckCheck,
  EyeOff,
} from 'lucide-react';

interface SidebarProps {
  accounts: AccountProfile[];
  activeAccount: AccountProfile;
  contacts: Contact[];
  activeContactId: string | null;
  messages: Message[];
  theme: ThemeConfig;
  isOffline: boolean;
  onSelectContact: (contactId: string) => void;
  onOpenAccountSwitcher: () => void;
  onOpenHiddenVault: () => void;
  onOpenScheduler: () => void;
  onOpenThemeModal: () => void;
  onOpenBackupModal: () => void;
  onOpenStoriesModal: () => void;
  onOpenContactPrivacy: (contact: Contact) => void;
  onToggleOffline: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  accounts,
  activeAccount,
  contacts,
  activeContactId,
  messages,
  theme,
  isOffline,
  onSelectContact,
  onOpenAccountSwitcher,
  onOpenHiddenVault,
  onOpenScheduler,
  onOpenThemeModal,
  onOpenBackupModal,
  onOpenStoriesModal,
  onOpenContactPrivacy,
  onToggleOffline,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'favorites'>('all');

  // Filter out hidden contacts from standard list
  const visibleContacts = contacts.filter((c) => !c.isHidden);

  const filteredContacts = visibleContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.about.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'unread') return c.unreadCount > 0;
    return true;
  });

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] h-full flex flex-col shrink-0 bg-[#111b21] border-r border-slate-800/80 select-none z-20">
      {/* Top Header */}
      <div className="p-3.5 bg-[#202c33] border-b border-slate-800 flex items-center justify-between gap-2">
        {/* Left: Brand / Hidden Vault trigger */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAccountSwitcher}
            className="relative group p-0.5 rounded-full ring-2 ring-emerald-500/40 hover:ring-emerald-400 transition-all cursor-pointer"
            title="Switch Account Profile"
          >
            <img
              src={activeAccount.avatar}
              alt={activeAccount.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#202c33] flex items-center justify-center text-[7px] font-bold text-white">
              {accounts.length}
            </div>
          </button>

          <div
            onClick={onOpenHiddenVault}
            className="cursor-pointer group flex flex-col"
            title="Tap to unlock GB Hidden Vault"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                GB WhatsApp
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              Tap title for Hidden Vault
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1">
          {/* Stories */}
          <button
            type="button"
            onClick={onOpenStoriesModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Status & Stories (Ghost Mode)"
          >
            <CircleDashed className="w-4 h-4" />
          </button>

          {/* Scheduler */}
          <button
            type="button"
            onClick={onOpenScheduler}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Schedule Messages"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Theme Engine */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Theme Customizer"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Cloud & Network Sync */}
          <button
            type="button"
            onClick={onOpenBackupModal}
            className={`p-2 rounded-xl transition-colors ${
              isOffline
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Cloud Backup & Network Sync"
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
          </button>

          {/* Hidden Vault Lock */}
          <button
            type="button"
            onClick={onOpenHiddenVault}
            className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            title="Secret Hidden Vault"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile summary bar with GB Stealth status */}
      <div className="px-4 py-2 bg-[#111b21] border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium truncate">{activeAccount.name}</span>
          <span className="text-[11px] text-slate-500">· {activeAccount.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {activeAccount.freezeLastSeen && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20" title="Last Seen Frozen">
              ❄️ Frozen
            </span>
          )}
          {activeAccount.onlinePrivacy === 'stealth' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20" title="Stealth Mode">
              Ghost Online
            </span>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-[#111b21] space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat..."
            className="w-full bg-[#202c33] text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 text-xs border border-transparent focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterTab === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#202c33] text-slate-400 hover:text-white'
            }`}
          >
            All Chats
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterTab === 'unread'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#202c33] text-slate-400 hover:text-white'
            }`}
          >
            Unread
          </button>
          <button
            type="button"
            onClick={onOpenHiddenVault}
            className="px-3 py-1 rounded-lg font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/30 transition-colors flex items-center gap-1 ml-auto"
          >
            <Lock className="w-3 h-3" />
            Vault
          </button>
        </div>
      </div>

      {/* Chat List Scrollable */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12 px-4 text-xs text-slate-500">
            No conversations match your search.
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isSelected = contact.id === activeContactId;
            const contactMsgs = messages.filter(
              (m) => m.senderId === contact.id || m.recipientId === contact.id
            );
            const lastMsg = contactMsgs[contactMsgs.length - 1];

            return (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors relative ${
                  isSelected
                    ? 'bg-[#2a3942]'
                    : 'bg-[#111b21] hover:bg-[#202c33]'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#111b21]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                      {contact.name}
                      {contact.privacy.hideBlueTicks && (
                        <span title="Blue Ticks Disabled for this contact">
                          <EyeOff className="w-3 h-3 text-slate-400" />
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                      {lastMsg?.timestamp || contact.lastSeen}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                      {lastMsg?.isRevoked ? (
                        <span className="text-rose-400 flex items-center gap-1 font-medium">
                          🚫 Revoked: "{lastMsg.text}"
                        </span>
                      ) : (
                        lastMsg?.text || contact.about
                      )}
                    </p>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {contact.unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                          {contact.unreadCount}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenContactPrivacy(contact);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-emerald-400 hover:bg-slate-700/50 transition-colors"
                        title="Configure Contact GB Privacy"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Offline Alert Strip if simulated offline */}
      {isOffline && (
        <div
          onClick={onToggleOffline}
          className="p-2.5 bg-amber-500/20 border-t border-amber-500/30 text-amber-300 text-xs flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Offline mode: Cached chats only</span>
          </div>
          <span className="text-[11px] underline">Connect</span>
        </div>
      )}
    </aside>
  );
};
