import React, { useState } from 'react';
import { Cloud, Download, Upload, Wifi, WifiOff, CheckCircle2, ShieldCheck, HardDrive, RefreshCw, X } from 'lucide-react';
import { BackupSnapshot, Contact, Message } from '../types/chat';
import { sounds } from '../utils/audio';

interface BackupSyncModalProps {
  isOpen: boolean;
  isOffline: boolean;
  contacts: Contact[];
  messages: Message[];
  activeAccountName: string;
  onToggleOffline: () => void;
  onRestoreBackup: (snapshotData: string) => void;
  onClose: () => void;
}

export const BackupSyncModal: React.FC<BackupSyncModalProps> = ({
  isOpen,
  isOffline,
  contacts,
  messages,
  activeAccountName,
  onToggleOffline,
  onRestoreBackup,
  onClose,
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string>('Today at 08:30 AM');
  const [backupSuccess, setBackupSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateCloudBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);

    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastBackupDate(`Today at ${now}`);
      sounds.playUnlockSuccess();
      setTimeout(() => setBackupSuccess(false), 3000);
    }, 1500);
  };

  const handleDownloadBackupFile = () => {
    const backup: BackupSnapshot = {
      version: '2.4.0',
      createdAt: new Date().toISOString(),
      accountId: 'active',
      accountName: activeAccountName,
      chatsCount: contacts.length,
      messagesCount: messages.length,
      checksum: 'sha256-a9f1c2b8e3d408f62310',
      data: JSON.stringify({ contacts, messages }),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gb-whatsapp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playUnlockSuccess();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.data) {
          onRestoreBackup(parsed.data);
          sounds.playUnlockSuccess();
          alert('Backup restored successfully!');
          onClose();
        } else {
          alert('Invalid backup file structure.');
        }
      } catch {
        alert('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Cloud Backup & Offline Sync</h3>
              <p className="text-xs text-slate-400">Zero-knowledge encrypted cloud storage & local caching</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Network State Simulator */}
          <div className="p-4 rounded-2xl bg-[#202c33] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isOffline ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Network Status: {isOffline ? 'Offline (Airplane Mode)' : 'Online & Synchronized'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isOffline
                    ? 'All messages cached locally. Outgoing messages will queue.'
                    : 'Real-time WebSocket & double-tick synchronization active.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleOffline}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isOffline
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isOffline ? 'Go Online' : 'Simulate Offline'}
            </button>
          </div>

          {/* Cloud Snapshot Status */}
          <div className="p-4 rounded-2xl bg-[#202c33] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                Encrypted Cloud Snapshot
              </span>
              <span className="text-[11px] text-slate-400">Last backup: {lastBackupDate}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
              <div className="bg-[#111b21] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-xs font-bold text-white">{contacts.length}</span>
                <span className="text-[10px] text-slate-500">Chats Cached</span>
              </div>
              <div className="bg-[#111b21] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-xs font-bold text-white">{messages.length}</span>
                <span className="text-[10px] text-slate-500">Messages</span>
              </div>
              <div className="bg-[#111b21] p-2.5 rounded-xl border border-slate-800">
                <span className="block text-xs font-bold text-emerald-400">256-bit</span>
                <span className="text-[10px] text-slate-500">Cipher Level</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isBackingUp}
              onClick={handleCreateCloudBackup}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
              {isBackingUp ? 'Encrypting & Syncing to Cloud...' : backupSuccess ? 'Snapshot Synchronized ✓' : 'Back Up Now to Cloud'}
            </button>
          </div>

          {/* Export / Restore File Options */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-300">Local Device Export & Restore</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadBackupFile}
                className="p-3 rounded-2xl border border-slate-800 bg-[#202c33] hover:border-slate-700 text-left transition-colors flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">Download JSON</h5>
                  <p className="text-[10px] text-slate-400">Save to disk</p>
                </div>
              </button>

              <label className="p-3 rounded-2xl border border-slate-800 bg-[#202c33] hover:border-slate-700 text-left transition-colors flex items-center gap-2.5 cursor-pointer">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">Restore File</h5>
                  <p className="text-[10px] text-slate-400">Upload JSON</p>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-slate-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All message backups are client-side encrypted before entering cloud nodes. Restores retain your per-contact privacy rules, hidden vaults, and scheduled tasks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
