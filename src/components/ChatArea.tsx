import React, { useState, useRef, useEffect } from 'react';
import {
  Contact,
  Message,
  ThemeConfig,
  AccountProfile,
} from '../types/chat';
import {
  Phone,
  Video,
  Search,
  Shield,
  Lock,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
  Clock,
  ChevronLeft,
  SlidersHorizontal,
  Info,
  Terminal,
  Volume2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { encryptPacket } from '../utils/crypto';

interface ChatAreaProps {
  contact: Contact | null;
  messages: Message[];
  activeAccount: AccountProfile;
  theme: ThemeConfig;
  isOffline: boolean;
  onSendMessage: (text: string, cipherPayload?: Message['cipherPayload']) => void;
  onBackMobile: () => void;
  onOpenContactPrivacy: (contact: Contact) => void;
  onOpenE2EEInspector: (contact: Contact, lastMsg?: Message) => void;
  onOpenScheduler: (contactId: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  contact,
  messages,
  activeAccount,
  theme,
  isOffline,
  onSendMessage,
  onBackMobile,
  onOpenContactPrivacy,
  onOpenE2EEInspector,
  onOpenScheduler,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [inspectingMsgId, setInspectingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, contact]);

  // Audio recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  if (!contact) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#222e35] text-slate-400 p-6 select-none border-b-8 border-emerald-500">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">GB WhatsApp Pro for Web & Desktop</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Send end-to-end encrypted messages with per-contact stealth controls, anti-delete retention, scheduled auto-dispatch, and hidden biometric vaults.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit AES-GCM local encrypted storage</span>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    // Generate real AES-GCM cipher packet simulation
    const packet = await encryptPacket(textToSend, contact.id);

    onSendMessage(textToSend, {
      algorithm: packet.algorithm,
      iv: packet.iv,
      tag: packet.tag,
      ciphertext: packet.ciphertext,
    });
  };

  const handleSendVoiceNote = () => {
    setIsRecordingAudio(false);
    const durationStr = `0:${recordSeconds < 10 ? '0' : ''}${recordSeconds}`;
    onSendMessage(`🎤 Voice Message (${durationStr})`);
    sounds.playOutgoingPop();
  };

  const contactMessages = messages.filter(
    (m) => m.senderId === contact.id || m.recipientId === contact.id
  );

  const lastMessage = contactMessages[contactMessages.length - 1];

  // Helper for message ticks rendering
  const renderMessageTicks = (msg: Message) => {
    if (msg.senderId !== 'me') return null;

    if (msg.status === 'pending' || isOffline) {
      return (
        <span title="Offline Queue / Pending">
          <Clock className="w-3 h-3 text-slate-400" />
        </span>
      );
    }

    // GB WhatsApp per-contact privacy simulation:
    // If contact has hideSecondTick enabled, show only 1 single tick!
    if (contact.privacy.hideSecondTick) {
      return (
        <span title="Single Tick (Sender thinks you are offline)">
          <Check className="w-3 h-3 text-slate-400" />
        </span>
      );
    }

    // If contact has hideBlueTicks enabled, show gray double ticks even if read!
    if (contact.privacy.hideBlueTicks) {
      return (
        <span title="Gray Ticks (Read Receipt suppressed by GB Shield)">
          <CheckCheck className="w-3 h-3 text-slate-400" />
        </span>
      );
    }

    // Normal behavior
    if (msg.status === 'read') {
      return (
        <span title="Read (Blue Ticks)">
          <CheckCheck className="w-3 h-3 text-cyan-400" />
        </span>
      );
    }

    return (
      <span title="Delivered">
        <CheckCheck className="w-3 h-3 text-slate-400" />
      </span>
    );
  };

  // Determine chat status text
  const getStatusText = () => {
    if (contact.privacy.freezeLastSeen && activeAccount.freezeLastSeen) {
      return activeAccount.frozenTimestamp || 'Last seen yesterday at 11:42 PM';
    }
    if (contact.online) return 'Online';
    return contact.lastSeen;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden select-none">
      {/* Chat Top App Bar */}
      <div className="p-3 bg-[#202c33] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-10">
        {/* Left: Back (Mobile) & Avatar & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBackMobile}
            className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg"
            aria-label="Back to chat list"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            onClick={() => onOpenContactPrivacy(contact)}
            className="relative cursor-pointer shrink-0"
            title="Configure Per-Contact GB Privacy"
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
            />
            {contact.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#202c33]" />
            )}
          </div>

          <div
            onClick={() => onOpenContactPrivacy(contact)}
            className="min-w-0 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-white truncate">{contact.name}</h3>
              {contact.privacy.hideBlueTicks && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" title="Blue ticks hidden for this user">
                  Stealth
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Right contextual buttons */}
        <div className="flex items-center gap-1">
          {/* E2EE Inspector trigger */}
          <button
            type="button"
            onClick={() => onOpenE2EEInspector(contact, lastMessage)}
            className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-1 text-xs"
            title="End-to-End Encryption & Packet Inspector"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden lg:inline font-mono text-[10px]">E2EE</span>
          </button>

          {/* Schedule message trigger */}
          <button
            type="button"
            onClick={() => onOpenScheduler(contact.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Schedule Message to this Contact"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Per-contact Privacy Modal trigger */}
          <button
            type="button"
            onClick={() => onOpenContactPrivacy(contact)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Custom GB Privacy for this Contact"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative"
        style={{
          backgroundImage:
            theme.wallpaper === 'doodle'
              ? `url('/src/assets/images/chat_wallpaper_subtle_1790140759171.jpg')`
              : 'none',
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
          backgroundColor: theme.isDark ? '#0b141a' : '#efeae2',
        }}
      >
        {/* E2EE Banner Notice */}
        <div className="flex justify-center">
          <div
            onClick={() => onOpenE2EEInspector(contact, lastMessage)}
            className="cursor-pointer max-w-sm px-3.5 py-2 rounded-xl bg-[#182229]/90 border border-slate-700/60 backdrop-blur-sm text-[11px] text-amber-300 text-center flex items-center justify-center gap-2 shadow-sm hover:border-amber-400/50 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Messages & calls are end-to-end encrypted. Tap to inspect cryptographic packets.</span>
          </div>
        </div>

        {/* Messages list */}
        {contactMessages.map((msg) => {
          const isMe = msg.senderId === 'me';
          const isInspecting = inspectingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl relative shadow-sm text-xs leading-relaxed transition-all ${
                  isMe
                    ? 'bg-[#005c4b] text-white rounded-tr-xs'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-xs'
                } ${
                  theme.bubbleStyle === 'sharp'
                    ? 'rounded-none'
                    : theme.bubbleStyle === 'modern'
                    ? 'rounded-3xl'
                    : 'rounded-2xl'
                }`}
              >
                {/* Anti-Delete notification banner (GB WhatsApp signature) */}
                {msg.isRevoked && (
                  <div className="mb-1.5 px-2 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-[10px] text-rose-300 flex items-center gap-1.5 font-medium">
                    <span>🚫</span>
                    <span>This message was deleted by sender {msg.revokedAt ? `at ${msg.revokedAt}` : ''} (GB Anti-Delete active)</span>
                  </div>
                )}

                {/* Scheduled indicator */}
                {msg.isScheduled && (
                  <div className="mb-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    Auto-Dispatched by Scheduler
                  </div>
                )}

                {/* Message Body */}
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                {/* Cryptographic Inspector payload dropdown */}
                {isInspecting && msg.cipherPayload && (
                  <div className="mt-2 p-2 rounded-xl bg-black/40 border border-slate-700/60 font-mono text-[10px] text-emerald-300 space-y-1">
                    <div className="text-slate-400">AES-GCM Packet Dump:</div>
                    <div className="truncate">IV: {msg.cipherPayload.iv}</div>
                    <div className="truncate">Tag: {msg.cipherPayload.tag}</div>
                    <div className="truncate text-cyan-300">Cipher: {msg.cipherPayload.ciphertext}</div>
                  </div>
                )}

                {/* Message Meta / Ticks */}
                <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-slate-300">
                  <button
                    type="button"
                    onClick={() => setInspectingMsgId(isInspecting ? null : msg.id)}
                    className="text-slate-400 hover:text-white mr-1"
                    title="Inspect Cryptographic Envelope"
                  >
                    <Terminal className="w-2.5 h-2.5" />
                  </button>
                  <span className="font-mono opacity-80">{msg.timestamp}</span>
                  {renderMessageTicks(msg)}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Audio Recording Active Banner */}
      {isRecordingAudio && (
        <div className="px-4 py-2.5 bg-[#182229] border-t border-emerald-500/50 flex items-center justify-between text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono font-bold text-rose-400">
              0:{recordSeconds < 10 ? '0' : ''}{recordSeconds}
            </span>
            <span className="text-slate-300">Recording encrypted voice note...</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRecordingAudio(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendVoiceNote}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
            >
              Send Audio
            </button>
          </div>
        </div>
      )}

      {/* Message Input Bottom Bar */}
      <form
        onSubmit={handleSend}
        className="p-2.5 bg-[#202c33] border-t border-slate-800 flex items-center gap-2 shrink-0 z-10"
      >
        {/* Emoji Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-30 p-2 rounded-2xl bg-[#111b21] border border-slate-700 shadow-2xl grid grid-cols-6 gap-1 text-lg">
              {['👍', '❤️', '🔥', '✨', '😂', '🎉', '🚀', '🔒', '🛡️', '⚡', '👀', '💯'].map(
                (emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Attachment menu button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Attach Document / Media"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {showAttachmentMenu && (
            <div className="absolute bottom-12 left-0 z-30 p-2 rounded-2xl bg-[#111b21] border border-slate-700 shadow-2xl space-y-1 w-44">
              <button
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + ' [Document: encrypted-keys.pem]');
                  setShowAttachmentMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <span>📄</span> Document
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + ' [Photo: prototype-preview.png]');
                  setShowAttachmentMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <span>🖼️</span> Photos & Videos
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenScheduler(contact.id);
                  setShowAttachmentMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-emerald-400 hover:bg-slate-800 flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5" /> Schedule Msg
              </button>
            </div>
          )}
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type an encrypted message..."
          className="flex-1 bg-[#2a3942] text-slate-100 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs border border-transparent focus:border-emerald-500 focus:outline-none"
        />

        {/* Voice Note or Send Button */}
        {inputText.trim() ? (
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsRecordingAudio(!isRecordingAudio)}
            className={`p-2.5 rounded-xl transition-all active:scale-95 shrink-0 ${
              isRecordingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
            title="Record Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
