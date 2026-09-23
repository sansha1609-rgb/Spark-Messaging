import React from 'react';
import { Contact } from '../types/chat';
import { Shield, EyeOff, CheckCheck, MessageSquareX, History, Lock, X, Radio, Clock } from 'lucide-react';

interface ContactPrivacyModalProps {
  isOpen: boolean;
  contact: Contact | null;
  onClose: () => void;
  onUpdatePrivacy: (contactId: string, privacy: Contact['privacy']) => void;
  onToggleChatHidden: (contactId: string) => void;
}

export const ContactPrivacyModal: React.FC<ContactPrivacyModalProps> = ({
  isOpen,
  contact,
  onClose,
  onUpdatePrivacy,
  onToggleChatHidden,
}) => {
  if (!isOpen || !contact) return null;

  const { privacy } = contact;

  const handleToggle = (key: keyof Contact['privacy']) => {
    const updated = {
      ...privacy,
      [key]: !privacy[key],
    };
    onUpdatePrivacy(contact.id, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contact Info Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
          <img
            src={contact.avatar}
            alt={contact.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white truncate">{contact.name}</h3>
            <p className="text-xs text-slate-400 truncate">{contact.phone}</p>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            GB Shield
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="text-xs text-slate-400 font-medium">
            Configure custom privacy rules exclusively for this contact. Overrides global settings.
          </div>

          {/* Privacy Toggles */}
          <div className="space-y-2">
            {/* Hide Blue Ticks */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Hide Blue Ticks (Read Receipts)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Sender will only see gray ticks even after you have read their messages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hideBlueTicks')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  privacy.hideBlueTicks ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacy.hideBlueTicks ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hide Second Tick */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Hide Second Tick (Delivery)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Sender only sees a single tick. Appears as if your phone is offline.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hideSecondTick')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  privacy.hideSecondTick ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacy.hideSecondTick ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hide Typing / Recording */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Hide Typing & Audio Recording</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Never display "typing..." or "recording audio..." in their chat header.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hideTyping')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  privacy.hideTyping ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacy.hideTyping ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hide View Status (Ghost Stories) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Hide View Status (Ghost Mode)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    View their posted status stories without your name appearing in their viewed list.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hideStatusView')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  privacy.hideStatusView ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacy.hideStatusView ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Anti-Delete Messages */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 mt-0.5">
                  <MessageSquareX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Anti-Delete Messages</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    When contact deletes a message for everyone, you still retain and view it with a revoked flag.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('antiDelete')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  privacy.antiDelete ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacy.antiDelete ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Freeze Last Seen */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Freeze Last Seen</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Freeze your last seen timestamp so this contact cannot track your active hours.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('freezeLastSeen')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  privacy.freezeLastSeen ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    privacy.freezeLastSeen ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Hide Chat in Vault Button */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onToggleChatHidden(contact.id)}
              className={`w-full py-3 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                contact.isHidden
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              {contact.isHidden ? 'Unhide Chat from Secret Vault' : 'Hide Chat in Biometric Vault'}
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Hidden chats do not appear in regular chat feed and require biometric unlock to view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
