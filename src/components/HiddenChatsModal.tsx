import React from 'react';
import { Contact, Message } from '../types/chat';
import { Lock, Eye, MessageSquare, ShieldCheck, X } from 'lucide-react';

interface HiddenChatsModalProps {
  isOpen: boolean;
  hiddenContacts: Contact[];
  messages: Message[];
  onClose: () => void;
  onSelectChat: (contactId: string) => void;
  onUnhideChat: (contactId: string) => void;
}

export const HiddenChatsModal: React.FC<HiddenChatsModalProps> = ({
  isOpen,
  hiddenContacts,
  messages,
  onClose,
  onSelectChat,
  onUnhideChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#111b21] border border-emerald-500/40 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-[#0f171c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">GB Hidden Vault</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  ENCRYPTED
                </span>
              </div>
              <p className="text-xs text-slate-400">Isolated channels invisible in regular chat lists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {hiddenContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">Vault is Empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No chats are currently hidden. You can hide any chat from contact privacy options.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {hiddenContacts.map((contact) => {
                const lastMsg = messages
                  .filter((m) => m.senderId === contact.id || m.recipientId === contact.id)
                  .pop();

                return (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-2xl bg-[#202c33] border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => {
                        onSelectChat(contact.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                    >
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-white truncate">{contact.name}</h4>
                          <span className="text-[10px] text-slate-500">{lastMsg?.timestamp || ''}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {lastMsg ? lastMsg.text : contact.about}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectChat(contact.id);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors"
                        title="Open Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onUnhideChat(contact.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Unhide chat"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security badge footer */}
        <div className="p-4 bg-[#0b141a] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Biometric Hardware Keystore
          </span>
          <span className="font-mono text-[10px] text-slate-500">AES-256 GCM</span>
        </div>
      </div>
    </div>
  );
};
