import React from 'react';
import { AccountProfile } from '../types/chat';
import { Shield, Lock, Eye, Bell, Key, Smartphone, X, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  activeAccount: AccountProfile;
  onUpdateAccount: (updated: Partial<AccountProfile>) => void;
  onClose: () => void;
}

export const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  isOpen,
  activeAccount,
  onUpdateAccount,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">GB Stealth & Security Engine</h3>
              <p className="text-xs text-slate-400">Global privacy switches, biometric locks, and protocol flags</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Privacy & Stealth */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Stealth Privacy
            </h4>

            {/* Freeze Last Seen */}
            <div className="p-3 rounded-2xl bg-[#202c33] border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-white">Freeze Last Seen</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Freezes your last active timestamp. Others cannot see when you are currently online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateAccount({ freezeLastSeen: !activeAccount.freezeLastSeen });
                  sounds.playOutgoingPop();
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  activeAccount.freezeLastSeen ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                    activeAccount.freezeLastSeen ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Anti-View Once */}
            <div className="p-3 rounded-2xl bg-[#202c33] border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-white">Anti-View Once Media</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allows viewing and saving "View Once" media files without sender expiration.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateAccount({ antiViewOnce: !activeAccount.antiViewOnce });
                  sounds.playOutgoingPop();
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  activeAccount.antiViewOnce ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                    activeAccount.antiViewOnce ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Disable Forwarded Tag */}
            <div className="p-3 rounded-2xl bg-[#202c33] border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-white">Disable 'Forwarded' Tag</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Forwarded messages appear as direct compositions without the forwarded notice.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateAccount({ disableForwardedTag: !activeAccount.disableForwardedTag });
                  sounds.playOutgoingPop();
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  activeAccount.disableForwardedTag ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                    activeAccount.disableForwardedTag ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Biometric Access Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Biometric Access & App Lock
            </h4>

            {/* Biometric toggle */}
            <div className="p-3 rounded-2xl bg-[#202c33] border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-white">Biometric Authentication</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Require fingerprint or facial scan to open application and encrypted vaults.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateAccount({ biometricEnabled: !activeAccount.biometricEnabled });
                  sounds.playUnlockSuccess();
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  activeAccount.biometricEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                    activeAccount.biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Lock Timeout options */}
            <div className="p-3 rounded-2xl bg-[#202c33] border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-white">Auto-Lock Timeout</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: 'immediate', label: 'Instant' },
                    { id: '1m', label: '1 min' },
                    { id: '5m', label: '5 min' },
                    { id: 'off', label: 'Off' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateAccount({ appLockTimeout: t.id })}
                    className={`py-2 text-xs font-medium rounded-xl border transition-colors ${
                      activeAccount.appLockTimeout === t.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-[#111b21] text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0c1418] border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
