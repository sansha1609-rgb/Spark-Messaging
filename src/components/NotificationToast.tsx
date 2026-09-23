import React from 'react';
import { Shield, MessageCircle, X } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    id: string;
    senderName: string;
    avatar: string;
    text: string;
    contactId: string;
  } | null;
  onOpenChat: (contactId: string) => void;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onOpenChat,
  onDismiss,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="p-3.5 rounded-2xl bg-[#1f2c34] border border-emerald-500/50 shadow-2xl text-slate-100 flex items-center justify-between gap-3 backdrop-blur-md">
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
          onClick={() => onOpenChat(notification.contactId)}
        >
          <div className="relative shrink-0">
            <img
              src={notification.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white">
              <Shield className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-white truncate">{notification.senderName}</h5>
              <span className="text-[10px] text-emerald-400 font-medium">Now</span>
            </div>
            <p className="text-xs text-slate-300 truncate mt-0.5">{notification.text}</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
