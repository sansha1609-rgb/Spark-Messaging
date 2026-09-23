import React from 'react';
import { ThemeConfig, ThemePreset } from '../types/chat';
import { Palette, Moon, Sun, Sparkles, Check, X, Image as ImageIcon } from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  theme: ThemeConfig;
  onUpdateTheme: (newTheme: Partial<ThemeConfig>) => void;
  onClose: () => void;
}

interface PresetOption {
  id: ThemePreset;
  name: string;
  accent: string;
  bgDark: string;
  desc: string;
}

const PRESETS: PresetOption[] = [
  {
    id: 'emerald',
    name: 'WhatsApp Emerald',
    accent: '#00a884',
    bgDark: '#111b21',
    desc: 'The iconic WhatsApp green aesthetic with refined slate surfaces',
  },
  {
    id: 'cyberpunk',
    name: 'GB Dark Cyber / Neon',
    accent: '#06b6d4',
    bgDark: '#08131e',
    desc: 'Cyan electric accents inspired by classic GB WhatsApp modding',
  },
  {
    id: 'oled',
    name: 'Midnight OLED Black',
    accent: '#10b981',
    bgDark: '#000000',
    desc: 'Pure deep black canvas for maximum battery savings and contrast',
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst',
    accent: '#a855f7',
    bgDark: '#140c1e',
    desc: 'Deep violet plum atmosphere with velvet message bubbles',
  },
  {
    id: 'solar',
    name: 'Solar Amber',
    accent: '#f59e0b',
    bgDark: '#1c150c',
    desc: 'Warm sunset tones with golden illumination accents',
  },
  {
    id: 'arctic',
    name: 'Nordic Arctic Blue',
    accent: '#38bdf8',
    bgDark: '#0d1829',
    desc: 'Crisp iceberg hues with clean minimalist readability',
  },
];

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  theme,
  onUpdateTheme,
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
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Themes & Customization</h3>
              <p className="text-xs text-slate-400">GB Theme Engine: Presets, accents, and bubble geometry</p>
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
          {/* Light / Dark Mode switch */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Display Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateTheme({ isDark: true })}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all ${
                  theme.isDark
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-sm'
                    : 'border-slate-800 bg-[#202c33] text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark Theme
              </button>
              <button
                type="button"
                onClick={() => onUpdateTheme({ isDark: false })}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all ${
                  !theme.isDark
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-sm'
                    : 'border-slate-800 bg-[#202c33] text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light Theme
              </button>
            </div>
          </div>

          {/* Curated Theme Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Color Atmosphere Presets</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESETS.map((p) => {
                const isSelected = theme.preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onUpdateTheme({ preset: p.id, accentColor: p.accent })}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-[#202c33] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-sm"
                        style={{ backgroundColor: p.accent }}
                      />
                      <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{p.desc}</p>
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Bubble Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Chat Bubble Geometry</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'rounded', label: 'Classic Rounded' },
                  { id: 'modern', label: 'Modern Soft' },
                  { id: 'sharp', label: 'Crisp Tech' },
                ] as const
              ).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onUpdateTheme({ bubbleStyle: b.id })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    theme.bubbleStyle === b.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-[#202c33] text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Wallpaper Texture */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Wallpaper Background</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'doodle', label: 'Subtle Doodles' },
                  { id: 'solid', label: 'Deep Solid' },
                  { id: 'minimal', label: 'Minimalist' },
                  { id: 'grid', label: 'Dark Grid' },
                ] as const
              ).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onUpdateTheme({ wallpaper: w.id })}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    theme.wallpaper === w.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-[#202c33] text-slate-400 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0c1418] border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};
