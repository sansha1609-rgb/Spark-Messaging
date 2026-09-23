import React, { useState } from 'react';
import { Contact, ScheduledMessage } from '../types/chat';
import { Calendar, Clock, Send, Trash2, Repeat, CheckCircle, X, PlusCircle } from 'lucide-react';

interface MessageSchedulerModalProps {
  isOpen: boolean;
  contacts: Contact[];
  scheduledMessages: ScheduledMessage[];
  onClose: () => void;
  onAddSchedule: (schedule: Omit<ScheduledMessage, 'id' | 'createdAt' | 'status'>) => void;
  onCancelSchedule: (id: string) => void;
  onSendNow: (schedule: ScheduledMessage) => void;
  initialContactId?: string;
}

export const MessageSchedulerModal: React.FC<MessageSchedulerModalProps> = ({
  isOpen,
  contacts,
  scheduledMessages,
  onClose,
  onAddSchedule,
  onCancelSchedule,
  onSendNow,
  initialContactId,
}) => {
  const [recipientId, setRecipientId] = useState(initialContactId || contacts[0]?.id || '');
  const [text, setText] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date(Date.now() + 1000 * 60 * 30);
    return d.toISOString().slice(0, 16);
  });
  const [repeat, setRepeat] = useState<'once' | 'daily' | 'weekly'>('once');
  const [tab, setTab] = useState<'create' | 'active'>('create');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !recipientId) return;

    onAddSchedule({
      recipientId,
      text: text.trim(),
      scheduledTime: new Date(date).toISOString(),
      repeat,
    });

    setText('');
    setTab('active');
  };

  const handleQuickPreset = (minutesFromNow: number) => {
    const d = new Date(Date.now() + 1000 * 60 * minutesFromNow);
    setDate(d.toISOString().slice(0, 16));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Message Scheduler</h3>
              <p className="text-xs text-slate-400">Auto-dispatch encrypted messages at precise times</p>
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
            onClick={() => setTab('create')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
              tab === 'create' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Schedule New
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
              tab === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/40'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Pending Queue ({scheduledMessages.filter(m => m.status === 'pending').length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Recipient Contact</label>
                <select
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  className="w-full bg-[#202c33] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#202c33] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                {/* Quick presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500">Quick:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(15)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    +15 min
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(60)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    +1 hour
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(60 * 8)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    +8 hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(60 * 24)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Recurrence</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['once', 'daily', 'weekly'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRepeat(r)}
                      className={`py-2 px-3 text-xs font-medium rounded-xl border text-center capitalize transition-colors ${
                        repeat === r
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-800 bg-[#202c33] text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Message Content</label>
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type the message to automatically send..."
                  className="w-full bg-[#202c33] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!text.trim()}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Schedule Message
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {scheduledMessages.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No scheduled messages in queue.
                </div>
              ) : (
                scheduledMessages.map((msg) => {
                  const targetContact = contacts.find((c) => c.id === msg.recipientId);
                  const scheduledDate = new Date(msg.scheduledTime);
                  const diffMinutes = Math.round((scheduledDate.getTime() - Date.now()) / (1000 * 60));

                  return (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-2xl bg-[#202c33] border border-slate-800/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={targetContact?.avatar || ''}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-white">
                            {targetContact?.name || 'Contact'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Repeat className="w-2.5 h-2.5" />
                            {msg.repeat}
                          </span>
                        </div>
                        <span className="text-[11px] text-amber-400 font-mono">
                          {diffMinutes > 0 ? `In ${diffMinutes}m` : 'Due now'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 bg-black/20 p-2.5 rounded-xl">
                        "{msg.text}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {scheduledDate.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSendNow(msg)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-medium transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Send Now
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelSchedule(msg.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            aria-label="Cancel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
