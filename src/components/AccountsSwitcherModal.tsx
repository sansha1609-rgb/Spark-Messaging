import React, { useState } from 'react';
import { AccountProfile } from '../types/chat';
import { Users, Check, Plus, Shield, Phone, Sparkles, X, Trash2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AccountsSwitcherModalProps {
  isOpen: boolean;
  accounts: AccountProfile[];
  activeAccountId: string;
  onSelectAccount: (accountId: string) => void;
  onAddAccount: (newAccount: AccountProfile) => void;
  onClose: () => void;
}

export const AccountsSwitcherModal: React.FC<AccountsSwitcherModalProps> = ({
  isOpen,
  accounts,
  activeAccountId,
  onSelectAccount,
  onAddAccount,
  onClose,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  if (!isOpen) return null;

  const handleSwitch = (id: string) => {
    onSelectAccount(id);
    sounds.playUnlockSuccess();
    onClose();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newAcc: AccountProfile = {
      id: 'acc_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      avatar: '/src/assets/images/avatar_alex_tech_1790140723394.jpg',
      statusBio: bio.trim() || 'Hey there! I am using GB WhatsApp.',
      lastSeenPrivacy: 'contacts',
      onlinePrivacy: 'stealth',
      freezeLastSeen: false,
      disableForwardedTag: true,
      antiViewOnce: true,
      callPrivacy: 'contacts',
      appLockTimeout: 'immediate',
      biometricEnabled: true,
      masterPin: '1234',
    };

    onAddAccount(newAcc);
    setIsAdding(false);
    setName('');
    setPhone('');
    setBio('');
    sounds.playUnlockSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Multi-Account Manager</h3>
              <p className="text-xs text-slate-400">Switch profiles seamlessly with isolated privacy rules</p>
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
          {isAdding ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Register New Account Profile</h4>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Work Mobile, Secondary SIM"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Status Bio</label>
                <input
                  type="text"
                  placeholder="Available for chats"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
                >
                  Save & Switch
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {accounts.map((acc) => {
                const isActive = acc.id === activeAccountId;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSwitch(acc.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/40'
                        : 'bg-[#202c33] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {acc.freezeLastSeen && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#111b21] flex items-center justify-center text-[9px] text-white" title="Stealth / Frozen">
                            ❄️
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">{acc.name}</h4>
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{acc.phone}</p>
                        <p className="text-[11px] text-slate-500 truncate">{acc.statusBio}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isActive ? (
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-xs text-slate-400 hover:text-emerald-400 font-medium px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="w-full mt-4 py-3 px-4 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Account / Clone Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
