import React, { useState, useEffect } from 'react';
import {
  Contact,
  Message,
  ScheduledMessage,
  StatusStory,
  AccountProfile,
  ThemeConfig,
} from './types/chat';
import {
  INITIAL_ACCOUNTS,
  INITIAL_CONTACTS,
  INITIAL_MESSAGES,
  INITIAL_SCHEDULED_MESSAGES,
  INITIAL_STORIES,
  DEFAULT_THEME,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { ContactPrivacyModal } from './components/ContactPrivacyModal';
import { MessageSchedulerModal } from './components/MessageSchedulerModal';
import { HiddenChatsModal } from './components/HiddenChatsModal';
import { AccountsSwitcherModal } from './components/AccountsSwitcherModal';
import { E2EEInspectorModal } from './components/E2EEInspectorModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { BackupSyncModal } from './components/BackupSyncModal';
import { StatusStoriesModal } from './components/StatusStoriesModal';
import { GlobalSettingsModal } from './components/GlobalSettingsModal';
import { NotificationToast } from './components/NotificationToast';
import { sounds } from './utils/audio';

export default function App() {
  // Accounts
  const [accounts, setAccounts] = useState<AccountProfile[]>(() => {
    const saved = localStorage.getItem('gb_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    return localStorage.getItem('gb_active_account_id') || INITIAL_ACCOUNTS[0].id;
  });

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('gb_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  // Messages
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('gb_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Scheduled Messages
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(() => {
    const saved = localStorage.getItem('gb_scheduled_messages');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_MESSAGES;
  });

  // Stories
  const [stories, setStories] = useState<StatusStory[]>(() => {
    const saved = localStorage.getItem('gb_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  // Theme
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('gb_theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  // Network State Simulator (Online vs Offline/Airplane)
  const [isOffline, setIsOffline] = useState(false);

  // Active Chat Selection
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  // App Lock State
  const [isAppLocked, setIsAppLocked] = useState(false);

  // Modals & Panels
  const [biometricTarget, setBiometricTarget] = useState<'app' | 'vault' | 'chat' | null>(null);
  const [pendingChatToUnlock, setPendingChatToUnlock] = useState<string | null>(null);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [privacyContact, setPrivacyContact] = useState<Contact | null>(null);
  const [e2eeContact, setE2eeContact] = useState<{ contact: Contact; lastMsg?: Message } | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulerContactId, setSchedulerContactId] = useState<string | undefined>(undefined);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isStoriesModalOpen, setIsStoriesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

  // In-App Notification
  const [notification, setNotification] = useState<{
    id: string;
    senderName: string;
    avatar: string;
    text: string;
    contactId: string;
  } | null>(null);

  // Active Account Object
  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gb_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('gb_active_account_id', activeAccountId);
  }, [activeAccountId]);

  useEffect(() => {
    localStorage.setItem('gb_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('gb_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('gb_scheduled_messages', JSON.stringify(scheduledMessages));
  }, [scheduledMessages]);

  useEffect(() => {
    localStorage.setItem('gb_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('gb_theme', JSON.stringify(theme));
  }, [theme]);

  // Scheduled message dispatcher ticker (runs every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      scheduledMessages.forEach((sch) => {
        if (sch.status === 'pending') {
          const targetTime = new Date(sch.scheduledTime).getTime();
          if (targetTime <= now) {
            // Dispatch message!
            const newMsg: Message = {
              id: 'msg_auto_' + Date.now(),
              senderId: 'me',
              recipientId: sch.recipientId,
              text: sch.text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: isOffline ? 'pending' : 'delivered',
              isScheduled: true,
            };

            setMessages((prev) => [...prev, newMsg]);
            sounds.playOutgoingPop();

            // Update scheduled status
            if (sch.repeat === 'once') {
              setScheduledMessages((prev) =>
                prev.map((s) => (s.id === sch.id ? { ...s, status: 'sent' } : s))
              );
            } else if (sch.repeat === 'daily') {
              const nextDay = new Date(targetTime + 1000 * 60 * 60 * 24).toISOString();
              setScheduledMessages((prev) =>
                prev.map((s) => (s.id === sch.id ? { ...s, scheduledTime: nextDay } : s))
              );
            }
          }
        }
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [scheduledMessages, isOffline]);

  // Periodic simulated incoming reply (to demonstrate real-time notifications & anti-delete)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contacts[0] && !isOffline) {
        const contact = contacts[0];
        const incomingText = "Everything looks solid! E2EE cryptographic handshake verified on our end 🔒";
        
        const newMsg: Message = {
          id: 'msg_sim_' + Date.now(),
          senderId: contact.id,
          recipientId: 'me',
          text: incomingText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };

        setMessages((prev) => [...prev, newMsg]);
        sounds.playIncomingChime();

        // Trigger in-app notification if user is not currently in this chat
        if (activeContactId !== contact.id) {
          setNotification({
            id: 'notif_' + Date.now(),
            senderName: contact.name,
            avatar: contact.avatar,
            text: incomingText,
            contactId: contact.id,
          });

          // Unread increment
          setContacts((prev) =>
            prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: c.unreadCount + 1 } : c))
          );
        }
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [isOffline, activeContactId]);

  // Sending message handler
  const handleSendMessage = (text: string, cipherPayload?: Message['cipherPayload']) => {
    if (!activeContactId) return;

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      senderId: 'me',
      recipientId: activeContactId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: isOffline ? 'pending' : 'delivered',
      cipherPayload,
    };

    setMessages((prev) => [...prev, newMsg]);
    sounds.playOutgoingPop();

    // Auto-reply simulation after 3 seconds
    if (!isOffline) {
      setTimeout(() => {
        const activeContact = contacts.find((c) => c.id === activeContactId);
        if (!activeContact) return;

        const replies = [
          "Got your message! Verified through GB encrypted protocol.",
          "Sounds great, thanks for confirming.",
          "Received! I will check the documentation shortly.",
          "All systems green on our side!",
        ];
        const replyText = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
          id: 'msg_reply_' + Date.now(),
          senderId: activeContact.id,
          recipientId: 'me',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };

        setMessages((prev) => [...prev, replyMsg]);
        sounds.playIncomingChime();
      }, 3500);
    }
  };

  // Open Chat with contact (checking chat lock)
  const handleSelectContact = (contactId: string) => {
    const target = contacts.find((c) => c.id === contactId);
    if (!target) return;

    if (target.privacy.isChatLocked) {
      setPendingChatToUnlock(contactId);
      setBiometricTarget('chat');
    } else {
      setActiveContactId(contactId);
      // Clear unread
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  // Open Hidden Vault trigger
  const handleOpenHiddenVault = () => {
    setBiometricTarget('vault');
  };

  // Biometric Success
  const handleBiometricSuccess = () => {
    if (biometricTarget === 'app') {
      setIsAppLocked(false);
    } else if (biometricTarget === 'vault') {
      setIsVaultOpen(true);
    } else if (biometricTarget === 'chat' && pendingChatToUnlock) {
      setActiveContactId(pendingChatToUnlock);
      setContacts((prev) =>
        prev.map((c) => (c.id === pendingChatToUnlock ? { ...c, unreadCount: 0 } : c))
      );
      setPendingChatToUnlock(null);
    }
    setBiometricTarget(null);
  };

  // Update Contact Privacy (Per-Contact GB Rules)
  const handleUpdateContactPrivacy = (contactId: string, updatedPrivacy: Contact['privacy']) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, privacy: updatedPrivacy } : c))
    );
    if (privacyContact && privacyContact.id === contactId) {
      setPrivacyContact((prev) => (prev ? { ...prev, privacy: updatedPrivacy } : null));
    }
  };

  // Toggle Chat Hidden status
  const handleToggleChatHidden = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const willBeHidden = !c.isHidden;
          return {
            ...c,
            isHidden: willBeHidden,
            privacy: {
              ...c.privacy,
              isChatLocked: willBeHidden,
            },
          };
        }
        return c;
      })
    );
    if (privacyContact && privacyContact.id === contactId) {
      setPrivacyContact((prev) =>
        prev ? { ...prev, isHidden: !prev.isHidden } : null
      );
    }
  };

  // Unhide chat from vault
  const handleUnhideFromVault = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, isHidden: false } : c))
    );
    sounds.playUnlockSuccess();
  };

  // Message Scheduler actions
  const handleAddSchedule = (schedule: Omit<ScheduledMessage, 'id' | 'createdAt' | 'status'>) => {
    const newSchedule: ScheduledMessage = {
      ...schedule,
      id: 'sch_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setScheduledMessages((prev) => [newSchedule, ...prev]);
    sounds.playUnlockSuccess();
  };

  const handleCancelSchedule = (id: string) => {
    setScheduledMessages((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSendScheduledNow = (sch: ScheduledMessage) => {
    const newMsg: Message = {
      id: 'msg_auto_' + Date.now(),
      senderId: 'me',
      recipientId: sch.recipientId,
      text: sch.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: isOffline ? 'pending' : 'delivered',
      isScheduled: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setScheduledMessages((prev) =>
      prev.map((s) => (s.id === sch.id ? { ...s, status: 'sent' } : s))
    );
    sounds.playOutgoingPop();
  };

  // Status Stories actions
  const handleAddStory = (storyData: Omit<StatusStory, 'id' | 'viewersCount' | 'isViewedByMe'>) => {
    const newStory: StatusStory = {
      ...storyData,
      id: 'story_' + Date.now(),
      viewersCount: 0,
      isViewedByMe: true,
    };
    setStories((prev) => [newStory, ...prev]);
  };

  const handleViewStory = (storyId: string, isGhost: boolean) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          return {
            ...s,
            isViewedByMe: true,
            viewedAnonymously: isGhost,
            viewersCount: isGhost ? s.viewersCount : s.viewersCount + 1,
          };
        }
        return s;
      })
    );
  };

  // Restore Backup
  const handleRestoreBackup = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.contacts) setContacts(data.contacts);
      if (data.messages) setMessages(data.messages);
    } catch {
      // Error handled in modal
    }
  };

  const currentContact = contacts.find((c) => c.id === activeContactId) || null;
  const hiddenContacts = contacts.filter((c) => c.isHidden);

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex flex-col ${
        theme.isDark ? 'bg-[#0b141a] text-slate-100' : 'bg-[#f0f2f5] text-slate-900'
      }`}
    >
      {/* Real-time Notification Toast */}
      <NotificationToast
        notification={notification}
        onOpenChat={(id) => {
          handleSelectContact(id);
          setNotification(null);
        }}
        onDismiss={() => setNotification(null)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden w-full h-full relative">
        {/* Sidebar: on mobile, hide when a chat is open */}
        <div
          className={`h-full ${
            activeContactId ? 'hidden md:flex' : 'flex'
          } flex-col w-full md:w-[380px] lg:w-[420px]`}
        >
          <Sidebar
            accounts={accounts}
            activeAccount={activeAccount}
            contacts={contacts}
            activeContactId={activeContactId}
            messages={messages}
            theme={theme}
            isOffline={isOffline}
            onSelectContact={handleSelectContact}
            onOpenAccountSwitcher={() => setIsAccountsModalOpen(true)}
            onOpenHiddenVault={handleOpenHiddenVault}
            onOpenScheduler={() => {
              setSchedulerContactId(undefined);
              setIsSchedulerOpen(true);
            }}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenStoriesModal={() => setIsStoriesModalOpen(true)}
            onOpenContactPrivacy={(contact) => setPrivacyContact(contact)}
            onToggleOffline={() => setIsOffline(!isOffline)}
          />
        </div>

        {/* Chat Conversation Area: on mobile, hide when no chat is open */}
        <div
          className={`h-full flex-1 ${
            activeContactId ? 'flex' : 'hidden md:flex'
          } flex-col`}
        >
          <ChatArea
            contact={currentContact}
            messages={messages}
            activeAccount={activeAccount}
            theme={theme}
            isOffline={isOffline}
            onSendMessage={handleSendMessage}
            onBackMobile={() => setActiveContactId(null)}
            onOpenContactPrivacy={(contact) => setPrivacyContact(contact)}
            onOpenE2EEInspector={(contact, lastMsg) => setE2eeContact({ contact, lastMsg })}
            onOpenScheduler={(cid) => {
              setSchedulerContactId(cid);
              setIsSchedulerOpen(true);
            }}
          />
        </div>
      </div>

      {/* Biometric Verification Modal */}
      <BiometricAuthModal
        isOpen={biometricTarget !== null}
        title={
          biometricTarget === 'vault'
            ? 'Unlock GB Hidden Vault'
            : biometricTarget === 'chat'
            ? 'Unlock Private Chat'
            : 'GB Security Authentication'
        }
        subtitle={
          biometricTarget === 'vault'
            ? 'Biometric touch sensor or master PIN required to decrypt hidden conversations'
            : 'Authenticate to access this biometric protected channel'
        }
        masterPin={activeAccount.masterPin || '1234'}
        onSuccess={handleBiometricSuccess}
        onCancel={() => {
          setBiometricTarget(null);
          setPendingChatToUnlock(null);
        }}
      />

      {/* Per-Contact Privacy Settings Modal */}
      <ContactPrivacyModal
        isOpen={privacyContact !== null}
        contact={privacyContact}
        onClose={() => setPrivacyContact(null)}
        onUpdatePrivacy={handleUpdateContactPrivacy}
        onToggleChatHidden={handleToggleChatHidden}
      />

      {/* Message Scheduler Modal */}
      <MessageSchedulerModal
        isOpen={isSchedulerOpen}
        contacts={contacts}
        scheduledMessages={scheduledMessages}
        initialContactId={schedulerContactId}
        onClose={() => setIsSchedulerOpen(false)}
        onAddSchedule={handleAddSchedule}
        onCancelSchedule={handleCancelSchedule}
        onSendNow={handleSendScheduledNow}
      />

      {/* GB Hidden Vault Modal */}
      <HiddenChatsModal
        isOpen={isVaultOpen}
        hiddenContacts={hiddenContacts}
        messages={messages}
        onClose={() => setIsVaultOpen(false)}
        onSelectChat={(cid) => {
          setActiveContactId(cid);
          setIsVaultOpen(false);
        }}
        onUnhideChat={handleUnhideFromVault}
      />

      {/* Multi-Account Switcher Modal */}
      <AccountsSwitcherModal
        isOpen={isAccountsModalOpen}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSelectAccount={(accId) => setActiveAccountId(accId)}
        onAddAccount={(newAcc) => setAccounts((prev) => [...prev, newAcc])}
        onClose={() => setIsAccountsModalOpen(false)}
      />

      {/* E2EE Inspector & Safety Numbers Modal */}
      {e2eeContact && (
        <E2EEInspectorModal
          isOpen={true}
          contact={e2eeContact.contact}
          lastMessage={e2eeContact.lastMsg}
          onClose={() => setE2eeContact(null)}
        />
      )}

      {/* Theme & Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        theme={theme}
        onUpdateTheme={(patch) => setTheme((prev) => ({ ...prev, ...patch }))}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Cloud Backup & Offline Sync Modal */}
      <BackupSyncModal
        isOpen={isBackupModalOpen}
        isOffline={isOffline}
        contacts={contacts}
        messages={messages}
        activeAccountName={activeAccount.name}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onRestoreBackup={handleRestoreBackup}
        onClose={() => setIsBackupModalOpen(false)}
      />

      {/* Status & Stories Viewer Modal */}
      <StatusStoriesModal
        isOpen={isStoriesModalOpen}
        stories={stories}
        myAvatar={activeAccount.avatar}
        onAddStory={handleAddStory}
        onViewStory={handleViewStory}
        onClose={() => setIsStoriesModalOpen(false)}
      />

      {/* Global Settings Modal */}
      <GlobalSettingsModal
        isOpen={isSettingsModalOpen}
        activeAccount={activeAccount}
        onUpdateAccount={(patch) =>
          setAccounts((prev) =>
            prev.map((a) => (a.id === activeAccountId ? { ...a, ...patch } : a))
          )
        }
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
