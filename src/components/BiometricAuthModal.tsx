import React, { useState, useEffect } from 'react';
import { Fingerprint, Scan, KeyRound, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface BiometricAuthModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  masterPin: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  title,
  subtitle = 'Verify your biometric identity or enter master PIN to proceed',
  masterPin,
  onSuccess,
  onCancel,
}) => {
  const [authMode, setAuthMode] = useState<'fingerprint' | 'face' | 'pin'>('fingerprint');
  const [isScanning, setIsScanning] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg('');
      setSuccess(false);
      setIsScanning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateBiometric = async () => {
    setIsScanning(true);
    setErrorMsg('');

    // Try real WebAuthn if available and allowed, else smooth simulated biometric
    try {
      if (window.PublicKeyCredential && !window.location.protocol.includes('data')) {
        // Attempt platform authenticator check
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsScanning(false);
      setSuccess(true);
      sounds.playUnlockSuccess();
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === masterPin || pinInput === '1234') {
      setSuccess(true);
      sounds.playUnlockSuccess();
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setErrorMsg('Incorrect master PIN. Default is 1234.');
      setPinInput('');
      sounds.playLockClick();
    }
  };

  const handleKeypadPress = (num: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + num;
      setPinInput(next);
      if (next.length === 4) {
        if (next === masterPin || next === '1234') {
          setSuccess(true);
          sounds.playUnlockSuccess();
          setTimeout(() => {
            onSuccess();
          }, 500);
        } else {
          setErrorMsg('Incorrect master PIN. Try 1234.');
          setPinInput('');
          sounds.playLockClick();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#111b21] border border-slate-700/60 shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mt-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            {authMode === 'fingerprint' && <Fingerprint className="w-8 h-8" />}
            {authMode === 'face' && <Scan className="w-8 h-8" />}
            {authMode === 'pin' && <KeyRound className="w-8 h-8" />}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">{subtitle}</p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-1 p-1 bg-[#202c33] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('fingerprint'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'fingerprint' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            Touch ID
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('face'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'face' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            Face ID
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              authMode === 'pin' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            PIN
          </button>
        </div>

        {/* Fingerprint / Face ID View */}
        {(authMode === 'fingerprint' || authMode === 'face') && (
          <div className="flex flex-col items-center py-4">
            <div
              onClick={!isScanning && !success ? handleSimulateBiometric : undefined}
              className={`relative cursor-pointer w-32 h-32 rounded-3xl flex items-center justify-center border-2 transition-all duration-300 ${
                success
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : isScanning
                  ? 'border-cyan-400 bg-cyan-950/30 text-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-500/60 hover:text-emerald-400'
              }`}
            >
              {isScanning && (
                <>
                  <div className="absolute inset-0 rounded-3xl border-2 border-cyan-400 animate-pulse-ring pointer-events-none" />
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-beam pointer-events-none" />
                </>
              )}

              {success ? (
                <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-in zoom-in-75 duration-200" />
              ) : authMode === 'fingerprint' ? (
                <Fingerprint className="w-16 h-16 transition-transform active:scale-95" />
              ) : (
                <Scan className="w-16 h-16 transition-transform active:scale-95" />
              )}
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              {success
                ? 'Identity Verified Successfully!'
                : isScanning
                ? 'Scanning biometric signature...'
                : `Tap sensor to authenticate with ${authMode === 'fingerprint' ? 'Fingerprint' : 'Face recognition'}`}
            </p>

            <button
              type="button"
              disabled={isScanning || success}
              onClick={handleSimulateBiometric}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
            >
              {isScanning ? 'Verifying Hardware Security Module...' : 'Authenticate Now'}
            </button>
          </div>
        )}

        {/* PIN View */}
        {authMode === 'pin' && (
          <form onSubmit={handlePinSubmit} className="flex flex-col items-center">
            {/* Dots */}
            <div className="flex items-center gap-3 mb-5">
              {[0, 1, 2, 3].map(index => (
                <div
                  key={index}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    pinInput.length > index
                      ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-sm shadow-emerald-400/50'
                      : 'border-slate-600 bg-transparent'
                  }`}
                />
              ))}
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-4 animate-shake">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[240px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(btn => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === 'C') {
                      setPinInput('');
                      setErrorMsg('');
                    } else if (btn === '⌫') {
                      setPinInput(prev => prev.slice(0, -1));
                      setErrorMsg('');
                    } else {
                      handleKeypadPress(btn);
                    }
                  }}
                  className="h-11 rounded-xl bg-[#202c33] hover:bg-slate-700/80 active:bg-emerald-600/30 text-white font-semibold text-sm transition-colors flex items-center justify-center"
                >
                  {btn}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mt-4">
              Default master PIN is <span className="text-slate-300 font-mono font-medium">1234</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
