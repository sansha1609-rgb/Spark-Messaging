import React, { useState } from 'react';
import { StatusStory } from '../types/chat';
import { EyeOff, Eye, Plus, Send, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface StatusStoriesModalProps {
  isOpen: boolean;
  stories: StatusStory[];
  myAvatar: string;
  onAddStory: (story: Omit<StatusStory, 'id' | 'viewersCount' | 'isViewedByMe'>) => void;
  onViewStory: (storyId: string, isGhost: boolean) => void;
  onClose: () => void;
}

export const StatusStoriesModal: React.FC<StatusStoriesModalProps> = ({
  isOpen,
  stories,
  myAvatar,
  onAddStory,
  onViewStory,
  onClose,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isGhostMode, setIsGhostMode] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newText, setNewText] = useState('');
  const [newBgColor, setNewBgColor] = useState('#065f46');

  if (!isOpen) return null;

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    onViewStory(stories[index].id, isGhostMode);
    sounds.playOutgoingPop();
  };

  const handlePostStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddStory({
      authorId: 'me',
      authorName: 'My Status',
      authorAvatar: myAvatar,
      caption: newText.trim(),
      bgColor: newBgColor,
      timestamp: 'Just now',
    });

    setNewText('');
    setIsCreating(false);
    sounds.playUnlockSuccess();
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      handleOpenStory(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      handleOpenStory(activeStoryIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Full screen story player if a story is opened */}
      {activeStory ? (
        <div className="relative w-full max-w-sm h-[640px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 animate-in zoom-in-95 duration-200" style={{ backgroundColor: activeStory.bgColor || '#1e293b' }}>
          {/* Top Progress bar & author */}
          <div>
            <div className="flex gap-1 mb-4">
              {stories.map((s, idx) => (
                <div
                  key={s.id}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx <= activeStoryIndex! ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <img
                  src={activeStory.authorAvatar}
                  alt={activeStory.authorName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                />
                <div>
                  <h4 className="text-sm font-bold truncate">{activeStory.authorName}</h4>
                  <span className="text-[11px] text-white/80">{activeStory.timestamp}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveStoryIndex(null)}
                className="p-2 text-white/80 hover:text-white rounded-full bg-black/20 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Caption / Quote */}
          <div className="text-center px-4">
            <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed tracking-tight drop-shadow-md">
              "{activeStory.caption}"
            </p>
          </div>

          {/* Bottom Ghost Status & Navigation */}
          <div className="flex items-center justify-between">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs font-medium flex items-center gap-1.5 border border-white/10">
              <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
              {isGhostMode ? 'Ghost View Active (Hidden)' : 'Public View'}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevStory}
                disabled={activeStoryIndex === 0}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextStory}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Stories List & Creator */
        <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Status & Stories</h3>
              <p className="text-xs text-slate-400">Share moments and view friends with GB Ghost Stealth</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ghost View Banner */}
          <div className="px-6 py-3 bg-[#0d161b] border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">GB Ghost Stealth View</span>
            </div>
            <button
              type="button"
              onClick={() => setIsGhostMode(!isGhostMode)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                isGhostMode
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isGhostMode ? 'Enabled (Hidden)' : 'Disabled'}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* My Status */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#202c33] border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={myAvatar}
                    alt="My avatar"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">My Status</h4>
                  <p className="text-[11px] text-slate-400">Tap to add status update</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                Post
              </button>
            </div>

            {/* Creator form if clicked */}
            {isCreating && (
              <form onSubmit={handlePostStory} className="p-4 rounded-2xl bg-[#0c1418] border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">Compose New Story</span>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="What is on your mind?..."
                  className="w-full bg-[#1e293b] rounded-xl p-3 text-xs text-white border border-slate-700 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Color:</span>
                  {['#065f46', '#1e3a8a', '#581c87', '#7c2d12', '#0f172a'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewBgColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        newBgColor === c ? 'scale-110 border-white ring-2 ring-emerald-400' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!newText.trim()}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  Share to Status
                </button>
              </form>
            )}

            {/* Recent Updates */}
            <div>
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Recent Updates
              </h5>
              <div className="space-y-2">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    onClick={() => handleOpenStory(index)}
                    className="p-3 rounded-2xl bg-[#202c33] border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-0.5 rounded-full ring-2 ${
                          story.isViewedByMe ? 'ring-slate-600' : 'ring-emerald-500'
                        }`}
                      >
                        <img
                          src={story.authorAvatar}
                          alt={story.authorName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{story.authorName}</h4>
                        <span className="text-[11px] text-slate-400">{story.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
