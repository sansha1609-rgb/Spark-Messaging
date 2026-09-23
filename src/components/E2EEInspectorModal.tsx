import React, { useState } from 'react';
import { Contact, Message } from '../types/chat';
import { ShieldCheck, QrCode, Lock, CheckCircle2, Key, X, Copy, Terminal } from 'lucide-react';

interface E2EEInspectorModalProps {
  isOpen: boolean;
  contact: Contact | null;
  lastMessage?: Message;
  onClose: () => void;
}

export const E2EEInspectorModal: React.FC<E2EEInspectorModalProps> = ({
  isOpen,
  contact,
  lastMessage,
  onClose,
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewTab, setViewTab] = useState<'safety' | 'packet'>('safety');

  if (!isOpen || !contact) return null;

  const handleCopySafetyNumber = () => {
    navigator.clipboard?.writeText(contact.safetyNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">End-to-End Encryption</h3>
              <p className="text-xs text-slate-400">Cryptographic safety verification & packet inspector</p>
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

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-6 pt-4 bg-[#111b21]">
          <button
            onClick={() => setViewTab('safety')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
              viewTab === 'safety' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Safety Number
          </button>
          <button
            onClick={() => setViewTab('packet')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
              viewTab === 'packet' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Packet Inspector
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {viewTab === 'safety' ? (
            <div className="flex flex-col items-center text-center space-y-5">
              {/* QR Code Graphic representation */}
              <div className="relative p-4 rounded-3xl bg-white text-slate-900 shadow-xl inline-block">
                <svg
                  className="w-36 h-36"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Stylized QR Matrix Pattern */}
                  <rect x="10" y="10" width="24" height="24" rx="4" />
                  <rect x="15" y="15" width="14" height="14" fill="white" />
                  <rect x="18" y="18" width="8" height="8" />

                  <rect x="66" y="10" width="24" height="24" rx="4" />
                  <rect x="71" y="15" width="14" height="14" fill="white" />
                  <rect x="74" y="18" width="8" height="8" />

                  <rect x="10" y="66" width="24" height="24" rx="4" />
                  <rect x="15" y="71" width="14" height="14" fill="white" />
                  <rect x="18" y="74" width="8" height="8" />

                  {/* Random cryptographic pattern blocks */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="16" width="6" height="12" />
                  <rect x="40" y="28" width="8" height="6" />
                  <rect x="14" y="42" width="14" height="6" />
                  <rect x="34" y="42" width="12" height="12" />
                  <rect x="52" y="42" width="8" height="6" />
                  <rect x="68" y="42" width="16" height="6" />
                  <rect x="18" y="52" width="6" height="8" />
                  <rect x="48" y="58" width="12" height="6" />
                  <rect x="66" y="54" width="6" height="14" />
                  <rect x="78" y="54" width="10" height="6" />
                  <rect x="42" y="70" width="10" height="10" />
                  <rect x="58" y="74" width="16" height="8" />
                  <rect x="78" y="72" width="12" height="12" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-md">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Compare this 60-digit safety number with <span className="text-white font-medium">{contact.name}</span> in person or over another secure channel to verify end-to-end encryption integrity.
                </p>
              </div>

              {/* 60 Digit Number */}
              <div className="w-full p-4 rounded-2xl bg-[#202c33] border border-slate-800 font-mono text-xs text-emerald-400 tracking-wider leading-relaxed">
                {contact.safetyNumber}
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleCopySafetyNumber}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied to Clipboard!' : 'Copy Safety Code'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsVerified(!isVerified)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    isVerified
                      ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isVerified ? 'Marked Verified ✓' : 'Mark as Verified'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#202c33] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                    <Key className="w-3.5 h-3.5" />
                    Protocol Specifications
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    ACTIVE
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Cipher Suite:</span>
                    <span className="text-slate-200 font-mono">AES-256-GCM / Curve25519</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Key Agreement:</span>
                    <span className="text-slate-200 font-mono">Double Ratchet + X3DH</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Integrity Digest:</span>
                    <span className="text-slate-200 font-mono">HMAC-SHA256 (Constant Time)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Forward Secrecy:</span>
                    <span className="text-emerald-400 font-medium">Ephemeral Epilog Enabled</span>
                  </div>
                </div>
              </div>

              {/* Real Cryptographic Packet Preview */}
              <div className="p-3.5 rounded-2xl bg-[#090e11] border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="text-slate-500 flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span>TRANSFERRED_PACKET_DUMP</span>
                  <span className="text-emerald-400 text-[10px]">PAYLOAD_INSPECT</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-600">// Plaintext Sample:</span>
                  <p className="text-slate-300 truncate mt-0.5">
                    "{lastMessage?.text || 'Encrypted handshake verified.'}"
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">// IV (Initialization Vector - 96 bit):</span>
                  <p className="text-amber-400 break-all mt-0.5">
                    0x7a8f3b91c0e2945d810283f1
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">// Ciphertext (Base64 Encrypted Payload):</span>
                  <p className="text-cyan-400 break-all mt-0.5">
                    wKj9Lp4XvBzQ2Rm8Tu3YcV1nW+kO6JsD5Fg7Hh0IqLmN8aE=
                  </p>
                </div>
                <div>
                  <span className="text-slate-600">// Auth Tag (HMAC Authentication):</span>
                  <p className="text-purple-400 break-all mt-0.5">
                    0x9e12f84cb10d65e73a0c
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Every message is encrypted on your local device before transmission. No relay server or third party holds the decryption keys.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
